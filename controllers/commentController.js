import express from 'express';
import { Story, Vote, Rating, Comment } from '../models/story.js';

const router = express.Router();

router.post('/stories/:id/comments', async function(req, res, next) {
    try {
        if (!req.session.user) {
            return res.redirect('/error/loginError');
        }

        req.body.user = req.session.user;

        const story = await Story.findById(req.params.id);

        if (!story) {
            return res.redirect('/error/storyNotFound');
        }

        story.comments.push(req.body);

        await story.save();

        res.redirect(`/stories/${story._id}`); 
    } catch (e) {
        next(e);
    }
});

router.delete('/stories/:storyId/comments/:commentId', async function(req, res, next) {
    try {
        if (!req.session.user) {
            return res.redirect('/error/loginError');
        }

        const { storyId, commentId } = req.params;

        const story = await Story.findById(storyId);

        if (!story) {
            return res.redirect('/error/storyNotFound');
        }

        const commentIndex = story.comments.findIndex(comment => comment._id.toString() === commentId);

        if (commentIndex === -1) {
            return res.redirect('/error/commentNotFound');
        }

        if (story.comments[commentIndex].user.toString() !== req.session.user._id.toString()) {
            return res.redirect('/error/unauthorized');
        }

        story.comments.splice(commentIndex, 1);

        await story.save();

        res.redirect(`/stories/${story._id}`); 

    } catch (e) {
        next(e);
    }
});

export default router;