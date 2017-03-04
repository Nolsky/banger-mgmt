'use strict';

var Player = require('./player');

function Computer(game, id) {
  this.id = id;
  var player = new Player(game, 'skynet');
  this.player = player;
  this.game = game;
  this.lastMove = 0;
  this.lastShot = Date.now();
  this.lastX = null;
  this.lastY = null;
  this.nextXInvert = 1;
  this.nextYInvert = 1;
}


Computer.prototype.update = function update(gameState) {
  var sprite = this.player.sprite;
  var xDir = ((gameState.me.player.sprite.x - this.player.sprite.x)/Math.abs(gameState.me.player.sprite.x - this.player.sprite.x));
  var yDir = ((gameState.me.player.sprite.y - this.player.sprite.y)/Math.abs(gameState.me.player.sprite.y - this.player.sprite.y));

  // if (Date.now() - this.lastMove > 4000) {
  //   sprite.body.velocity.set(0);
  // }

  if (Date.now() - this.lastMove > 1000 + Math.random() * 2000) {
    this.lastMove = Date.now();

    if (this.lastX !== null) {
      if (Math.abs(this.lastX - this.player.sprite.x) < 10 && this.nextXInvert !== -1) {
        this.nextXInvert = -1;
      } else {
        this.nextXInvert = 1;
      }
      if (Math.abs(this.lastY - this.player.sprite.y) < 10 && this.nextYInvert !== -1) {
        this.nextYInvert = -1;
      } else {
        this.nextYInvert = 1;
      }
    }

    sprite.body.velocity.x = Math.floor(
      xDir * Math.random() * this.player.SPEED) * this.nextXInvert;
    sprite.body.velocity.y = Math.floor(
      yDir * Math.random() * this.player.SPEED) * this.nextYInvert;

    this.lastX = this.player.sprite.x;
    this.lastY = this.player.sprite.y;

    if (this.player.sprite.x > 1040) {
      this.player.sprite.x = 1030;
    }


  }

  this.player.updateAnimation();


  if (Date.now() - this.lastShot > Math.random() * 4000) {
    this.player.shoot(
      gameState.me.player.sprite.x, gameState.me.player.sprite.y
    );

    this.lastShot = Date.now();

  }

};

module.exports = Computer;
