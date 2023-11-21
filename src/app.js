// Importa las bibliotecas necesarias
import express from "express";
import passport from 'passport'
import homeRouter from './routers/api/home.router.js';
import productRouter from './routers/api/products.router.js';
import cartRouter from './routers/api/cart.router.js';
import chatRouter from './routers/api/chat.router.js';
import indexRouter from './routers/api/index.router.js';
import sessionRouter from './routers/api/sessions.router.js'
import ExpressSession from 'express-session'
import mongoStore from 'connect-mongo'
import path from 'path';
import { __dirname } from './utils.js';
import handlebars from 'express-handlebars';
import { URI } from "../src/db/mongoDB.js";
import { init as initPassportConfig } from './config/passport.config.js';

const app = express();
const secret = 'coder123'

app.use(ExpressSession({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  store: mongoStore.create({
    mongoUrl: URI,
    mongoOptions:{},
    ttl:120
  }),
  })
)


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

initPassportConfig()
app.use(passport.initialize())
app.use(passport.session())

app.use('/', homeRouter, indexRouter, sessionRouter);
app.use('/api', productRouter);
app.use('/api', cartRouter);
app.use('/api', chatRouter);

app.use((error, req, res, next) => {
  const message = `Ah ocurrido un error desconocido 😨: ${error.message}`;
  console.log(message);
  res.status(500).json({ status: 'error', message });
});


export default app;
