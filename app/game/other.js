'use strict';

var Player = require('./player');

function Other(game, id, x, y) {
  this.id = id;
  var player = new Player(game, 'other');
  this.player = player;
  this.game = game;
  player.sprite.x = x;
  player.sprite.y = y;
}

Other.prototype.update = function update(gameState) {
  this.player.updateAnimation();
};

module.exports = Other;
