import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, 'Please provide a question'],
            trim: true,
        },
        answer: {
            type: String,
            required: [true, 'Please provide an answer'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Please provide a category'],
            enum: ['Orders', 'Payments', 'Delivery', 'General'],
            default: 'General',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const FAQ = mongoose.model('FAQ', faqSchema);
export default FAQ;
