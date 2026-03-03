import AgentSettlement from '../models/AgentSettlement.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Get all agents with their aggregate commission data
// @route   GET /api/settlements
// @access  Private/Admin
export const getAgentSettlementList = asyncHandler(async (req, res) => {
    const agents = await User.find({ role: 'agent' }).select('name email phone role commissionRate avatar');

    const agentList = await Promise.all(
        agents.map(async (agent) => {
            // Aggregate pending commission
            const pendingOrders = await Order.find({
                agent: agent._id,
                commissionStatus: 'pending',
                orderStatus: 'Delivered'
            });

            const pendingCommission = pendingOrders.reduce((acc, order) => acc + (order.agentCommission || 0), 0);

            // Aggregate settled commission
            const settledOrders = await Order.find({
                agent: agent._id,
                commissionStatus: 'settled',
                orderStatus: 'Delivered' // or we rely purely on commissionStatus
            });
            const settledCommission = settledOrders.reduce((acc, order) => acc + (order.agentCommission || 0), 0);

            return {
                _id: agent._id,
                name: agent.name,
                email: agent.email,
                phone: agent.phone,
                avatar: agent.avatar,
                commissionRate: agent.commissionRate,
                pendingCommission,
                settledCommission,
                totalOrders: pendingOrders.length + settledOrders.length,
            };
        })
    );

    res.status(200).json({
        success: true,
        data: agentList,
    });
});

// @desc    Get specific agent summary
// @route   GET /api/settlements/:agentId/summary
// @access  Private/Admin
export const getAgentSummary = asyncHandler(async (req, res) => {
    const agent = await User.findById(req.params.agentId).select('name email phone commissionRate avatar role');

    if (!agent || agent.role !== 'agent') {
        return res.status(404).json({
            success: false,
            message: 'Agent not found',
        });
    }

    const pendingOrders = await Order.find({
        agent: agent._id,
        commissionStatus: 'pending',
        orderStatus: 'Delivered'
    });

    const settledOrders = await Order.find({
        agent: agent._id,
        commissionStatus: 'settled',
    });

    const pendingCommission = pendingOrders.reduce((acc, order) => acc + (order.agentCommission || 0), 0);
    const settledCommission = settledOrders.reduce((acc, order) => acc + (order.agentCommission || 0), 0);

    res.status(200).json({
        success: true,
        data: {
            agent,
            summary: {
                totalOrders: pendingOrders.length + settledOrders.length,
                pendingCommission,
                settledCommission,
            }
        },
    });
});

// @desc    Get pending orders for an agent
// @route   GET /api/settlements/:agentId/pending-orders
// @access  Private/Admin
export const getPendingOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({
        agent: req.params.agentId,
        commissionStatus: 'pending',
        orderStatus: 'Delivered'
    })
        .populate('user', 'name email')
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
    });
});

// @desc    Create a settlement for an agent
// @route   POST /api/settlements/:agentId/settle
// @access  Private/Admin
export const createSettlement = asyncHandler(async (req, res) => {
    const { orderIds, paymentMethod, notes } = req.body;
    const agentId = req.params.agentId;

    if (!orderIds || orderIds.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'No orders provided for settlement',
        });
    }

    // Verify all orders belong to the agent and are pending
    const ordersToSettle = await Order.find({
        _id: { $in: orderIds },
        agent: agentId,
        commissionStatus: 'pending'
    });

    if (ordersToSettle.length !== orderIds.length) {
        return res.status(400).json({
            success: false,
            message: 'Some orders are invalid, already settled, or do not belong to this agent',
        });
    }

    // Calculate total settlement amount
    const totalAmount = ordersToSettle.reduce((acc, order) => acc + (order.agentCommission || 0), 0);

    // Create Settlement Record
    const settlement = await AgentSettlement.create({
        agent: agentId,
        orders: orderIds,
        totalAmount,
        paymentMethod,
        notes,
        status: 'paid', // Immediately marking as paid for manual MVP
        processedBy: req.user._id,
        processedAt: new Date()
    });

    // Update Commission Status in Orders
    await Order.updateMany(
        { _id: { $in: orderIds } },
        {
            $set: { commissionStatus: 'settled' }
        }
    );

    // If order was a COD order, we might want to also ensure it's marked as `isPaid` here, if the agent handing over cash implies the order itself is fully paid to the system. 
    // Usually COD orders are marked paid when delivered. If not, do it here.
    const codOrderIds = ordersToSettle.filter(o => o.paymentMethod === 'COD' && !o.isPaid).map(o => o._id);
    if (codOrderIds.length > 0) {
        await Order.updateMany(
            { _id: { $in: codOrderIds } },
            { $set: { isPaid: true, paidAt: new Date() } }
        );
    }

    res.status(201).json({
        success: true,
        message: 'Settlement completed successfully',
        data: settlement,
    });
});

// @desc    Get the logged-in agent's own commission summary
// @route   GET /api/settlements/me
// @access  Private/Agent or Admin
export const getMyCommissionSummary = asyncHandler(async (req, res) => {
    const agentId = req.user._id;

    const pendingOrders = await Order.find({
        agent: agentId,
        commissionStatus: 'pending',
        orderStatus: 'Delivered'
    }).populate('user', 'name email').sort('-deliveredAt');

    const settledOrders = await Order.find({
        agent: agentId,
        commissionStatus: 'settled',
    }).sort('-deliveredAt').limit(20);

    const pendingCommission = pendingOrders.reduce((acc, o) => acc + (o.agentCommission || 0), 0);
    const settledCommission = settledOrders.reduce((acc, o) => acc + (o.agentCommission || 0), 0);

    const agent = await User.findById(agentId).select('name email commissionRate avatar');

    res.status(200).json({
        success: true,
        data: {
            agent,
            summary: {
                totalOrders: pendingOrders.length + settledOrders.length,
                pendingCommission,
                settledCommission,
            },
            pendingOrders,
            settledOrders,
        },
    });
});
