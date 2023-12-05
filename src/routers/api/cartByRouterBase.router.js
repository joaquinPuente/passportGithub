import RouterBase from "./RouterBase.js";
import cartModel from "../../models/cart.model.js";
import productModel from "../../models/product.model.js";

export default class cartByRouterBase extends RouterBase {
  init() {
    this.get('/cart', ['PUBLIC'], async function (req, res) {
        const userId = req.session.user._id;
        //let userCart = await cartModel.findOne({ user: userId }).populate('items.product');
        let userCart = await cartModel.findOne({ user: userId });
        
        console.log('userCart: ', userCart);
        res.render('cartDetails', { userCart }); 
    });


    //Ruta para borrar los carritos desde el navegador
    this.post('/removeFromCart', ['PUBLIC'], async function (req, res) {
        
    });

    //Ruta para agregar productos a los carritos desde el navegador
    this.post('/addToCart', ['PUBLIC'], async function (req, res) {
        try {
            const { productId } = req.body;
            const userId = req.session.user._id; // Obtener el ID del usuario de la sesión
    
            // Encontrar el carrito del usuario o crear uno si no existe
            let userCart = await cartModel.findOne({ user: userId });
            if (!userCart) {
                userCart = new cartModel({ user: userId, items: [] });
            }
    
            // Agregar el producto al carrito del usuario
            userCart.items.push({ product: productId, quantity: 1 });
            await userCart.save();
    
            res.redirect('/api/products');
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            res.status(500).send('Error al agregar al carrito');
        }   
    });


  }
}

