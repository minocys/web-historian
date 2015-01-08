var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.respond = function(res, data, statusCode) {
  res.writeHead(statusCode, exports.headers);
  res.end(data);
}

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, or anything that doesn't change often.)
  var encoding = {encoding:'utf8'};
  //readfile, appending full file name with archive.paths.siteAssets
  fs.readFile(archive.paths.siteAssets + asset, encoding, function(err, data){
      if(err){
        fs.readFile(archive.paths.archivedSites + asset, encoding, function(err, data){
          if(err){
            exports.respond(res, err, 404);
          }else {
            exports.respond(res, data, 200);
          }
        });
      } else {
        exports.respond(res, data, 200);
      }
    });
};

exports.collectData = function(req, callback) {
  var data = "";
  req.on('data', function(chunk){
    data += chunk;
  });
  req.on('end', function(){
    console.log(data);
    return (callback) ? callback(data) : data;
  });
}

exports.writeToList = function(req, res) {
  exports.collectData(req, function(data){
    data = data.split('=')[1] + "\n";
    if(!archive.isUrlInList(data)){
      archive.addUrlToList(data);
      exports.respond(res, 'URL added', 302);
    } else {
      exports.respond(res, 'Already added', 404);
    }
  });
}

// As you progress, keep thinking about what helper functions you can put here!
