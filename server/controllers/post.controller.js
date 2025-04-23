import DBO from "../db/connection.js";
import { ObjectId } from "mongodb";
import POST_SESSION from '../db/schemas/post.schema.js';

// This route will help you create a new Post.
const postCreate = async (req, res) => {
    try {
        const { content, user_id, likes } = req.body;

        // Validate required fields
        if (!content || !user_id) {
            return res.status(400).json({ error: "Content and user_id are required" });
        }

        // Validate user_id format
        if (!ObjectId.isValid(user_id)) {
            return res.status(400).json({ error: "Invalid user_id format" });
        }

        const NEW_POST = new POST_SESSION({
            content,
            user_id: new ObjectId(user_id),
            likes: likes || 0,
            createdAt: new Date()
        });

        const COLLECTION = await DBO.collection("posts");
        const RESULT = await COLLECTION.insertOne(NEW_POST);

        if (!RESULT.acknowledged) {
            throw new Error("Failed to create post");
        }

        res.status(201).json({
            status: 'ok',
            data: {
                _id: RESULT.insertedId,
                content: NEW_POST.content,
                user_id: NEW_POST.user_id,
                likes: NEW_POST.likes,
                createdAt: NEW_POST.createdAt,
                comments: []
            },
            message: 'Post created successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// This route will help you update a Post by id.
const postUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { content, user_id, likes } = req.body;

        // Validate post ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid post ID" });
        }

        // Validate user_id format if provided
        if (user_id && !ObjectId.isValid(user_id)) {
            return res.status(400).json({ error: "Invalid user_id format" });
        }

        // Validate required fields
        if (!content && likes === undefined) {
            return res.status(400).json({ error: "At least one field (content or likes) must be provided" });
        }

        const COLLECTION = await DBO.collection("posts");
        const QUERY = { _id: new ObjectId(id) };

        // Prepare update object
        const updates = {
            ...(content && { content }),
            ...(user_id && { user_id: new ObjectId(user_id) }),
            ...(likes !== undefined && { likes })
        };

        const RESULT = await COLLECTION.updateOne(QUERY, { $set: updates });
        if (RESULT.matchedCount === 0) {
            return res.status(404).json({ error: "Post not found" });
        }

        const UPDATED_POST = await COLLECTION.findOne(QUERY);

        // Fetch comments for the updated post
        const COMMENTS = await DBO.collection("comments").find({ post_id: new ObjectId(id) }).toArray();

        res.json({
            status: 'ok',
            data: {
                _id: UPDATED_POST._id,
                content: UPDATED_POST.content,
                user_id: UPDATED_POST.user_id,
                likes: UPDATED_POST.likes,
                createdAt: UPDATED_POST.createdAt,
                comments: COMMENTS
            },
            message: 'Post updated successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// This route will help you delete a Post
const postDelete = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate post ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid post ID" });
        }

        const POSTS_COLLECTION = DBO.collection("posts");
        const COMMENTS_COLLECTION = DBO.collection("comments");
        const QUERY = { _id: new ObjectId(id) };

        // Check if the post exists
        const POST = await POSTS_COLLECTION.findOne(QUERY);
        if (!POST) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Delete all comments associated with the post
        const COMMENTS_RESULT = await COMMENTS_COLLECTION.deleteMany({ post_id: new ObjectId(id) });

        // Delete the post
        const POST_RESULT = await POSTS_COLLECTION.deleteOne(QUERY);

        res.status(200).json({
            status: 'ok',
            message: `Post deleted successfully along with ${COMMENTS_RESULT.deletedCount} associated comments`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// This route will help you get a single Post by id and their comments
const postGetById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate post ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid post ID" });
        }

        const COLLECTION = await DBO.collection("posts");
        const QUERY = { _id: new ObjectId(id) };

        const RESULT = await COLLECTION.findOne(QUERY);
        if (!RESULT) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Fetch comments for the post
        const COMMENTS = await DBO.collection("comments").find({ post_id: new ObjectId(id) }).toArray();

        res.json({
            status: 'ok',
            data: {
                _id: RESULT._id,
                content: RESULT.content,
                user_id: RESULT.user_id,
                likes: RESULT.likes,
                createdAt: RESULT.createdAt,
                comments: COMMENTS
            },
            message: 'Post retrieved successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// This route will help you get a list of all the Posts and their comments
const postsGetAll = async (req, res) => {
    try {
        const COLLECTION = DBO.collection("posts");

        // Fetch all posts with their comments using aggregation
        const POSTS_WITH_COMMENTS = await COLLECTION.aggregate([
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "post_id",
                    as: "comments"
                }
            }
        ]).toArray();

        if (!POSTS_WITH_COMMENTS || POSTS_WITH_COMMENTS.length === 0) {
            return res.status(404).json({ error: "No posts found" });
        }

        // Map the posts to include necessary fields
        const POSTS = POSTS_WITH_COMMENTS.map((post) => ({
            _id: post._id,
            content: post.content,
            user_id: post.user_id,
            likes: post.likes,
            createdAt: post.createdAt,
            comments: post.comments || []
        }));

        res.json({
            status: 'ok',
            data: POSTS,
            message: 'Posts retrieved successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default {
    postCreate,
    postUpdate,
    postDelete,
    postGetById,
    postsGetAll
};