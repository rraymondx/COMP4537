import express from 'express';
import fs from 'fs';
import { getDate } from './modules/utils.js';
import messages from './lang/en/en.js';

const app = express();
const PORT = process.env.PORT || 4000;
const FILE_PATH = './file.txt';

// get for getDate functionality
app.get('/COMP4537/labs/3/getDate/', (req, res) => {
    const name = req.query.name || 'Guest';
    const currentTime = getDate();
    const responseMessage = messages.greeting.replace('%1', name).replace('%2', currentTime);
    
    res.send(`<p style='color:blue;'>${responseMessage}</p>`);
});

// get for writeFile functionality
app.get('/COMP4537/labs/3/writeFile', (req, res) => {
    const text = req.query.text;
    if(!text) {
        // 500 = encountered unexpected condition
        return res.status(500).send('Internal Server Error: Unable to write to file');
    }
    fs.appendFile(FILE_PATH, text + '\n', (err) => {
        if (err) {
            return res.status(500).send('Internal Server Error: Unable to write to file');
        }
        res.send(`<p style='color:blue;'>Text appended successfully</p>`);
    });
});

// get for readFile functionality
app.get('/COMP4537/labs/3/readFile/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = `./${filename}`;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if(err) {
            return res.status(404).send(`404 Not Found: File '${filename}' does not exist`);
        }
        res.send(`<pre>${data}</pre>`);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
