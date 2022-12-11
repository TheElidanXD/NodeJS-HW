"use strict";

require("core-js/modules/web.dom.iterable.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformCsvToTxt = transformCsvToTxt;
var _csvtojson = _interopRequireDefault(require("csvtojson"));
var fs = _interopRequireWildcard(require("fs"));
var _stream = require("stream");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const readStream = fs.createReadStream('./src/csv/nodejs-hw1-ex1.csv');
const writeStream = fs.createWriteStream('./src/txt/nodejs-hw1-ex1.txt');

/**
 * Removes "Amount" field and converts object keys to lower case
 */
const transformCsvLine = new _stream.Transform({
  transform(chunk, encoding, callback) {
    let chunkObject = JSON.parse(chunk);
    delete chunkObject.amount;
    chunkObject = Object.keys(chunkObject).reduce((acc, key) => {
      acc[key.toLowerCase()] = chunkObject[key];
      return acc;
    }, {});
    callback(null, JSON.stringify(chunkObject) + '\n');
  }
});
function transformCsvToTxt() {
  (0, _stream.pipeline)((0, _csvtojson.default)().fromStream(readStream), transformCsvLine, writeStream, error => error ? console.error(error.message) : console.log('process finished'));
}