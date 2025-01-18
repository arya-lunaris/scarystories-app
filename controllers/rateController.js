import express from 'express';
import { Story, Vote, Rating, Comment } from '../models/story.js';

const router = express.Router();

router.route('/stories/:id/rate').post(async (req, res, next) => {
    try {
        if (!req.session.user) {
            return res.redirect('/error/loginError');
        }

        const { value } = req.body;  
        const story = await Story.findById(req.params.id);

        if (!story) {
            return res.redirect('/error/storyNotFound');
        }

        const existingRating = story.ratings.find(rating => rating.user.toString() === req.session.user._id.toString());

        if (existingRating) {
            existingRating.value = value; 
        } else {
            story.ratings.push({ user: req.session.user._id, value: value });  
        }

        await story.save();
        res.redirect(`/stories/${story._id}`);
    } catch (e) {
        next(e);
    }
});

export default router;