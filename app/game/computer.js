'use strict';

var Player = require('./player');

function Computer(game, id) {
  this.id = id;
  var player = new Player(game, 'comps');
  this.player = player;
  this.game = game;
  this.lastMove = 0;
  this.lastShot = Date.now();
}


Computer.prototype.update = function update(gameState) {
  var sprite = this.player.sprite;

  if (Date.now() - this.lastMove > 3000) {
    sprite.body.velocity.set(0);
  }

  if (Date.now() - this.lastMove > 5000) {
    this.lastMove = Date.now();

    sprite.body.velocity.x = Math.floor(
      (Math.random() * 2 - 1) * this.player.SPEED);
    sprite.body.velocity.y = Math.floor(
      (Math.random() * 2 - 1)  * this.player.SPEED);
  }

  this.player.updateAnimation();

  if (Date.now() - this.lastShot > 4000) {
    this.player.shoot(gameState.me.player.sprite);
    this.lastShot = Date.now();
  }

};

module.exports = Computer;
