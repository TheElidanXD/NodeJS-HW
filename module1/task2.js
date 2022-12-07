
const csvToJson = require('csvtojson');
const fs = require('fs');
const { Transform, pipeline } = require('stream');

const readStream = fs.createReadStream('./csv/nodejs-hw1-ex1.csv');
const writeStream = fs.createWriteStream('./txt/nodejs-hw1-ex1.txt')

/**
 * Removes "Amount" field and converts object keys to lower case
 */
const transformCsvLine = new Transform({
    transform(chunk, encoding, callback) {
        let chunkObject = JSON.parse(chunk);
        delete chunkObject.amount;
        chunkObject = Object.keys(chunkObject).reduce((acc, key) => {
            acc[key.toLowerCase()] = chunkObject[key];
            return acc;
        }, {})

        callback(null, JSON.stringify(chunkObject) + '\n')
    }
})

pipeline(
    csvToJson().fromStream(readStream),
    transformCsvLine,
    writeStream,
    (error) => error ? console.error(error.message) : console.log('process finished')
)
