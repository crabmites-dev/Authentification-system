import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.js'; 
import postRoutes from './routes/postRoutes.js';
import path from 'path';

dotenv.config();

const app = express(); 

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true}))


app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});

