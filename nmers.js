var fs = require("fs");

var buffSize = 1000;
var buff = new Buffer(buffSize);

var fname = "./chrM.fa";
var fd = fs.openSync(fname, "r");

var nmerTree = {};

var numBytesRead = 0;
var pos = 0;
var chunk = "";
var overhang = "";
while ( (numBytesRead = fs.readSync(fd, buff, 0, buffSize, pos)) > 0) {
  pos += numBytesRead;
  chunk = overhang + cleanString(buffer);
  writeNmers(nmerTree, chunk);
  overhang = getOverhang(chunk);
}

var getOverhang = function(chunk) {
  var chunkLength = chunk.length;
  var overhangLength = Math.min(7, chunkLength);
  var overhang = "";
  for (var j = overhangLength; j > 0; j --) {
    overhang += chunk[chunkLength - j];
  }
  return overhang;
};

var cleanString = function (buffer) {
  var buffLength = buffer.length;
  var cleaned = "";
  var c;
  for (var i = 0; i < buffLength; i++) {
    c = buffer[i];
    if (!c.match(/[AGCT]/)) continue;
    cleaned += c;
  }
  return cleaned;
};

// TODO implement
var writeNmers = function(tree, chunk) {
  var nmer = "";
  var pos = 0;
  var base;
  // TODO check chunk length edge cases
  for (var i = 0; i < chunk.length - 8; i ++) {
    nmer = "";
    // TODO only do this loop if there are 8 more bases
    for (var j = i; j < 8; j ++) {
      base = chunk[j];
      if (!tree[base]) {
        tree[base] = {};
      }
      tree = tree[base];
    }
    tree[base] ++;
  }
};

// TODO implement
var printNmerCounts = function(tree) {};
