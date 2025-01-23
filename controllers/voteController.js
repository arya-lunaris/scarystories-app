import express from 'express';
import { Story, Vote, Rating, Comment } from '../models/story.js';

const router = express.Router();

router.route('/stories/:id/vote').post(async (req, res, next) => {
        try {
            if (!req.session.user) {
                return res.redirect('/error/loginError');
            }

            const { value } = req.body;
            const story = await Story.findById(req.params.id);

            if (!story) {
                return res.redirect('/error/storyNotFound');
            }

            const existingVote = story.votes.find(vote => vote.user.toString() === req.session.user._id.toString());
            if (existingVote) {
                if (existingVote.value === value) {
                    const index = story.votes.findIndex(vote => vote.user.toString() === req.session.user._id.toString());
                    story.votes.splice(index, 1);
                } else {
                    existingVote.value = value;
                }
            } else {
                story.votes.push({ user: req.session.user._id, value });
            }

            await story.save();
            res.redirect(`/stories/${story._id}`);
        } catch (e) {
            next(e);
        }
    });

export default router;