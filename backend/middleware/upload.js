import multer from 'multer';
import path from 'path';

// Configure multer to use memory storage (for Cloudinary upload)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        const error = new Error(
            'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'
        );
        error.statusCode = 400;
        cb(error, false);
    }
};

// Multer upload configuration
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: fileFilter,
});

// Export different upload configurations
export const uploadSingle = upload.single('image');
export const uploadAvatar = upload.single('avatar');
export const uploadMultiple = upload.array('images', 5);

export default upload;
