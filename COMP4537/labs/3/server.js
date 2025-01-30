// server.js
import express from 'express';
import { getDate } from './modules/utils.js';
import messages from './lang/en/en.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/COMP4537/labs/3/getDate/', (req, res) => {
    const name = req.query.name || 'Guest';
    const currentTime = getDate();
    const responseMessage = messages.greeting.replace('%1', name).replace('%2', currentTime);
    
    res.send(`<p style='color:blue;'>${responseMessage}</p>`);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
