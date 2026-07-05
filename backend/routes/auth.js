import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import { protect } from '../middlewares/auth.js'; 
import nodemailer from 'nodemailer';
import { createTransport } from '../config/mail.js';

const router = express.Router();

const cookieOptions = { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 30 * 24 * 60 * 60 * 1000
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'});
}

router.post("/register", async (req,res) => {
    const {username, email, password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({message : "Remplir tous les champs"});
    }

    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userExists.rows.length > 0){
        return res.status(400).json({message: 'Utilisateur existe deja'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
        [username, email, hashedPassword]
    );

    const token = generateToken(newUser.rows[0].id);

    res.cookie('token',token, cookieOptions);

    return res.status(201).json({user: newUser.rows[0]});
});

router.post("/login", async (req,res) => {
    const {email, password} = req.body;
    if(!email || !password) {
       return res.status(400).json("Remplir tous les champs");
    }

    const user = await pool.query("SELECT * FROM users WHERE email= $1", [email]);

    if (user.rows.length === 0) {
        return res.status(400).json("Information non valide");
    }

    const userData = user.rows[0];

    const isMatch = await bcrypt.compare(password, userData.password);

    if(!isMatch) {
        return res.status(400).json({message: "Information non valide"});
    }

    const token = generateToken(userData.id)

    res.cookie('token', token, cookieOptions);

    res.json({user: {id:userData.id, username: userData.username, email: userData.email}});
});

router.get("/me", protect, async (req,res) => {
    res.json(req.user);
});

router.post("/forget-password", async (req, res)=> {
    const {email} = req.body;

    if(!email) {
        res.status(500).json({ message: error.message });
    }

    try {
        const user = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    
        if(user.rows.length === 0){
            return res.status(200).json({message: 'email introuvable'}) 
        }
    
        const userId = user.rows[0].id 
    
        const resetToken = jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: '15m'})

        const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;


        const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
        <div style="background-color: #f4f4f4; padding: 30px; font-family: Arial, sans-serif; text-align: center;">
            <div style="max-width: 550px; margin: 0 auto; background-color: #ffffff; border-radius: 4px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                
                <div style="background-color: #4caf50; padding: 25px; color: #ffffff; font-size: 28px; font-weight: bold;">
                    Verify Your Email
                </div>
                
                <div style="padding: 30px; text-align: left; color: #333333; line-height: 1.6;">
                    <p style="font-size: 16px; margin-top: 0;">Hello,</p>
                    <p style="font-size: 14px;">Thank you for signing up! Your verification link (or token) is:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="display: inline-block; font-size: 24px; font-weight: bold; color: #4caf50; text-decoration: none; background-color: #f9f9f9; padding: 15px 30px; border: 1px dashed #4caf50; border-radius: 4px; letter-spacing: 1px;">
                            CLIQUER ICI POUR RÉINITIALISER
                        </a>
                    </div>
                    
                    <p style="font-size: 12px; color: #666666; border-top: 1px solid #eeeeee; padding-top: 15px;">
                        This link will expire in 15 minutes for security reasons.
                    </p>
                    <p style="font-size: 12px; color: #666666; margin-bottom: 0;">
                        If you didn't create an account with us, please ignore this email.
                    </p>
                    
                    <p style="font-size: 14px; margin-top: 25px; line-height: 1.2;">
                        Best regards,<br>
                        <strong>Your App Team</strong>
                    </p>
                </div>
            </div>
            
            <p style="font-size: 11px; color: #aaaaaa; margin-top: 20px;">
                This is an automated message, please do not reply to this email.
            </p>
        </div>
        `
};

        await transporter.sendMail(mailOptions);

        res.status(200).json({message: 'Message envoye avec succes'})
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur lors de l'envoi de l'email" });
    }
})

router.post("/reset-password", async (req, res)=> {
    const {token, newPassword} = req.body

    if(!token || !newPassword) {
        return res.status(200).json({message: 'Remplir tous les champs'})
    }

    try { 
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
        const hashPassword = await bcrypt.hash(newPassword, 10)
    
        const reset = await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashPassword, decoded.id])

        res.status(200).json({message: 'Mot de passe reinitialise'})

    } catch (error) {
        if(error.name === 'TokenExpiredError') {
            res.status(400).json({message: 'Temps expire'})
        }
        res.status(400).json({message: message.error})
    }

})

router.post("/logout", (req,res) => {
    res.cookie('token', '', {...cookieOptions, maxAge: 1});
    res.json({message:'Utilisateur deconnecte'});
});

export default router;
