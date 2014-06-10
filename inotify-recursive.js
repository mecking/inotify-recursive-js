/* jshint node: true */
"use strict";

var EventEmitter = require("events").EventEmitter,
    Inotify = require("inotify").Inotify,
    inotify = new Inotify(),
    util = require("util"),
    path = require("path"),
    fs = require("fs");


function Watcher(base_directory) {
    var hashtable = {};
    var self = this;
    console.log(" [Watcher] Home directory: " + base_directory);


    var fresh_Start = function() {
        add_Watch(base_directory);

        var directory_child = scandirSync(base_directory);
        if (directory_child.length !== 0)
            for (var i = 0, len = directory_child.length; i < len; i++)
                add_Watch(directory_child[i]);
    };


    var add_Watch = function(directory) {
        console.log(" [add_Watch] Add new watch for " + directory);
        var watch = {
            path: directory,
            watch_for: Inotify.IN_ALL_EVENTS,
            callback: inotify_Callback
        };
        var watch_fd = inotify.addWatch(watch);
        hashtable[watch_fd] = directory;
        return watch_fd;
    };


    var inotify_Callback = function(event) {
        var mask = event.mask;
        var type = mask & Inotify.IN_ISDIR ? "directory " : "file ";
        event.name ? type += " " + event.name + " " : " ";
        var fullpath = path.normalize(hashtable[event.watch] + "/" + event.name);

        if (mask & Inotify.IN_CLOSE_WRITE) {
            console.log(" [inotify_Callback] File opened was closed: " + fullpath);
            //console.log(" [inotify_Callback] Monitor: " + self.emit("newfile", fullpath));
            self.emit("newfile", fullpath);
        } else if (mask & Inotify.IN_CREATE) {
            if (mask & Inotify.IN_ISDIR) {
                console.log(" [inotify_Callback] Directory for watch: " + fullpath);
                add_Watch(fullpath);
            }
        } else if (mask & Inotify.IN_DELETE) {
            console.log(" [inotify_Callback]" + type + " deleted ");
            if (mask & Inotify.IN_ISDIR) {
                deleteHashtable(fullpath);
            }
        }
    };


    var scandirSync = function(directory) {
        var files = fs.readdirSync(directory);
        var directories = [];
        for (var i in files) {

            if (!files.hasOwnProperty(i))
                continue;

            var name = path.normalize(String(directory + "/" + files[i]));
            if (fs.statSync(name).isDirectory()) {
                console.log(" [scandir] Directory: " + name);
                directories.push(name);
                directories = directories.concat(scandirSync(name));
                //} else {
                //    console.log(" [scandir] File: " + name);
            }
        }
        //console.log("directories: " + directories);
        return directories;
    };


    this.count = function() {
        var size = 0;
        for (var key in hashtable)
            if (hashtable.hasOwnProperty(key)) size++;
        return size;
    };


    this.list = function() {
        return hashtable;
    };


    var deleteHashtable = function(value) {
        for (var key in hashtable)
            if (hashtable.hasOwnProperty(key))
                if (hashtable[key] === value)
                    delete hashtable[key];
    };


    fresh_Start();
}

util.inherits(Watcher, EventEmitter);

exports.Watcher = Watcher;