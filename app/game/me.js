'use strict';

var Player = require('./player');

function Me(game) {
  var player = new Player(game, 'me');
  this.player = player;
  this.game = game;
  window.me = this;

  game.camera.follow(player.sprite);

  // Controls
  this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.dirs = {
    up: game.input.keyboard.addKey(Phaser.Keyboard.W),
    down: game.input.keyboard.addKey(Phaser.Keyboard.S),
    left: game.input.keyboard.addKey(Phaser.Keyboard.A),
    right: game.input.keyboard.addKey(Phaser.Keyboard.D)
  };

}


Me.prototype.update = function update() {
  var mysprite = this.player.sprite;
  mysprite.body.velocity.set(0);

  var dirs = this.dirs;
  if (dirs.right.isDown) {
    if (!dirs.left.isDown) {
      mysprite.body.velocity.x = this.player.SPEED;
    }
  } else if (dirs.left.isDown) {
    mysprite.body.velocity.x = -this.player.SPEED;
  }

  if (dirs.down.isDown) {
    if (!dirs.up.isDown) {
      mysprite.body.velocity.y = this.player.SPEED;
    }
  } else if (dirs.up.isDown) {
    mysprite.body.velocity.y = -this.player.SPEED;
  }

  if (this.game.multi) {
    this.game.multi.emit('STATE', {
      x: mysprite.x,
      y: mysprite.y,
      vx: mysprite.body.velocity.x,
      vy: mysprite.body.velocity.y
    });
  }

  this.player.updateAnimation();

  if (this.fireButton.isDown) {
    this.player.shoot('pointer');
  }

};

module.exports = Me;
