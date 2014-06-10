/* jshint node: true */
"use strict";

var watcher = require("./inotify-recursive");
var Watcher = new watcher.Watcher("/tmp/home");

Watcher.on("newfile", function(file) {
	console.log("UOWWWWW, we have a new file: " + file);
});