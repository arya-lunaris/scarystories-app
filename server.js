import express from 'express';
import mongoose from 'mongoose';
import path from 'path'; 
import methodOverride from 'method-override';
import storyController from './controllers/storyController.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use('/', storyController);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, 'views', 'stories'));
app.use(express.static(path.join(__dirname, 'public')));


const url = 'mongodb://127.0.0.1:27017/';
const dbname = 'scarystories-db'; 
mongoose.connect(`${url}${dbname}`, { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});