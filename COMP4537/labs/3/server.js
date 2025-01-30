// server.js - Express server with basic file operations
import express from 'express';
import fs from 'fs';
import { getDate } from './modules/utils.js'; // Import utility function
import messages from './lang/en/en.js'; // Import language messages

const app = express();
const PORT = process.env.PORT || 4000; // Set server port
const FILE_PATH = './file.txt'; // File path for read/write operations

// get for getDate functionality
app.get('/COMP4537/labs/3/getDate/', (req, res) => {
    const name = req.query.name || 'Guest'; // Get name from query param
    const currentTime = getDate(); // Get current date/time
    const responseMessage = messages.greeting.replace('%1', name).replace('%2', currentTime); 
    
    res.send(`<p style='color:blue;'>${responseMessage}</p>`); // Send formatted response
});

// get for writeFile functionality
app.get('/COMP4537/labs/3/writeFile', (req, res) => {
    const text = req.query.text; // Get text from query param
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
    const filename = req.params.filename;  // Get filename from route param
    const filePath = `./${filename}`; // Construct file path

    fs.readFile(filePath, 'utf8', (err, data) => {
        if(err) {
            return res.status(404).send(`404 Not Found: File '${filename}' does not exist`);
        }
        res.send(`<pre>${data}</pre>`);
    });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
