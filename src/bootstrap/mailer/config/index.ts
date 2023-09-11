module.exports = () => { 
    NODEMAILER.createTransport({
        service: 'Gmail', //smtp.gmail.com  //in place of service use host...
        host: 'smtp.gmail.com',
        secure: true,
        port: 587,
        auth: {
            user: APP_INFO.email,
            pass: APP_INFO.email_password
        }
    })
    
}