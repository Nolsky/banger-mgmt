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

Other.prototype.setPlayerState = function setPlayerState(ps) {
  var sprite = this.player.sprite;
  sprite.x = ps.x;
  sprite.y = ps.y;
  sprite.body.velocity.x = ps.vx;
  sprite.body.velocity.y = ps.vy;
};

Other.prototype.update = function update() {
  this.player.updateAnimation();
};

module.exports = Other;
