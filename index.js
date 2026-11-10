import express from "express";
import { Op } from "sequelize";
import { sequelize, connectDB } from "./db.js";
import { UserModel, PostModel, CommentModel } from "./models.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

await connectDB();

app.get("/", (req, res) => res.json({ message: "Welcome to assignment 5 API" }));

app.post("/users/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "name, email and password are required" });
        }

        const checkUser = await UserModel.findOne({ where: { email } });
        if (checkUser) {
            return res.status(409).json({ message: "Email already exists." });
        }

        const user = UserModel.build({ name, email, password, role });
        await user.save();

        return res.status(201).json({ message: "User added successfully." });
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors.map((err) => err.message),
            });
        }
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({ message: "Email already exists." });
        }
        return res.status(error.cause || 500).json({ message: error.message });
    }
});

app.put("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await UserModel.upsert({ ...req.body, id }, { validate: false });

        return res.status(200).json({ message: "User created or updated successfully" });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({ message: "Email already exists." });
        }
        return res.status(500).json({ message: error.message });
    }
});

app.get("/users/by-email", async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: "email query param is required" });
        }

        const user = await UserModel.findOne({
            where: { email },
            attributes: { exclude: ["password"] },
        });
        if (!user) {
            return res.status(404).json({ message: "no user found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

app.get("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const user = await UserModel.findByPk(id, {
            attributes: { exclude: ["role", "password"] },
        });
        if (!user) {
            return res.status(404).json({ message: "no user found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

app.post("/posts", async (req, res) => {
    try {
        const { title, content, userId } = req.body;

        const user = await UserModel.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const post = new PostModel({ title, content, userId });
        await post.save();

        return res.status(201).json({ message: "Post created successfully." });
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors.map((err) => err.message),
            });
        }
        return res.status(500).json({ message: error.message });
    }
});

app.delete("/posts/:postId", async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body || {};

        const post = await PostModel.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        if (post.userId !== Number(userId)) {
            return res.status(403).json({ message: "You are not authorized to delete this post." });
        }

        await post.destroy();

        return res.status(200).json({ message: "Post deleted." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

app.get("/posts/details", async (req, res) => {
    try {
        const posts = await PostModel.findAll({
            attributes: ["id", "title"],
            include: [
                { model: UserModel, attributes: ["id", "name"] },
                { model: CommentModel, attributes: ["id", "content"] },
            ],
        });

        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

app.get("/posts/comment-count", async (req, res) => {
    try {
        const posts = await PostModel.findAll({
            attributes: ["id", "title", [sequelize.fn("COUNT", sequelize.col("comments.id")), "commentCount"]],
            include: [{ model: CommentModel, attributes: [] }],
            group: ["post.id"],
        });

        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

app.post("/comments", async (req, res) => {
    try {
        const { comments } = req.body;

        if (!Array.isArray(comments) || !comments.length) {
            return res.status(400).json({ message: "comments must be a non empty array" });
        }

        await CommentModel.bulkCreate(comments, { validate: true });

        return res.status(201).json({ message: "comments created." });
    } catch (error) {
        if (error.name === "SequelizeForeignKeyConstraintError") {
            return res.status(400).json({ message: "postId or userId doesn't exist" });
        }
        if (error.name === "AggregateError" || error.name === "SequelizeValidationError") {
            return res.status(400).json({ message: "Validation error, check the comments data" });
        }
        return res.status(500).json({ message: error.message });
    }
});

app.post("/comments/find-or-create", async (req, res) => {
    try {
        const { postId, userId, content } = req.body;

        if (!postId || !userId || !content) {
            return res.status(400).json({ message: "postId, userId and content are required" });
        }

        const [comment, created] = await CommentModel.findOrCreate({
            where: { postId, userId, content },
        });

        return res.status(created ? 201 : 200).json({ comment, created });
    } catch (error) {
        if (error.name === "SequelizeForeignKeyConstraintError") {
            return res.status(400).json({ message: "postId or userId doesn't exist" });
        }
        return res.status(500).json({ message: error.message });
    }
});

app.get("/comments/search", async (req, res) => {
    try {
        const { word } = req.query;

        if (!word) {
            return res.status(400).json({ message: "word query param is required" });
        }

        const { count, rows } = await CommentModel.findAndCountAll({
            where: {
                content: { [Op.like]: `%${word}%` },
            },
        });

        if (!count) {
            return res.status(404).json({ message: "no comments found." });
        }

        return res.status(200).json({ count, comments: rows });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

app.get("/comments/newest/:postId", async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await CommentModel.findAll({
            where: { postId },
            attributes: ["id", "content", "createdAt"],
            order: [
                ["createdAt", "DESC"],
                ["id", "DESC"],
            ],
            limit: 3,
        });

        return res.status(200).json(comments);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

app.get("/comments/details/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await CommentModel.findByPk(id, {
            attributes: ["id", "content"],
            include: [
                { model: UserModel, attributes: ["id", "name", "email"] },
                { model: PostModel, attributes: ["id", "title", "content"] },
            ],
        });

        if (!comment) {
            return res.status(404).json({ message: "no comment found" });
        }

        return res.status(200).json(comment);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

app.patch("/comments/:commentId", async (req, res) => {
    try {
        const { commentId } = req.params;
        const { userId, content } = req.body;

        const comment = await CommentModel.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ message: "comment not found." });
        }

        if (comment.userId !== Number(userId)) {
            return res.status(403).json({ message: "You are not authorized to update this comment." });
        }

        comment.content = content;
        await comment.save();

        return res.status(200).json({ message: "Comment updated." });
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({ message: "content is required" });
        }
        return res.status(500).json({ message: error.message });
    }
});

app.use((req, res) => {
    return res.status(404).json({ message: "Route not found" });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
