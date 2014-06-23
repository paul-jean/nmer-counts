var nmer = require("./nmers");
var assert = require("assert");

var tree = {};
nmer.writeNmers(tree, "AAAAAAAA", 8);
//assert.equal(tree.A.A.A.A.A.A.A.A, 1);
console.log("SUCCEEDED");
console.log("nmer counts for chunk " + "AAAAAAAA" + ":");
nmer.printNmerCounts(tree, "");

var tree2 = {};
nmer.writeNmers(tree2, "AAAAAAAAT", 8);
nmer.printNmerCounts(tree2, "");

