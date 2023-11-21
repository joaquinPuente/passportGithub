import { Router } from "express";
import mongoose from "mongoose";
import cartModel from "../../models/cart.model.js";

const router = Router();

// Vista para visualizar los carritos desde el navegador
router.get('/carts', async (req,res)=>{
    const carritos = await cartModel.find();
    res.render('cart', {carritos: carritos.map(p =>p.toJSON())});
});

// Vista para visualizar un carrito específico desde el navegador
router.get('/cart/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartModel.findById(cid).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        const { cartNumber, products } = cart;
        res.render('cartDetails', { cartNumber, products: products.map(p =>p.toJSON())});
    } catch (error) {
        console.error('Error al cargar el carrito', error.message);
        res.status(500).json({ error: 'Error al cargar el carrito' });
    }
});

//Ruta para borrar los carritos desde el navegador
router.post('/removeFromCart', async (req, res) => {
    const { cartId, productId } = req.body;
    const validProductId = mongoose.isValidObjectId(productId) ? new mongoose.Types.ObjectId(productId) : null;

    try {
        if (!validProductId) {
            return res.status(400).json({ error: 'El productId proporcionado no es válido.' });
        }
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'No se encontró el carrito.' });
        }
        const productIndex = cart.products.findIndex(product => product.productId.equals(validProductId));
        if (productIndex === -1) {
            return res.status(404).json({ error: 'No se encontró el producto en el carrito.' });
        }
        cart.products.splice(productIndex, 1);
        await cart.save();
        console.log('Producto eliminado del carrito');
        res.redirect('/api/carts');
    } catch (error) {
        console.error('Error al eliminar producto del carrito', error.message);
        res.status(500).json({ error: `Error al eliminar producto del carrito: ${error.message}` });
    }
});

//Ruta para agregar productos a los carritos desde el navegador
router.post('/addToCart', async (req, res) => {
    const { productId, cid } = req.body;
    const cartNumber = parseInt(cid);
    try {
        let cart = await cartModel.findOne({ cartNumber });
        if (!cart) {
            cart = await cartModel.create({ cartNumber, products: [] });
        }
        const existingProduct = cart.products.find((product) => product.productId === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ productId, quantity: 1 });
        }
        await cart.save();
        console.log('Producto agregado al carrito:', productId);
        res.redirect('/api/products');
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un producto del carrito(POSTMAN)
router.delete('/carts/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await cartModel.findById(cid)
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        const productIndex = cart.products.findIndex((product) => product.productId.toString() === pid);
        if (productIndex === -1) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }
        cart.products.splice(productIndex, 1);
        await cart.save();
        res.status(200).json({ message: "Producto eliminado del carrito" });
    } catch (error) {
        console.error('Error al eliminar producto del carrito', error.message);
        res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
});

// Actualizar el carrito con un arreglo de productos(POSTMAN)
router.put('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    try {
        const cart = await cartModel.findByIdAndUpdate(cid, { products }, { new: true });
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error al actualizar el carrito', error.message);
        res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
});

// Actualizar la cantidad de un producto en el carrito(POSTMAN)
router.put('/carts/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        const product = cart.products.find((p) => p.productId.toString() === pid);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }
        product.quantity = quantity;
        await cart.save();
        res.status(200).json({ message: "Cantidad del producto actualizada" });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito', error.message);
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
    }
});

// Eliminar todos los productos del carrito(POSTMAN)
router.delete('/carts/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        cart.products = [];
        await cart.save();
        res.status(200).json({ message: "Todos los productos del carrito han sido eliminados" });
    } catch (error) {
        console.error('Error al eliminar todos los productos del carrito', error.message);
        res.status(500).json({ error: 'Error al eliminar todos los productos del carrito' });
    }
});

export default router;