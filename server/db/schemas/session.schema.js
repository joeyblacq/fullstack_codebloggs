import MONGOOSE from 'mongoose';

// Define the Agent schema using Mongoose's Schema constructor
const SESSION_SCHEMA = new MONGOOSE.Schema({
    session_id: {
        type: String,
        trim: true,
        required: true
    },
    session_date: {
        type: Date,
        required: true
    },
    user: {
        type: MONGOOSE.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
export default MONGOOSE.model('Session', SESSION_SCHEMA);