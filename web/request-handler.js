var path = require('path');
var archive = require('../helpers/archive-helpers');
var helper = require('./http-helpers.js');
var url = require('url');
// require more modules/folders here!

var actions = {
  "GET" : function(req, res){
    var path = url.parse(req.url).pathname;
    path = path === '/' ? '/index.html': path;
    helper.serveAssets(res, path);
  },
  "POST" : function(req, res){
    helper.writeToList(req, res);
  },
  "OPTIONS" : function(req, res){

  }
}

exports.handleRequest = function (req, res) {
  var action = actions[req.method]
  if (action){
    action(req, res)
  } else {
    httpHelpers.sendResponse(res, "not found", 404)
  }
};
