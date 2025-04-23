import DBO from "../db/connection.js";
import { ObjectId } from "mongodb";
import USER_SCHEMA from '../db/schemas/user.schema.js';
import BCRYPT from 'bcrypt';

// This route will help you create a new User.
const userCreate = async (req, res) => {
    try {
        const { email, password, ...userData } = req.body;

        if (!email || !password || Object.keys(userData).length === 0) {
            return res.status(400).json({ error: "Invalid user data" });
        }

        // Check if email already exists
        const existingUser = await DBO.collection("users").findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const SALT_ROUNDS = 10;
        const hashedPassword = await BCRYPT.hash(password, SALT_ROUNDS);

        const NEW_USER = {
            ...userData,
            email,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const RESULT = await DBO.collection("users").insertOne(NEW_USER);

        if (!RESULT.acknowledged) {
            return res.status(500).json({ error: "User not created" });
        }

        res.status(201).json({
            status: 'ok',
            data: { id: RESULT.insertedId },
            message: 'User created successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// This route will help you update a User by id.
const userUpdate = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const { _id, ...updateUser } = req.body; // Exclude _id from update data

        if (Object.keys(updateUser).length === 0) {
            return res.status(400).json({ error: "No valid fields to update" });
        }

        const QUERY = { _id: new ObjectId(userId) };
        const UPDATES = { 
            $set: { 
                ...updateUser, 
                updatedAt: new Date() 
            } 
        };

        const RESULT = await DBO.collection("users").updateOne(QUERY, UPDATES);

        if (RESULT.matchedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            status: 'ok',
            message: 'User updated successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// This route will help you delete a User
const userDelete = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const USER_COLLECTION = DBO.collection("users");
        const POST_COLLECTION = DBO.collection("posts");
        const COMMENT_COLLECTION = DBO.collection("comments");

        // Check if the user exists
        const user = await USER_COLLECTION.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find all posts of the user
        const userPosts = await POST_COLLECTION.find({ user_id: new ObjectId(userId) }).toArray();
        const postIds = userPosts.map(post => post._id);

        let deletedCommentsCount = 0;
        let deletedPostsCount = 0;

        // If posts exist, delete comments and posts
        if (postIds.length > 0) {
            const COMMENTS_RESULT = await COMMENT_COLLECTION.deleteMany({ post_id: { $in: postIds } });
            if (!COMMENTS_RESULT.acknowledged) {
                return res.status(500).json({ error: "Failed to delete comments" });
            }
            deletedCommentsCount = COMMENTS_RESULT.deletedCount;

            const POSTS_RESULT = await POST_COLLECTION.deleteMany({ user_id: new ObjectId(userId) });
            if (!POSTS_RESULT.acknowledged) {
                return res.status(500).json({ error: "Failed to delete posts" });
            }
            deletedPostsCount = POSTS_RESULT.deletedCount;
        }

        // Delete the user
        const deleteUserResult = await USER_COLLECTION.deleteOne({ _id: new ObjectId(userId) });
        if (!deleteUserResult.acknowledged || deleteUserResult.deletedCount === 0) {
            return res.status(500).json({ error: "Failed to delete user" });
        }

        res.status(200).json({
            status: 'ok',
            message: `User deleted successfully. Deleted ${deletedPostsCount} posts associated with the user and ${deletedCommentsCount} comments associated with those posts.`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// This route will help you get a single User by id with his information.
const userGetById = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const QUERY = { _id: new ObjectId(userId) };
        const PROJECTION = { password: 0 }; // Exclude the password field

        const RESULT = await DBO.collection("users").findOne(QUERY, PROJECTION);

        if (!RESULT) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            status: 'ok',
            data: RESULT,
            message: 'User retrieved successfully'
        });
    } catch (error) {
        console.error("Error retrieving user by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// This route will help you get a list of all the Users with their information.
const usersGetAll = async (req, res) => {
    try {
        const USERS = await DBO.collection("users").find({}, { projection: { password: 0 } }).toArray();

        if (!USERS || USERS.length === 0) {
            return res.status(404).json({ error: "No users found" });
        }

        res.status(200).json({
            status: 'ok',
            data: USERS,
            message: 'Users retrieved successfully'
        });
    } catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// This route will help you get all information from a User by id, including posts and comments
const userGetInfo = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const USER_COLLECTION = DBO.collection("users");
        const POST_COLLECTION = DBO.collection("posts");

        const QUERY = { _id: new ObjectId(userId) };
        const PROJECTION = { password: 0 }; // Exclude the password field

        const userResult = await USER_COLLECTION.findOne(QUERY, PROJECTION);

        if (!userResult) {
            return res.status(404).json({ error: "User not found" });
        }

        const postResult = await POST_COLLECTION.find({ user_id: new ObjectId(userId) }).toArray();

        const COMMENTS = await POST_COLLECTION.aggregate([
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "post_id",
                    as: "comments"
                }
            }
        ]).toArray();

        const formattedPosts = postResult.map((post) => ({
            _id: post._id,
            content: post.content,
            likes: post.likes,
            createdAt: post.createdAt,
            comments: COMMENTS.find((comment) => comment._id.toString() === post._id.toString())?.comments || []
        }));

        res.status(200).json({
            status: 'ok',
            data: {
                user: userResult,
                totalPosts: postResult.length,
                posts: formattedPosts.length > 0 ? formattedPosts : [{ content: "No posts yet by the user." }]
            },
            message: 'User and posts retrieved successfully'
        });
    } catch (error) {
        console.error("Error retrieving user info:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// This route will help you get all information from all users, including posts and comments
const usersGetInfo = async (req, res) => {
    try {
        const USER_COLLECTION = DBO.collection("users");
        const POST_COLLECTION = DBO.collection("posts");

        const [users, posts] = await Promise.all([
            USER_COLLECTION.find({}, { projection: { password: 0 } }).toArray(),
            POST_COLLECTION.find({}).toArray()
        ]);

        if (!users || users.length === 0) {
            return res.status(404).json({ error: "No users found" });
        }

        const commentsByPostId = await POST_COLLECTION.aggregate([
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "post_id",
                    as: "comments"
                }
            },
            {
                $project: {
                    _id: 1,
                    comments: 1
                }
            }
        ]).toArray();

        const commentsMap = commentsByPostId.reduce((map, post) => {
            map[post._id.toString()] = post.comments || [];
            return map;
        }, {});

        const formattedUsers = users.map((user) => {
            const userPosts = posts.filter((post) => post.user_id.toString() === user._id.toString());
            const formattedPosts = userPosts.map((post) => ({
                _id: post._id,
                content: post.content,
                likes: post.likes,
                createdAt: post.createdAt,
                comments: commentsMap[post._id.toString()] || []
            }));

            return {
                info: user,
                totalPosts: userPosts.length,
                posts: formattedPosts.length > 0 ? formattedPosts : [{ content: "No posts yet by the user." }]
            };
        });

        res.status(200).json({
            status: 'ok',
            data: formattedUsers,
            message: 'All users retrieved successfully'
        });
    } catch (error) {
        console.error("Error retrieving users info:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default {
    userCreate,
    userUpdate,
    userDelete,
    userGetById,
    usersGetAll,
    userGetInfo,
    usersGetInfo,
};