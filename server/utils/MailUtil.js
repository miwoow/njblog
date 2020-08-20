
const { createTransport } = require('nodemailer');

class MailUtil {
    constructor() {
        this.transporter = createTransport({
            service: 'qq',
            port: 465,
            secureConnection: true, 
            auth: {
                user: "290993753@qq.com",
                pass: process.env.QQ_MAIL_CODE
            }
        });
        this.from = "290993753@qq.com"
    }

    sendMail(to, subject, content) {
        var options = {
            from: this.from,
            to: to,
            subject: subject,
            html: content
        };
        this.transporter.sendMail(options, function(err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log("send ok: " + info.response);
            }
        });
    }
}

exports.MailUtil = MailUtil;