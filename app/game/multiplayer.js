'use strict';

var pubnub = require('lib/pubnub-client'),
    _ = require('lodash');

var me = pubnub.getUUID();

var currentLobby = null;
exports.join = function join(lobbyId) {
  console.log('p', pubnub);
  if (currentLobby) pubnub.unsubcribeAll();
  pubnub.subscribe(lobbyId);
  currentLobby = lobbyId;
};

exports.emit = function emit(actionType, data) {
  pubnub.publish(currentLobby, {type: actionType, data: data});
};

var Other = require('game/other');

exports.sync = function sync(game, state) {
  pubnub.clearListeners();
  pubnub.onMessage(function(payload) {
    if (payload.publisher === me) return;
    var data = payload.message.data;
    switch (payload.message.type) {
    case 'JOIN':
      var actor = _.find(state.others, {id: payload.publisher});
      if (!actor) {
        state.others.push(new Other(game, payload.publisher, data.x, data.y));
      }
      break;

    case 'STATE':
      var actor = _.find(state.others, {id: payload.publisher});
      if (!actor) {
        actor = new Other(game, payload.publisher, data.x, data.y);
        state.others.push(actor);
        return;
      }
      actor.player.sprite.x = data.x;
      actor.player.sprite.y = data.y;
      actor.player.sprite.body.velocity.x = data.vx;
      actor.player.sprite.body.velocity.y = data.vy;
      break;

    case 'I_SHOT':
      break;

    case 'I_GOT_HIT':
      break;
    }
  });
};
