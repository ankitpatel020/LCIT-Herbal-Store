import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { Readable } from 'stream';

/**
 * Helper function to upload buffer to Cloudinary
 */
const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadOptions = {
            folder: folder,
            resource_type: 'auto',
            transformation: [
                { quality: 'auto:good' },
                { fetch_format: 'auto' },
            ],
        };

        const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
            if (error) {
                console.error('Cloudinary Upload Error (stream):', error);
                return reject(error);
            }
            resolve(result);
        });

        // Pipe buffer to upload stream
        try {
            const bufferStream = Readable.from(buffer);
            bufferStream.pipe(stream);
        } catch (streamErr) {
            console.error('Stream Error piping to Cloudinary:', streamErr);
            reject(streamErr);
        }
    });
};

/**
 * Helper function to delete image from Cloudinary
 */
const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
        return true;
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        return false;
    }
};

// @desc    Upload single image
// @route   POST /api/upload/image
// @access  Private
export const uploadImage = asyncHandler(async (req, res) => {
    console.log('📸 Upload Image Request Received');

    if (!req.file) {
        console.warn('⚠️ No file provided in request');
        return res.status(400).json({
            success: false,
            message: 'Please upload an image',
        });
    }

    console.log(`📁 File received: ${req.file.originalname}, Size: ${req.file.size} bytes, Mime: ${req.file.mimetype}`);

    const folder = req.body.folder || 'lcit-herbal-store/general';

    if (!isCloudinaryConfigured()) {
        return res.status(503).json({
            success: false,
            message:
                'Image upload service is not configured. Please set valid Cloudinary credentials in backend/.env and restart the server.',
        });
    }

    try {
        console.log(`☁️ Cloudinary Config Check - Cloud Name: ${cloudinary.config().cloud_name || 'NOT CONFIGURED'}`);
        console.log(`☁️ Uploading to Cloudinary folder: ${folder}`);

        const result = await uploadToCloudinary(req.file.buffer, folder);
        console.log('✅ Cloudinary upload successful:', result.public_id);

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                public_id: result.public_id,
                url: result.secure_url,
                width: result.width,
                height: result.height,
                format: result.format,
            },
        });
    } catch (error) {
        console.error('❌ Error uploading image to Cloudinary:', error);
        if (error) {
            console.error('Full Error Object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
        } else {
            console.error('Error is undefined or null');
        }

        const errorMessage = error && error.message ? error.message : 'Unknown error (error object is undefined or has no message)';

        res.status(500).json({
            success: false,
            message: 'Error uploading image to Cloudinary',
            error: errorMessage,
        });
    }
});

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private
export const uploadMultipleImages = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Please upload at least one image',
        });
    }

    const folder = req.body.folder || 'lcit-herbal-store/general';

    if (!isCloudinaryConfigured()) {
        return res.status(503).json({
            success: false,
            message:
                'Image upload service is not configured. Please set valid Cloudinary credentials in backend/.env and restart the server.',
        });
    }

    try {
        const uploadPromises = req.files.map((file) =>
            uploadToCloudinary(file.buffer, folder)
        );

        const results = await Promise.all(uploadPromises);

        const images = results.map((result) => ({
            public_id: result.public_id,
            url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
        }));

        res.status(200).json({
            success: true,
            message: `${images.length} image(s) uploaded successfully`,
            data: images,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error uploading images to Cloudinary',
            error: error.message,
        });
    }
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/image
// @access  Private
export const deleteImage = asyncHandler(async (req, res) => {
    const { public_id } = req.body;

    if (!public_id) {
        return res.status(400).json({
            success: false,
            message: 'Please provide public_id of the image to delete',
        });
    }

    if (!isCloudinaryConfigured()) {
        return res.status(503).json({
            success: false,
            message:
                'Image upload service is not configured. Please set valid Cloudinary credentials in backend/.env and restart the server.',
        });
    }

    try {
        const result = await deleteFromCloudinary(public_id);

        if (result) {
            res.status(200).json({
                success: true,
                message: 'Image deleted successfully',
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error deleting image from Cloudinary',
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting image from Cloudinary',
            error: error.message,
        });
    }
});

export { uploadToCloudinary, deleteFromCloudinary };
