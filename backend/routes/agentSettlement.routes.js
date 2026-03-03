import express from 'express';
import {
    getAgentSettlementList,
    getAgentSummary,
    getPendingOrders,
    createSettlement,
    getMyCommissionSummary
} from '../controllers/agentSettlement.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Agent self-view route (agent or admin)
router.get('/me', protect, authorize('agent', 'admin'), getMyCommissionSummary);

// All remaining routes are Admin-only
router.use(protect);
router.use(authorize('admin'));

router.route('/')
    .get(getAgentSettlementList);

router.route('/:agentId/summary')
    .get(getAgentSummary);

router.route('/:agentId/pending-orders')
    .get(getPendingOrders);

router.route('/:agentId/settle')
    .post(createSettlement);

export default router;
