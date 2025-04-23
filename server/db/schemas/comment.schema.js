import MONGOOSE from 'mongoose';

// Define the Agent schema using Mongoose's Schema constructor
const COMMENT_SCHEMA = new MONGOOSE.Schema({
    content: {
        type: String,
        required: true
    },
    post_id: {
        type: MONGOOSE.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    user_id: {
        type: MONGOOSE.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true }); // Add timestamps to the schema

// Export the Agent model using Mongoose's model function
export default MONGOOSE.model('Comment', COMMENT_SCHEMA);