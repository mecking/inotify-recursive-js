inotify-recursive-js
====================

By default Inotify monitoring of directories is not recursive, so I did it... 


# Usage

## Install
    $ henrique@labsec:~/code/js/test$ npm install inotify-recursive
    $ henrique@labsec:~/code/js/test$ node

## Coding
```javascript
    var watcher = require("inotify-recursive");
    var Watcher = new watcher.Watcher("/tmp/inotify");
    Watcher.on("newfile", function(file) {
        console.log("UOWWWWW, we have a new file: " + file);
    });
    
```

## Out
```
 [Watcher] Home directory: /tmp/inotify
 [add_Watch] Add new watch for /tmp/inotify
 [inotify_Callback] Directory for watch: /tmp/inotify/dir1
 [add_Watch] Add new watch for /tmp/inotify/dir1
 [inotify_Callback] Directory for watch: /tmp/inotify/dir2
 [add_Watch] Add new watch for /tmp/inotify/dir2
 [inotify_Callback] File opened was closed: /tmp/inotify/dir1/file1
UOWWWWW, we have a new file: /tmp/inotify/dir1/file1
 [inotify_Callback] File opened was closed: /tmp/inotify/dir2/file2
UOWWWWW, we have a new file: /tmp/inotify/dir2/file2
 [inotify_Callback]file  file1  deleted
 [inotify_Callback]file  file2  deleted
 [inotify_Callback]directory  dir1  deleted

```
