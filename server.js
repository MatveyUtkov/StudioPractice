const express = require('express');
const app = express();
const path = require('path');
app.set('view engine','ejs');
app.set('views',__dirname+'/views');
// Define route for the root URL (default page)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Main.html'));
});

// Define routes for each page
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views','About.html'));
});

app.get('/booking', (req, res) => {
    res.sendFile(path.join(__dirname, 'views','Booking.html'));
});

app.get('/contacts', (req, res) => {
    res.sendFile(path.join(__dirname, 'views','Contacts.html'));
});

app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Main.html'));
});

app.get('/overview', (req, res) => {
    res.sendFile(path.join( __dirname, 'views','Overview.html'));
});

app.get('/projects', (req, res) => {
    res.sendFile(path.join( __dirname, 'views','Projcts.html'));
});

const server = app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000/');
});

module.exports = server;