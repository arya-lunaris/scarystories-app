import express from 'express';
import mongoose from 'mongoose';
import path from 'path'; 
import methodOverride from 'method-override';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import MongoStore from 'connect-mongo'
import storyController from '../../controllers/storyController.js';
import userController from '../../controllers/userController.js'; 
import errorController from '../../controllers/errorController.js';
import commentController from '../../controllers/commentController.js'; 
import voteController from '../../controllers/voteController.js';
import rateController from '../../controllers/rateController.js';
import errorHandler from '../../middleware/errorHandler.js';
import session from 'express-session';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)

// const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
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
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/', storyController);
app.use('/user', userController);
app.use('/', commentController);
app.use('/', voteController);
app.use('/', rateController);
app.use('/error', errorController);
app.use(errorHandler);

export const handler = serverless(app)