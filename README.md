Movie Fetcher
==============

Small application for private usage only that list all the available torrent movies on [YTS](http://yts.re/). Data are provided by [YTS API](http://yts.re/api).

## Requirement

* NodeJS

## Installation

Go at the root folder of the project and execute <code>npm install</code> that download all the necessary librairies.
Edit the configation file in config/config.json

```
{
    // Avalable option 'local' or 'server'
    // 'server' is when you want to download the .torrent on your server, in that case the upload_path is mandatory
    // 'local' is when you want to download the .torrent directly on you computer
    "download" : "local",

    // Is mandatory when you want to download the .torrent on your server, it's the path on you server
    "upload_path": "/path/to/download"
}
```

## Launch

Execute <code>node server.js</code> and visite [http://localhost:3001/](http://localhost:3001/)
