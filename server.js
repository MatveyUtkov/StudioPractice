const express = require('express');
const app = express();
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

app.use(helmet());
app.use(cookieParser());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'maxcdn.bootstrapcdn.com', 'stackpath.bootstrapcdn.com'],
            scriptSrc: ["'self'", 'code.jquery.com'],
        },
    })
);

app.use(express.static(path.join(__dirname, 'public')));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handle form submission
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: '211151@astanait.edu.kz',
            pass: 'Kv4s_n0t_d3ad',
        },
    });

    // Email content
    const mailOptions = {
        from: '211151@astanait.edu.kz',
        to: 'maga.ute@mail.ru',
        subject: 'New Message from Your Website',
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Email sent successfully');
        }
    });
});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Define route for the root URL (default page)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Main.html'));
});

// Define routes for each page
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'About.html'));
});

app.get('/booking', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Booking.html'));
});

app.get('/contacts', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Contacts.html'));
});

app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Main.html'));
});

app.get('/overview', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Overview.html'));
});

app.get('/projects', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Projcts.html'));
});

const server = app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000/');
});

module.exports = server;
