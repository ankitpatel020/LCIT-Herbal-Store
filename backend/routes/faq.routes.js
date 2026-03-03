import express from 'express';
import {
    getFAQs,
    getAdminFAQs,
    createFAQ,
    updateFAQ,
    deleteFAQ,
} from '../controllers/faq.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getFAQs);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/admin', getAdminFAQs);
router.post('/', createFAQ);
router.route('/:id').put(updateFAQ).delete(deleteFAQ);

export default router;
