const fs = require('fs');
const axios = require('axios');

// Function to read file
function cat(path) {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file ${path}:`);
        console.error(err);
        return;
      }
      console.log(data);
    });
  }

// Function to read file and write to another file
function catWrite(inputPath, outputPath) {
    fs.readFile(inputPath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file ${inputPath}:`);
        console.error(err);
        return;
      }
      fs.writeFile(outputPath, data, err => {
        if (err) {
          console.error(`Couldn't write ${outputPath}:`);
          console.error(err);
          return;
        }
        console.log(`Data written to ${outputPath}`);
      });
    });
  }

  // Function to read from URL
async function webCat(url) {
    try {
        const response = await axios.get(url);
        console.log(response.data);
    } catch (err) {
        console.error(`Error fetching ${url}:\n  ${err}`);
        process.exit(1);
    }
}

// Function to read from URL and write to file
async function webCatWrite(url, outputPath) {
    try {
        const response = await axios.get(url);
        fs.writeFile(outputPath, response.data, err => {
          if (err) {
            console.error(`Couldn't write ${outputPath}:`);
            console.error(err);
            return;
          }
          console.log(`Data written to ${outputPath}`);
        });
    } catch (err) {
        console.error(`Error fetching URL ${url}:`);
        process.exit(1);
    }
}

// Main function
function main() {
    const args = process.argv.slice(2);
    if (args.length < 1) {
      console.error('Usage: node step3.js [--out output-filename.txt] readfile-or-url [readfile-or-url ...]');
      return;
    }
  
    let outputPath = null;
    if (args[0] === '--out' && args.length >= 3) {
      outputPath = args[1];
      args.splice(0, 2);
    }
  
    args.forEach(inputPathOrUrl => {
      if (inputPathOrUrl.startsWith('http://') || inputPathOrUrl.startsWith('https://')) {
        if (outputPath) {
          webCatWrite(inputPathOrUrl, outputPath);
        } else {
          webCat(inputPathOrUrl);
        }
      } else {
        if (outputPath) {
          catWrite(inputPathOrUrl, outputPath);
        } else {
          cat(inputPathOrUrl);
        }
      }
    });
  }
  
  main();