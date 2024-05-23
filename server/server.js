const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Enable CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.options('*', (req, res) => {
    res.sendStatus(204);
});

app.post('/', async (req, res) => {
    const { name, email, message } = req.body;

    if (name && email && message) {
        const to = process.env.TO;
        const subject = "New Contact Form Submission";
        const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\nKhushi`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.TO,
                pass: process.env.PASS
            }
        });

        const mailOptions = {
            from: email,
            to,
            subject,
            text: body
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
            res.status(200).json({ message: "Email sent successfully" });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.status(400).json({ error: "Missing parameters" });
    }
});

app.use((req, res) => {
    res.status(405).json({ error: "Method Not Allowed" });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
