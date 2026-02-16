import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isPlaceholderValue = (value = '') => value.startsWith('your_');

export const isCloudinaryConfigured = () => {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        return false;
    }

    return ![
        CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET,
    ].some(isPlaceholderValue);
};

// Validate configuration
const validateCloudinaryConfig = () => {
    if (!isCloudinaryConfigured()) {
        console.warn(
            '⚠️  Warning: Cloudinary credentials not configured (or still set to placeholders). Image uploads will not work.'
        );
        return false;
    }
    console.log('✅ Cloudinary configured successfully');
    return true;
};

validateCloudinaryConfig();

export default cloudinary;
