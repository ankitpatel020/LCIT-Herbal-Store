import mongoose from 'mongoose';

const agentSettlementSchema = new mongoose.Schema(
    {
        agent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order',
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
            default: 0,
        },
        paymentMethod: {
            type: String,
            enum: ['bank-transfer', 'upi', 'cash'],
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'paid'],
            default: 'pending',
        },
        notes: {
            type: String,
        },
        processedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Admin who processed this
        },
        processedAt: {
            type: Date,
        }
    },
    {
        timestamps: true,
    }
);

// Pre-save hook to add processedAt when status changes to paid
agentSettlementSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'paid' && !this.processedAt) {
        this.processedAt = new Date();
    }
    next();
});

const AgentSettlement = mongoose.model('AgentSettlement', agentSettlementSchema);

export default AgentSettlement;
