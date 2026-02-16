import express from 'express';
import {
    uploadImage,
    uploadMultipleImages,
    deleteImage,
} from '../controllers/upload.controller.js';
import { uploadSingle, uploadMultiple } from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All upload routes require authentication
router.use(protect);

// Upload single image
router.post('/image', uploadSingle, uploadImage);

// Upload multiple images
router.post('/images', uploadMultiple, uploadMultipleImages);

// Delete image
router.delete('/image', deleteImage);

export default router;
