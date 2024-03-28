const fetch = require('node-fetch');
const TelegramBot = require('node-telegram-bot-api');
const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let tg = {
    token: "7115234597:AAGs1wKG5YNXHrMkZqtuglfg86HrIe3ygC4",
    chat_id:"702119813"
}
const bot = new TelegramBot(tg.token, {polling: true});

function sendMessage(text) {
    const url = `https://api.telegram.org/bot${tg.token}/sendMessage?chat_id=${tg.chat_id}&text=${text}`; // The url to request
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Booking.html'));
});
app.post('/send-message', async (req, res) => {
    const { email, message } = req.body;
    const text = `\nEmail: ${email}  \nMessage: ${message}`;
    bot.sendMessage(tg.chat_id, "You have a new message, do you want to see it? (Yes/No)")
        .then(() => {
            bot.once('message', (msg) => {
                const response = msg.text.toLowerCase();
                if (response === 'yes') {
                    bot.sendMessage(tg.chat_id, text)
                        .then(() => {
                            console.log('Message sent successfully');
                            res.send('Message sent successfully');
                        })
                        .catch((error) => {
                            console.error('Error sending message:', error);
                            res.status(500).send('Error sending message');
                        });
                } else if (response === 'no') {
                    res.send('Message deleted');
                } else {
                    bot.sendMessage(tg.chat_id, "Please respond with 'yes' or 'no'");
                }
            });
        })
        .catch((error) => {
            console.error('Error sending message:', error);
            res.status(500).send('Error sending message');
        });
});

const server = app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000/');
});

module.exports = server;