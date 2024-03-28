const TelegramBot = require('node-telegram-bot-api');
const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const token = '7115234597:AAGs1wKG5YNXHrMkZqtuglfg86HrIe3ygC4';

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    console.log(chatId)
    const resp = match[1];
    bot.sendMessage(chatId, resp);
});

app.post('/send-message', (req, res) => {
    bot.on('message', (msg) => {
            const chatId = msg.chat.id;
            console.log(chatId)
        const {  email, message} = req.body;
        const text = `\nEmail: ${email} \nMessage: ${message}`;
        bot.sendMessage(chatId, text);
        res.send('Message sent successfully');
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Booking.html'));
});


const server = app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000/');
});

module.exports = server;