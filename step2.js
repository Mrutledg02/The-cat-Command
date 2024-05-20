const fs = require('fs');
const axios = require('axios');

function cat(path) {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading ${path}:\n  ${err}`);
          process.exit(1);
        }
        console.log(data);
    });
}

// Function to read URL contents
async function webCat(url) {
    try {
        const response = await axios.get(url);
        console.log(response.data);
    } catch (err) {
        console.error(`Error fetching ${url}:\n  ${err}`);
        process.exit(1);
    }
}

// Determine whether the argument is a file path or an URL
const arg = process.argv[2];

if (arg.slice(0, 4) === 'http') {
    webCat(arg);
}
else {
    cat(arg);
}