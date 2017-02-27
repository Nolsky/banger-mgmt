'use strict';

var socket = require('lib/socket-client'),
    _ = require('lodash');

var currentLobby = null;
exports.join = function join(lobbyId) {
  if (currentLobby) socket.leaveAll();
  socket.join(lobbyId);
  currentLobby = lobbyId;
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
  socket.on('UPDATE', function(data) {

    _.each(data.playerStates, function(ps, player) {
      if (player === socket.uuid) return;
      var actor = others[player];

      if (!actor) {
        actor = new Other(game, player, ps.x, ps.y);
        state.others.push(actor);
        others[player] = actor;
      }

      actor.setPlayerState(ps);
    });

    _.each(others, function(other, id) {
      if (!data.playerStates[id]) {
        other.player.sprite.kill();
        var i = state.others.indexOf(other);
        if (i === -1) return;
        state.others.splice(i, 1);
        delete others[id];
      }
    });



  });
};
