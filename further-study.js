const fs = require('fs');
const axios = require('axios');

// Function to read file and return content as a promise
function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(`Error reading file ${path}: ${err}`);
      } else {
        resolve(data);
      }
    });
  });
}

// Function to fetch URL content and return as a promise
async function fetchUrl(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    throw new Error(`Error fetching URL ${url}: ${err}`);
  }
}

// Function to write content to a file (append mode)
function appendToFile(outputPath, data) {
  return new Promise((resolve, reject) => {
    fs.appendFile(outputPath, data, err => {
      if (err) {
        reject(`Couldn't write to ${outputPath}: ${err}`);
      } else {
        resolve(`Data written to ${outputPath}`);
      }
    });
  });
}

// Main function to process input paths or URLs and write to output file
async function processInputs(inputs, outputPath) {
  for (const input of inputs) {
    try {
      let data;
      if (input.startsWith('http://') || input.startsWith('https://')) {
        data = await fetchUrl(input);
      } else {
        data = await readFile(input);
      }
      await appendToFile(outputPath, data);
      console.log(`Data from ${input} written to ${outputPath}`);
    } catch (err) {
      console.error(err);
    }
  }
}

// Main function to handle command line arguments and initiate processing
async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: node script.js [--out output-filename.txt] readfile-or-url [readfile-or-url ...]');
    return;
  }

  let outputPath = null;
  if (args[0] === '--out' && args.length >= 3) {
    outputPath = args[1];
    args.splice(0, 2);
  }

  if (outputPath) {
    await processInputs(args, outputPath);
  } else {
    for (const input of args) {
      try {
        if (input.startsWith('http://') || input.startsWith('https://')) {
          const data = await fetchUrl(input);
          console.log(data);
        } else {
          const data = await readFile(input);
          console.log(data);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
}

main();
