import mongoose from "mongoose";
import User from '../models/user.js';
import stories from '../data.js';
import models from '../models/story.js';
const { Story, Vote, Rating, Comment } = models;

async function seed() {
    await mongoose.connect('mongodb://127.0.0.1:27017/scarystories-db');
    await mongoose.connection.db.dropDatabase();

    const user = await User.create({
        username: "arya",
        email: "arya@arya.com",
        password: "Arya123!"
    });

    const user2 = await User.create({
        username: "lauren",
        email: "lauren@lauren.com",
        password: "Lauren123!"
    });

    const storiesWithUser = stories.map(story => ({
        ...story,
        user: user._id
    }));

    const newStories = await Story.create(storiesWithUser);

    const comment = {
        content: "This story was amazing!",
        user: user._id
    };

    newStories[0].comments.push(comment);

    await newStories[0].save();
    await mongoose.disconnect();
}

seed();