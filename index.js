const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

/* -----------------------------
   1. EMAIL TRANSPORTER (PUT HERE)
------------------------------*/
const transporter = nodemailer.createTransport({
    host: "zmail.shoalter.com.tw",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/* -----------------------------
   2. JIRA WEBHOOK ENDPOINT
------------------------------*/
app.post("/jira/approval-email", async (req, res) => {
    try {
        const { ticketKey, summary, requester } = req.body;

        const subject = `Ticket Request - ${ticketKey} ${summary}`;

        const emailBody = `
Dear ${requester},

Could you please help to confirm the requirements...

Thank you.
        `;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: requester,
            cc: process.env.EMAIL_USER,
            subject: subject,
            text: emailBody
        });

        return res.status(200).send("Email sent");
    } catch (err) {
        console.error(err);
        return res.status(500).send("Error sending email");
    }
});

/* -----------------------------
   3. SERVER START (RENDER NEEDS THIS)
------------------------------*/
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
