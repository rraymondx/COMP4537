import http from 'http';
import fs from 'fs';
import { getDate } from './modules/utils.js'; // Import utility function
import messages from './lang/en/en.js'; // Import language messages

const PORT = process.env.PORT || 4000;
const FILE_PATH = './file.txt';

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    res.setHeader('Content-Type', 'text/html');
    
    if (url.pathname === '/COMP4537/labs/3/getDate/') {
        const name = url.searchParams.get('name') || 'Guest';
        const currentTime = getDate();
        const responseMessage = messages.greeting.replace('%1', name).replace('%2', currentTime);
        res.writeHead(200);
        res.end(`<p style='color:blue;'>${responseMessage}</p>`);
    }
    
    else if (url.pathname === '/COMP4537/labs/3/writeFile/') {
        if (req.method !== 'GET') {
            res.writeHead(405, { 'Content-Type': 'text/plain' });
            res.end('405 Method Not Allowed');
            return;
        }
    
        const text = url.searchParams.get('text');
        if (!text) {
            res.writeHead(400);
            res.end('400 Bad Request: Missing "text" parameter');
            return;
        }
    
        fs.appendFile(FILE_PATH, text + '\n', (err) => {
            if (err) {
                res.writeHead(500);
                res.end('500 Internal Server Error: Unable to write to file');
                return;
            }
            res.writeHead(200);
            res.end("<p style='color:blue;'>Text appended successfully</p>");
        });
    }    
    
    else if (url.pathname.startsWith('/COMP4537/labs/3/readFile/')) {
        const filename = url.pathname.split('/').pop();
        const filePath = `./${filename}`;

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end(`404 Not Found: File '${filename}' does not exist`);
                return;
            }
            res.writeHead(200);
            res.end(`<pre>${data}</pre>`);
        });
    }
    
    else {
        res.writeHead(404);
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
