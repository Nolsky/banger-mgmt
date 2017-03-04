'use strict';

var Player = require('./player');

function Other(game, id, x, y) {
  this.id = id;
  var player = new Player(game, id);
  this.player = player;
  this.game = game;
  player.sprite.x = x;
  player.sprite.y = y;
}

Other.prototype.setPlayerState = function setPlayerState(ps) {
  var sprite = this.player.sprite;
  this.player.health = ps.health;
  if (ps.health < 1) {
    this.player.die();
  };
  if (!this.player.alive) return;
  if (Math.abs((ps.x - sprite.x) + (ps.y - sprite.y)) < 5) {
    sprite.reset(ps.x, ps.y); // stops movement
  } else {
    this.game.physics.arcade.moveToXY(sprite, ps.x, ps.y, null, 40);
  }
};

Other.prototype.update = function update() {
  this.player.updateAnimation();
};

module.exports = Other;
