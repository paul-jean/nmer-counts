var fs = require("fs");
var fname = "./chrM.fa";
var nmerSize = 8;

var countNmers = function(fastaFile, nmerSize) {
  var fd = fs.openSync(fastaFile, "r");
  // move the file position to the end of the header line
  var headerBuff = new Buffer(1);
  var pos = 0;
  while ( !fs.readSync(fd, headerBuff, 0, 1, pos).match(/\n/) ) {
    pos += 1;
  }
  // count nmers in the remaining lines
  var nmerTree = {};
  var buffSize = 1000;
  var buff = new Buffer(buffSize);
  var numBytesRead = 0;
  var chunk = "";
  var overhang = "";
  while ( (numBytesRead = fs.readSync(fd, buff, 0, buffSize, pos)) > 0) {
    chunk = overhang + cleanString(buffer);
    writeNmers(nmerTree, chunk, nmerSize);
    overhang = getOverhang(chunk, nmerSize);
    pos += numBytesRead;
  }

  return nmerTree;
};

var getOverhang = function(chunk, nmerSize) {
  var chunkLength = chunk.length;
  var overhangLength = Math.min(nmerSize - 1, chunkLength);
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
  for (var i = 0; i < buffLength; i ++) {
    c = buffer[i];
    if (c.match(/[AGCT]/)) {
      cleaned += c;
    }
  }
  return cleaned;
};

var writeNmers = function(tree, chunk, nmerSize) {
  var nmer;
  var pos = 0;
  var base;
  var lastNmerIndex = chunk.length - nmerSize;
  var i, j;
  var treeRef;
  if (lastNmerIndex < 0) return;
  for (i = 0; i <= lastNmerIndex; i ++) {
    treeRef = tree;
    nmer = "";
    for (j = 0; j < nmerSize; j ++) {
      base = chunk[i + j];
      nmer += base;
      if (!treeRef[base]) {
        treeRef[base] = {};
      }
      treeRef = treeRef[base];
    }
    if (typeof treeRef[base] != 'number') {
      treeRef[base] = 0;
    }
    treeRef[base] ++;
  }
};

var printNmerCounts = function(tree, nmer) {
  var bases = ["A", "C", "G", "T"];
  bases.map(function(b) {
    if (tree[b]) {
      if (typeof tree[b] == 'number') {
        console.log(nmer + ": " + tree[b]);
      } else {
        printNmerCounts(tree[b], nmer + b);
      }
    }
  });
};

exports.writeNmers = writeNmers;
exports.printNmerCounts = printNmerCounts;
