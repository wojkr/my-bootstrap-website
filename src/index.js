const EMAIL = require('../../ACCESS.js');

const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const projectsData = require('../projects-data.json');

const app = express();

app.use(express.static(path.join(__dirname, '../public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../templates/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));


app.get('/', (req, res) => {
    const message = 'hey!';
    res.render("home.ejs", { message })
});

app.get('/projects', (req, res) => {
    res.render("projects.ejs", { projectsData })
});


for (let project of projectsData) {
    app.get(`/projects/${project.link}`, (req, res) => {
        res.render(`project.ejs`, { project })
    })
}

app.get('/contact', (req, res) => {
    res.render("contact.ejs", { msg: '' })
});

app.post('/send', (req, res) => {
    console.log(req.body);
    const output = `<p> You have a new contact request</p>
    <h3>Contact details</h3>
    <ul>
    <li>Name: ${req.body.name}</li>
    <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message:</h3> 
    <p>${req.body.message}</p>
    `;
    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: EMAIL.host,
            port: EMAIL.port,
            secure: EMAIL.secure, // true for 465, false for other ports
            auth: {
                user: EMAIL.username, // generated ethereal user
                pass: EMAIL.password, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: `"NodemailerTest" <${EMAIL.username}>`, // sender address
            to: `${EMAIL.username}`, // list of receivers
            subject: "Test nodemailer", // Subject line
            text: "Hello world?", // plain text body
            html: output, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

    main().catch(console.error);
    res.redirect('/contact')
});


app.get('/about', (req, res) => {
    res.render("about.ejs")
});

app.get('*', (req, res) => {
    res.send("wrong url")
})


app.listen(3000, () => {
    console.log("Listening on port 3000")
});