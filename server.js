import express from 'express';
import mongoose from 'mongoose';
import path from 'path'; 
import methodOverride from 'method-override';
import errorHandler from './middleware/errorHandler.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import MongoStore from 'connect-mongo'
import storyController from './controllers/storyController.js';
import userController from './controllers/userController.js'; 
import errorController from './controllers/errorController.js';
import commentController from './controllers/commentController.js'; 
import voteController from './controllers/voteController.js';
import rateController from './controllers/rateController.js';
import session from 'express-session';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/scarystories-db',
        collectionName: 'sessions', 
    }),
    cookie: {
        secure: false, 
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, 
    },
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/', storyController);
app.use('/user', userController);
app.use('/error', errorController);
app.use('/', commentController);
app.use('/', voteController);
app.use('/', rateController);

app.use(errorHandler);



const url = 'mongodb://127.0.0.1:27017/';
const dbname = 'scarystories-db'; 
mongoose.connect(`${url}${dbname}`, { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});