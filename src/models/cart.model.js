import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products', // Reemplaza 'Product' con el nombre de tu modelo de productos
    },
    quantity: { type: Number, default: 0 },
},{_id:false});

const cartSchema = new mongoose.Schema({
    cartNumber: { type: Number, required: true, unique: true },
    products: [productSchema],
});

cartSchema.plugin(mongoosePaginate)

export default mongoose.model('Cart', cartSchema);
