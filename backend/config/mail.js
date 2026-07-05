import nodemailer from 'nodemailer'

export const createTransport = (serviceType, email, pass) => {
    if(serviceType === 'gmail') {
        return nodemailer.createTransport({
            service: 'gmail',
            auth:{
                email: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
             
        })
    } else if (serviceType === 'yahoo') {
        return nodemailer.createTransport({
            service: 'yahoo',
            auth: {
                email: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
    } else if(serviceType === 'icloud'){
        return nodemailer.createTransport({
            host: 'smtp.mail.me.co',
            port: 587,
            auth: {
                email: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
    } 
    return null;
};