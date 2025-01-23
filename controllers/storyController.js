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

        res.render('stories/popular.ejs', {
            allStories: sortedStories
        });
    } catch (e) {
        next(e);
    }
});

router.route('/stories/scariest').get(async function (req, res, next) {
    try {
        const allStories = await Story.find().populate('user');

        const storiesWithAvgRating = allStories.map(story => {
            const totalRating = story.ratings.reduce((sum, rating) => sum + rating.value, 0);
            const avgRating = totalRating / story.ratings.length;
            return { ...story.toObject(), avgRating };
        });

        const filteredStories = storiesWithAvgRating.filter(story => story.avgRating >= 3);

        const sortedStories = filteredStories.sort((a, b) => b.avgRating - a.avgRating);

        res.render('stories/scariest.ejs', {
            allStories: sortedStories
        });
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

router.route('/stories/random').get(async function (req, res, next) {
    try {
        const allStories = await Story.find().populate('user').populate('comments.user');
        const randomStory = allStories[Math.floor(Math.random() * allStories.length)];

        let userVoteValue = null;
        let userRatingValue = null;

        if (req.session.user && req.session.user._id) {
            const userVote = randomStory.votes.find(vote => vote.user.toString() === req.session.user._id.toString());
            if (userVote) {
                userVoteValue = userVote.value;
            }
            const userRating = randomStory.ratings.find(rating => rating.user.toString() === req.session.user._id.toString());
            if (userRating) {
                userRatingValue = userRating.value;
            }
        }

        res.render('stories/show.ejs', {
            story: randomStory,
            userVote: userVoteValue,
            userRating: userRatingValue,
            isLoggedIn: !!req.session.user, 
        });
    } catch (e) {
        next(e);
    }
});

router.route('/stories/:id').get(async function (req, res, next) {
    try {
        const storyId = req.params.id;
        const story = await Story.findById(storyId).populate('user').populate('comments.user');

        if (!story) {
            return res.redirect('/error/storyNotFound');
        }

        let userVoteValue = null;
        let userRatingValue = null;

        if (req.session.user && req.session.user._id) {
            const userVote = story.votes.find(vote => vote.user.toString() === req.session.user._id.toString());
            if (userVote) {
                userVoteValue = userVote.value;
            }
            const userRating = story.ratings.find(rating => rating.user.toString() === req.session.user._id.toString());
            if (userRating) {
                userRatingValue = userRating.value;
            }
        }

        res.render('stories/show.ejs', {
            story: story,
            userVote: userVoteValue, 
            userRating: userRatingValue, 
            isLoggedIn: !!req.session.user, 
        });
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

        res.redirect(`/stories/${story._id}`);
    } catch (e) {
        next(e);
    }
});

export default router;