import express from 'express';
import { Story, Vote, Rating, Comment } from '../models/story.js';

const router = express.Router();

router.route('/home').get(async function (req, res, next) {
    try {
        res.render('stories/home.ejs');
    } catch (e) {
        next(e);
    }
});

router.route('/stories').get(async function (req, res, next) {
    try {
        const allStories = await Story.find().populate('user');
        res.render('stories/index.ejs', {
            allStories: allStories
        })
    } catch (e) {
        next(e);
    }
});


router.route('/stories/popular').get(async function (req, res, next) {
    try {
        const allStories = await Story.find().populate('user');
        
  
        const popularStories = allStories.filter(story => {
            const upvotes = story.votes.filter(vote => vote.value === 'up');
            return upvotes.length > 2; 
        });

   
        const sortedStories = popularStories.sort((a, b) => {
            const upvotesA = a.votes.filter(vote => vote.value === 'up').length;
            const upvotesB = b.votes.filter(vote => vote.value === 'up').length;
            return upvotesB - upvotesA; 
        });
        
        res.render('stories/popularStories.ejs', {
            allStories: sortedStories
        });
    } catch (e) {
        next(e);
    }
});

router.route('/stories/scariest').get(async function (req, res, next) {
    try {
        const allStories = await Story.find().populate('user');

        res.render('stories/scariestStories.ejs', {
                allStories: allStories
        })
    } catch (e) {
        next(e);
    }
});

router.route("/stories/new").get(async function (req, res, next) {
    try {
        res.render("stories/new.ejs");
    } catch (e) {
        next(e);
    }
});

router.route('/stories/:id').get(async function (req, res, next) {
    try {
        const storyId = req.params.id;
        const story = await Story.findById(storyId);

        if (!story) {
            return res.redirect('/error/storyNotFound');
        }

        res.render('stories/show.ejs', { story: story });
    } catch (e) {
        next(e);
    }
});

router.route('/stories').post(async function (req, res, next) {
    try {
        if (!req.session.user) {
            return res.redirect('/error/loginError');
        }

  
        req.body.user = req.session.user; 
        await Story.create(req.body);
        res.redirect('/stories'); 
    } catch (e) {
        next(e);
    }
});

router.route('/stories/:id').delete(async function (req, res, next) {
    try {
        const storyId = req.params.id;
        const story = await Story.findById(storyId).populate('user');
        
        console.log(story, req.session)
        
        if (!story.user._id.equals(req.session.user._id)) {
            return res.redirect('/error/deleteStoryError');
        }

        const deletedStory = await Story.findByIdAndDelete(storyId).populate('user');

        if (!deletedStory) {
            return res.redirect('/error/storyNotFound');
        }
        res.redirect('/stories');
    } catch (e) {
        next(e);
    }
});

router.route('/stories/edit/:id').get(async function (req, res, next) {
    try {
        const story = await Story.findById(req.params.id).exec();
        res.render('stories/edit.ejs', {
            story: story
        });
    } catch (e) {
        next(e);
    }
});

router.route('/stories/:id').put(async function (req, res, next) {
    try {
        if (req.body.tags) {
            req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
        }

        const storyId = req.params.id;
        const story = await Story.findById(storyId).populate('user');

        if (!story.user._id.equals(req.session.user._id)) {
            return res.redirect('/error/updateStoryError');
        }

        const updatedStory = await Story.findByIdAndUpdate(storyId, req.body, { new: true }).populate('user');

        if (!updatedStory) {
            return res.redirect('/error/storyNotFound');
        }

        res.redirect('/stories');
    } catch (e) {
        next(e);
    }
});




export default router;