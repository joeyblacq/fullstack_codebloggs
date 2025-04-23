// Import Mongoose
import MONGOOSE from 'mongoose';

// Define the Agent schema using Mongoose's Schema constructor
const POST_SCHEMA = new MONGOOSE.Schema({
    content: {
        type: String,
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
    comments: [{
        type: MONGOOSE.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Export the Agent model using Mongoose's model function
export default MONGOOSE.model('Post', POST_SCHEMA);
