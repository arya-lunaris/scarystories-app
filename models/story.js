import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'User', 
        required: true 
    },
    value: { 
        type: String, 
        enum: ['up', 'down'], 
        required: true 
    }
});

const ratingSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'User', 
        required: true 
    },
    value: { 
        type: Number, 
        min: 1, 
        max: 5 
    }
});

const commentSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'User', 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const storySchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    user: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'User', 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    votes: [voteSchema],
    ratings: [ratingSchema],
    comments: [commentSchema]
});

const Story = mongoose.model('Story', storySchema);
const Vote = mongoose.model('Vote', voteSchema);
const Rating = mongoose.model('Rating', ratingSchema);
const Comment = mongoose.model('Comment', commentSchema);

export { Story, Vote, Rating, Comment };