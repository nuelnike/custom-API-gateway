module.exports = (mailType:string, payload:any, toAddress:string) => { 
    
    let success:boolean;

    const mailOptions:any = {
        from: APP_INFO.name + ' <' + APP_INFO.email + '>',
        to: toAddress,
        subject: payload.subject,
        html: MAIL_TEMPLATE(mailType, payload),
    };

    MAIL_TRANSPORTER.sendMail(mailOptions, function(error:any) { 
        console.log(error);
    });

    return info;    
}