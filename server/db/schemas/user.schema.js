// Import Mongoose
import MONGOOSE from 'mongoose';

// Define the Agent schema using Mongoose's Schema constructor
const USER_SCHEMA = new MONGOOSE.Schema({
    first_name: {
        type: String,
        trim: true,
        required: true
    },
    last_name: {
        type: String,
        trim: true,
        required: true
    },
    birthday: {
        type: Date,
        default: Date.now,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    status: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
        trim: true,
    },
    occupation: {
        type: String,
        trim: true,
    },
    auth_level: {
        type: String,
        trim: true,
        required: true,
        default: 'basic',
        enum:{
            values:['basic', 'admin'],
            message: '{VALUE} is not supported'
        },
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
export default MONGOOSE.model('User', USER_SCHEMA);