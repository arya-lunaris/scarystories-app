import mongoose from "mongoose";
import User from '../models/user.js';
import stories from '../data.js';
import { Story } from '../models/story.js';
import dotenv from 'dotenv';
dotenv.config();

async function seed() {    
    await mongoose.connect(process.env.MONGODB_URI);
    await mongoose.connection.db.dropDatabase();

    const user = await User.create({
        username: "arya",
        email: "arya@arya.com",
        password: "Arya123!"
    });

    const storiesWithUser = stories.map(story => ({
        ...story,
        user: user._id
    }));

    await Story.create(storiesWithUser);
    console.log("success!")
}

seed();
