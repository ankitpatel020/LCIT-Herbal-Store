import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

console.log("Checking Razorpay configuration...");

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

console.log(`RAZORPAY_KEY_ID: ${keyId ? 'Found' : 'Missing'}`);
console.log(`RAZORPAY_KEY_SECRET: ${keySecret ? 'Found' : 'Missing'}`);

if (!keyId || !keySecret) {
    console.error("❌ Critical: Razorpay credentials missing in .env");
    process.exit(1);
}

const instance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
});

const testOrder = async () => {
    try {
        const options = {
            amount: 50000, // 500 INR
            currency: "INR",
            receipt: "order_rcptid_11",
        };
        console.log("Attempting to create test order...");
        const order = await instance.orders.create(options);
        console.log("✅ Order created successfully:", order);
    } catch (error) {
        console.error("❌ Failed to create order:", error);
    }
};

testOrder();
