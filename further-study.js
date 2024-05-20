const fs = require('fs');
const axios = require('axios');

// Function to read file
async function cat(path) {
    try {
        const data = await fs.promises.readFile(path, 'utf-8');
        console.log(data);
    } catch (err) {
        console.error(`Couldn't read ${path}:`);
        console.error(err.message);
    }
}

// Function to read file and append to another file
async function catAppend(inputPath, outputPath) {
    try {
        const data = await fs.promises.readFile(inputPath, 'utf-8');
        await fs.promises.appendFile(outputPath, data);
        console.log(`Data appended to ${outputPath}`);
    } catch (err) {
        console.error(`Error appending to ${outputPath}:`);
        console.error(err.message);
    }
}

// Function to fetch content from a URL
async function webCat(url) {
    try {
        const response = await axios.get(url);
        console.log(response.data);
    } catch (err) {
        console.error(`Couldn't fetch ${url}:`);
        console.error(err.message);
    }
}

// Function to read from URL and append to file
async function webCatAppend(url, outputPath) {
    try {
        const response = await axios.get(url);
        await fs.promises.appendFile(outputPath, response.data);
        console.log(`Data appended to ${outputPath}`);
    } catch (err) {
        console.error(`Error fetching or appending to ${outputPath}:`);
        console.error(err.message);
    }
}

// Main function to handle command line arguments
async function main() {
    const args = process.argv.slice(2);
    if (args.includes('--out')) {
        const outIndex = args.indexOf('--out');
        const outputPath = args[outIndex + 1];
        for (let i = 0; i < outIndex; i++) {
            const inputPathOrUrl = args[i];
            if (inputPathOrUrl.startsWith('http://') || inputPathOrUrl.startsWith('https://')) {
                await webCatAppend(inputPathOrUrl, outputPath);
            } else {
                await catAppend(inputPathOrUrl, outputPath);
            }
        }
    } else {
        for (const inputPathOrUrl of args) {
            if (inputPathOrUrl.startsWith('http://') || inputPathOrUrl.startsWith('https://')) {
                await webCat(inputPathOrUrl);
            } else {
                await cat(inputPathOrUrl);
            }
        }
    }
}

main();
