import DBO from "../db/connection.js";
import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from 'uuid';
import BCRYPT from "bcrypt";

// Define a POST route for login session.
const sessionLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Fetch user from the database
        const USER = await DBO.collection("users").findOne({ email });
        if (!USER) {
            return res.status(401).json({ error: "Invalid email or password" }); // Avoid exposing which field is incorrect
        }

        // Validate password
        const isPasswordValid = await BCRYPT.compare(password, USER.password || '');
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" }); // Same generic error message
        }

        // Respond with user details
        const { _id, first_name, last_name, auth_level } = USER;
        return res.status(200).json({
            id: _id.toString(),
            first_name,
            last_name,
            auth_level
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// This route logs out a user by destroying their session.
const sessionLogout = async (req, res) => {
    const TOKEN = req.query.token;

    // Validate input
    if (!TOKEN) {
        return res.status(400).json({ error: "Session token is required" });
    }

    try {
        // Attempt to delete the session
        const SESSION = await DBO.collection("sessions").findOneAndDelete({ session_token: TOKEN });

        // Check if the session existed and was deleted
        if (!SESSION.value) {
            return res.status(404).json({ error: "Invalid or non-existent session token" });
        }

        // Respond with a success message
        return res.status(200).json({ message: "Successfully logged out" });
    } catch (error) {
        console.error("Error during logout:", error);

        // Handle unexpected errors
        return res.status(500).json({ error: "Internal server error" });
    }
};

// This route retrieves a session by its ID
const sessionGet = async (req, res) => {
    const { id } = req.params;

    // Validate input
    if (!id) {
        return res.status(400).json({ error: "Session ID is required" });
    }

    try {
        // Fetch the session from the database
        const SESSION = await DBO.collection("sessions").findOne({ _id: new ObjectId(id) });

        // Check if the session exists
        if (!SESSION) {
            return res.status(404).json({ error: "Session not found" });
        }

        // Respond with the session details
        return res.status(200).json({
            status: "ok",
            data: SESSION,
            message: "Session retrieved successfully",
        });
    } catch (error) {
        console.error("Error retrieving session:", error);

        // Handle unexpected errors
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

// This route retrieves all sessions from the database
const sessionGetAll = async (req, res) => {
    try {
        // Fetch all sessions
        const SESSIONS = await DBO.collection("sessions").find({}).toArray();

        // Check if no sessions are found
        if (SESSIONS.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No sessions found",
            });
        }

        // Respond with the list of sessions
        return res.status(200).json({
            status: "ok",
            data: SESSIONS,
            message: "Sessions retrieved successfully",
        });
    } catch (error) {
        console.error("Error retrieving sessions:", error);

        // Handle unexpected errors
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

// This route creates a new session for the given user.
const sessionCreate = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate input
        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Check if the user exists
        const USER = await DBO.collection("users").findOne({ _id: new ObjectId(id) });
        if (!USER) {
            return res.status(404).json({ error: "User not found" });
        }

        // Generate a unique session token
        const session_token = uuidv4();

        // Ensure the sessions collection has an expiration index
        const COLLECTION = DBO.collection("sessions");
        await COLLECTION.createIndex({ "session_date": 1 }, { expireAfterSeconds: 86400 });

        // Create a new session object
        const NEW_SESSION = {
            session_token,
            session_date: new Date(),
            user_id: id
        };

        // Insert the session into the database
        await COLLECTION.insertOne(NEW_SESSION);

        // Respond with the session token
        return res.status(201).json({
            status: "ok",
            data: { token: session_token },
            message: "Session created successfully",
        });
    } catch (error) {
        console.error("Error creating session:", error);

        // Handle unexpected errors
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

// This route validates a session token and returns information about the associated user
const sessionValidateToken = async (req, res) => {
    const TOKEN = req.query.token;

    // Validate input
    if (!TOKEN) {
        return res.status(400).json({ status: 'error', data: null, message: 'Session token is required' });
    }

    try {
        // Fetch session from the database
        const SESSION = await DBO.collection("sessions").findOne({ session_token: TOKEN });
        if (!SESSION) {
            return res.status(401).json({ status: 'error', data: null, message: 'Invalid session token' });
        }

        // Fetch user associated with the session
        const USER = await DBO.collection("users").findOne({ _id: new ObjectId(SESSION.user_id) });
        if (!USER) {
            return res.status(401).json({ status: 'error', data: null, message: 'Invalid user session' });
        }

        // Extract and return user details
        const { _id, first_name, last_name, auth_level } = USER;
        return res.status(200).json({
            status: 'ok',
            data: {
                valid: true,
                user: { id: _id.toString(), first_name, last_name, auth_level },
            },
            message: 'Session token validated successfully',
        });
    } catch (error) {
        console.error("Error validating session token:", error);

        // Handle unexpected errors
        return res.status(500).json({
            status: 'error',
            data: null,
            message: 'Internal server error',
        });
    }
};

export default {
    sessionLogin,
    sessionLogout,
    sessionGet,
    sessionGetAll,
    sessionCreate,
    sessionValidateToken
};