"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.textReverser = textReverser;
require("core-js/modules/es6.regexp.split.js");
require("core-js/modules/es6.regexp.to-string.js");
function textReverser() {
  process.stdin.on('data', data => {
    data = data.toString().split('').reverse().join('');
    process.stdout.write(data + '\n\n');
  });
}