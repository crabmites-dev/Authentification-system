import express from 'express';
import pool from '../config/db.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.use(protect);

router.post("/", upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id;
    
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
        if (!title || !content) {
            return res.status(400).json({ message: "Le titre et le contenu sont requis" });
        }
    
        const newPost = await pool.query("INSERT INTO posts (title, content, user_id, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
            [title, content, userId, imageUrl]
        );
    
        res.status(200).json(newPost.rows[0]);
    
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });

router.get("/", async (req, res) => {
    try {
        const post = await pool.query("SELECT * FROM posts ORDER BY create_at DESC");
        res.status(200).json(post.rows);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'affichage" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const userId = req.user.id;
        const postId = parseInt(id, 10);

        if (isNaN(postId)) {
            return res.status(400).json({ message: "ID invalide" });
        }

        const post = await pool.query("SELECT * FROM posts WHERE id = $1", [postId]);

        if (post.rows.length === 0) {
            return res.status(404).json({ message: 'Introuvable' });
        }

        if (post.rows[0].user_id !== userId) {
            return res.status(403).json({ message: 'Interdit' });
        }

        const updatePost = await pool.query(
            "UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *",
            [title, content, postId]
        );

        res.status(200).json(updatePost.rows[0]);

    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la modification' });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const postId = parseInt(id, 10);

        if (isNaN(postId)) {
            return res.status(400).json({ message: "ID invalide" });
        }

        const post = await pool.query("SELECT * FROM posts WHERE id = $1", [postId]);

        if (post.rows.length === 0) {
            return res.status(404).json({ message: 'Introuvable' });
        }

        if (post.rows[0].user_id !== userId) {
            return res.status(403).json({ message: 'Interdit' });
        }

        const deleted = await pool.query("DELETE FROM posts WHERE id = $1 RETURNING *", [postId]);

        return res.status(200).json(deleted.rows[0]);

    } catch (error) {
        return res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
});

export default router;
