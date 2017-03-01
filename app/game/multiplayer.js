'use strict';

var socket = require('lib/socket-client'),
    ProjectileStore = require('game/projectile_store'),
    _ = require('lodash');

var currentLobby = null;
exports.join = function join(lobbyId) {
  if (currentLobby) socket.leaveAll();
  socket.join(lobbyId);
  currentLobby = lobbyId;
};

exports.myId = function myId() {
  return socket.uuid();
};

exports.update = function update(data) {
  socket.emit('update', data);
};

exports.emit = function emit(type, data) {
  socket.emit('event', {
    type: type,
    data: data
  });
};
var Other = require('game/other');
var others = {};

exports.sync = function sync(game, state) {
  socket.clearListeners();

  var eventHandlers = {
    'SHOOT': function(b) {
      ProjectileStore.fire(b.x1, b.y1, b.x2, b.y2, b.team, b.time);
    }
  };


  socket.on('UPDATE', function(data) {

    // Update player states
    _.each(data.playerStates, function(ps, player) {
      if (player === socket.uuid()) return;
      var actor = others[player];

      if (!actor) {
        actor = new Other(game, player, ps.x, ps.y);
        state.others.push(actor);
        others[player] = actor;
      }

      actor.setPlayerState(ps);
    });

    // Remove disconnected players
    _.each(others, function(other, id) {
      if (!data.playerStates[id] || id === socket.uuid()) {
        other.player.die();
        var i = state.others.indexOf(other);
        if (i === -1) return;
        state.others.splice(i, 1);
        delete others[id];
      }
    });

    // Process events
    _.each(data.events, function(event) {
      if (event.actorId === socket.uuid()) return;
      eventHandlers[event.type](event.data);
    });



  });
};
