import express from 'express';
import { Story, Vote, Rating, Comment } from '../models/story.js';

const router = express.Router();

router.route('/stories/:id/rate').post(async (req, res, next) => {
    try {
        if (!req.session.user) {
            return res.redirect('/error/loginError');
        }

        const { value } = req.body;
        const ratingValue = Number(value);
        const story = await Story.findById(req.params.id);

        if (!story) {
            return res.redirect('/error/storyNotFound');
        }

        const existingRating = story.ratings.find(rating => rating.user.toString() === req.session.user._id.toString());
        if (existingRating) {
            if (existingRating.value === ratingValue) {
                const index = story.ratings.findIndex(rating => rating.user.toString() === req.session.user._id.toString());
                if (index !== -1) {
                    story.ratings.splice(index, 1);
                }
            } else {
                existingRating.value = ratingValue;
            }
        } else {
            story.ratings.push({ user: req.session.user._id, value: ratingValue });
        }

        await story.save();
        res.redirect(`/stories/${story._id}`);
    } catch (e) {
        next(e);
    }
});

export default router;