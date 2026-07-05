import jwt from 'jsonwebtoken';
import pool from '../config/db.js'

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if(!token) {
            return res.status(401).json({message: 'token pas autorise'})
        } 
 
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await pool.query('SELECT id, username FROM users WHERE id = $1', [decoded.id] );

        if(user.rows.length === 0) {
            return res.status(401).json({message: 'pas autorise '})
        }

        req.user = user.rows[0];
        next();

    } catch (error) {
        console.log("error");
        res.status(401).json({message: 'token pas autorise'})
    }
}
