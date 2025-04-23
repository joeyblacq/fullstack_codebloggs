import DBO from "../db/connection.js";
import { ObjectId } from "mongodb";
import COMMENT_SCHEMA from '../db/schemas/comment.schema.js';


// This route will help you create a new comment.
const commentCreate = async (req, res) => {
    try {
        const { content, user_id, post_id, likes } = req.body;

        // Validate required fields
        if (!content || !user_id || !post_id) {
            return res.status(400).json({ error: "Missing required fields: content, user_id, or post_id" });
        }

        // Create a new comment object
        const NEW_COMMENT = new COMMENT_SCHEMA({
            content,
            user_id: new ObjectId(user_id),
            post_id: new ObjectId(post_id),
            likes: likes || 0 // Default likes to 0 if not provided
        });

        // Insert the new comment into the database
        const COLLECTION = await DBO.collection("comments");
        const RESULT = await COLLECTION.insertOne(NEW_COMMENT);

        // Respond with the created comment
        res.status(RESULT.insertedId ? 201 : 500).json({
            status: RESULT.insertedId ? 'ok' : 'error',
            data: RESULT.insertedId ? NEW_COMMENT : {},
            message: RESULT.insertedId ? 'Comment created successfully' : 'Failed to create comment'
        });
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// This route will help you update a comment by id.
const commentUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, ...updateComment } = req.body; // Exclude _id from update data

        // Validate ID and update data
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid comment ID" });
        }
        if (!updateComment || Object.keys(updateComment).length === 0) {
            return res.status(400).json({ error: "No valid fields to update" });
        }

        const COLLECTION = await DBO.collection("comments");
        const QUERY = { _id: new ObjectId(id) };
        const UPDATES = { $set: updateComment };

        // Perform the update
        const RESULT = await COLLECTION.updateOne(QUERY, UPDATES);

        // Fetch the updated comment
        if (RESULT.matchedCount === 0) {
            return res.status(404).json({ error: "Comment not found" });
        }
        const UPDATED_COMMENT = await COLLECTION.findOne(QUERY);

        res.status(200).json({
            status: 'ok',
            result: RESULT,
            data: UPDATED_COMMENT,
            message: 'Comment updated successfully'
        });
    } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// This route will help you delete a comment
const commentDelete = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid comment ID" });
        }

        const QUERY = { _id: new ObjectId(id) };
        const COLLECTION = await DBO.collection("comments");

        // Check if the comment exists
        const EXISTING_COMMENT = await COLLECTION.findOne(QUERY);
        if (!EXISTING_COMMENT) {
            return res.status(404).json({ error: "Comment not found" });
        }

        // Perform the deletion
        const RESULT = await COLLECTION.deleteOne(QUERY);

        res.status(RESULT.deletedCount > 0 ? 200 : 500).json({
            status: RESULT.deletedCount > 0 ? 'ok' : 'error',
            message: RESULT.deletedCount > 0 ? 'Comment deleted successfully' : 'Failed to delete comment'
        });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// This route will help you get a single comment by id
const commentGetById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid comment ID" });
        }

        const QUERY = { _id: new ObjectId(id) };
        const COLLECTION = await DBO.collection("comments");

        // Fetch the comment
        const RESULT = await COLLECTION.findOne(QUERY);

        res.status(RESULT ? 200 : 404).json({
            status: RESULT ? 'ok' : 'error',
            data: RESULT || null,
            message: RESULT ? 'Comment retrieved successfully' : 'Comment not found'
        });
    } catch (error) {
        console.error("Error fetching comment by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// This route will help you get a list of all the comments.
const commentGetAll = async (req, res) => {
    try {
        const COLLECTION = await DBO.collection("comments");

        // Fetch all comments
        const RESULT = await COLLECTION.find({}).toArray();

        res.status(200).json({
            status: 'ok',
            data: RESULT,
            message: 'Comments retrieved successfully'
        });
    } catch (error) {
        console.error("Error fetching all comments:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default {
    commentCreate,
    commentUpdate,
    commentDelete,
    commentGetById,
    commentGetAll
};