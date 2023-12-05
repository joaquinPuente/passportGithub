import mongoose, { Schema } from 'mongoose';

const cartItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
});

const cartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [cartItemSchema]
});

export default mongoose.model('Cart', cartSchema);