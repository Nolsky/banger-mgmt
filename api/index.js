'use strict';

var express = require('express'),
    _ = require('lodash');

// Express
var app = express();
var port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/../app/public')); // static serving

// Socket.io
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Games Digester
var DPS = 60; // digests per second
var DIGEST_INT = Math.floor(1000 / DPS);
var ticks = 0;
var games = {};
var cycle;
function stopCycle() {
  console.log('Clearing game cycle');
  clearInterval(cycle);
  cycle = null;
}
function digest() {
  ticks++;
  if (ticks % 5 === 0) process.stdout.write(ticks % 2 === 0 ? ':' : '.');
  if (ticks % 10000 === 0) console.log('\nOpen games:', games);
  if (!Object.keys(games).length) stopCycle();
  _.each(games, function(state, gameId) {
    if (!state.users.length) {
      delete games[gameId];
      return;
    }
    io.to(gameId).emit('UPDATE', state);
    state.events = []; // clear events
  });
}
function startCycle() {
  if (cycle) return;
  console.log('Starting up game cycle');
  cycle = setInterval(digest, DIGEST_INT);
}

function createGame(gameId, state) {
  if (games[gameId]) return;
  games[gameId] = _.extend({
    users: [],
    playerStates: {},
    events: []
  }, state);
  if (!cycle) startCycle();
}

io.sockets.on('connection', function(client) {
  console.log('New Connection:', client.id);

  function leaveGame(gameId) {
    client.leave(gameId);
    var g = games[gameId];
    if (!g) return;
    var users = g.users;
    users.splice(users.indexOf(client.id), 1);
    delete g.playerStates[client.id];
  }

  client.on('join', function(data) {
    _.each(client.rooms, leaveGame);
    console.log('Joining game:', data.room);
    if (!data.room) return;

    var game = games[data.room];
    if (!game) {
      createGame(data.room, {users: [client.id]});
    } else {
      game.users.push(client.id);
    }
    client.game = data.room;

    client.join(data.room, function() {
      io.to(data.room).emit('NEW_USERS', client.id);
    });
  });

  client.on('update', function(data) {
    var game = games[client.game];
    if (!game) return;
    game.playerStates[client.id] = _.extend(
      game.playerStates[client.id] || {}, data);
  });

  client.on('event', function(payload) {
    var game = games[client.game];
    if (!game) return;
    payload.actorId = client.id;
    game.events.push(payload);
  });

  client.on('disconnect', function() {
    leaveGame(client.game);
    _.each(client.rooms, leaveGame);
    console.log('Client:', client.id, ' disconnected');
  });

});

server.listen(port, function() {
  console.log('Listening on ' + port);
});
