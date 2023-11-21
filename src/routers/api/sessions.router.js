import { Router } from "express";
import passport from 'passport'
import { createHash, isValidPassword } from "../../utils.js";
import userModel from "../../models/user.model.js";

const router = Router();

router.post('/sessions', passport.authenticate('register', { failureRedirect: '/register' }) ,async (req,res)=>{
    res.redirect('/login')
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/login' }) ,async (req,res)=>{
    req.session.user = req.user;
    res.redirect('/api/products')
})

router.get('/session/github', passport.authenticate('github', {scope: ['user.email']}  ))

router.get('/api/session/github-callback', passport.authenticate('github',{failureRedirect:'/login'}), (req,res)=>{
    console.log('req.user', req.user);
    req.session.user = req.user;
    res.redirect('/api/products')
})

router.post('/recovery', async (req,res)=>{
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if(!user){
        return res.status(401).send('Correo o contraseña invalido')
    }
    await userModel.updateOne({email},{$set: {password:createHash(password)} })
    res.redirect('/login')
})

router.get('/logout', (req,res) =>{
    req.session.destroy((error)=>{
        res.redirect('/login')
    })
})

export default router