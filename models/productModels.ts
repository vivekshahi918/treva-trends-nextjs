import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    countInStock: {
        type: Number,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    features: {
        type: [],
        required: true,
        default: []
    },
    rating: {
        type:Number,
        required: false,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

}, { timestamps: true });


//delete old models if exists
if (mongoose.models && mongoose.models["products"])
    delete mongoose.models["products"];


export default mongoose.models['products'] || mongoose.model("products", productSchema);
