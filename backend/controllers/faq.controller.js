import FAQ from '../models/FAQ.js';

// @desc    Get all FAQs
// @route   GET /api/faqs
// @access  Public
export const getFAQs = async (req, res, next) => {
    try {
        const faqs = await FAQ.find({ isActive: true });
        res.status(200).json({
            success: true,
            count: faqs.length,
            data: faqs,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all FAQs (Admin)
// @route   GET /api/faqs/admin
// @access  Private (Admin)
export const getAdminFAQs = async (req, res, next) => {
    try {
        const faqs = await FAQ.find();
        res.status(200).json({
            success: true,
            count: faqs.length,
            data: faqs,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new FAQ
// @route   POST /api/faqs
// @access  Private (Admin)
export const createFAQ = async (req, res, next) => {
    try {
        const faq = await FAQ.create(req.body);
        res.status(201).json({
            success: true,
            data: faq,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update FAQ
// @route   PUT /api/faqs/:id
// @access  Private (Admin)
export const updateFAQ = async (req, res, next) => {
    try {
        let faq = await FAQ.findById(req.params.id);

        if (!faq) {
            return res.status(404).json({ success: false, message: 'FAQ not found' });
        }

        faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: faq,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete FAQ
// @route   DELETE /api/faqs/:id
// @access  Private (Admin)
export const deleteFAQ = async (req, res, next) => {
    try {
        const faq = await FAQ.findById(req.params.id);

        if (!faq) {
            return res.status(404).json({ success: false, message: 'FAQ not found' });
        }

        await faq.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        next(error);
    }
};
