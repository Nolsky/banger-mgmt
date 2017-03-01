'use strict';

var _ = require('lodash'),
    config = require('config'),
    Promise = require('bluebird'),
    io = require('socket.io-client'); // socket.io lib

var host = window.location.origin;
if (host.indexOf('localhost') !== -1) host = config.socketUrl;
var socket = io(host); // this socket client
exports.uuid = function uuid() {
  return socket.id;
}


var ready = new Promise(function(res) {
  socket.on('connect', function() {
    clearListeners();
    console.log('Connected to server');
    res();
  });
});

socket.on('disconnect', function() {
  clearListeners();
  console.log('Disconnected from server');
});

var listeners = {};
exports.on = function on(name, cb) {
  ready.then(function() {
    listeners[name]  = listeners[name] || [];
    listeners[name].push(cb);
    socket.on(name, cb);
  });
};

function clearListeners() {
  _.each(listeners, function(handlers, name) {
    _.each(handlers, function(fn) {
      socket.removeListener(name, fn);
    });
  });
}
exports.clearListeners = clearListeners;


exports.join = function join(room) {
  ready.then(function() {
    console.log('Joining', room);
    socket.emit('join', {room: room});
  });
};

exports.leaveAll = function leaveAll() {
  socket.emit('leave-all');
};

exports.emit = socket.emit.bind(socket);
