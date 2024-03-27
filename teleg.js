const TelegramBot = require('node-telegram-bot-api');
const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// replace the value below with the Telegram token you receive from @BotFather
const token = '7115234597:AAGs1wKG5YNXHrMkZqtuglfg86HrIe3ygC4';
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

let latestMessageId = 0; // Variable to store the ID of the latest message

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
});

// Listen for new messages and send notifications
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    // Check if the message is new
    if (messageId > latestMessageId) {
        latestMessageId = messageId;
        const { text, from } = msg;
        const notification = `New message from ${from.first_name} ${from.last_name}: ${text}`;
        bot.sendMessage(chatId, notification);
    }
    app.post('/send-message', (req, res) => {
        const { name, email, message } = req.body;
        const text = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;
        bot.sendMessage(chatId, text); // Replace CHAT_ID with the chat ID you want to send the message to
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