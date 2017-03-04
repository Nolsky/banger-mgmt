'use strict';

var Player = require('./player');
var joystickFactory = require('../lib/joystick');

function Me(game) {
  var player = new Player(game, 'me');
  this.player = player;
  this.game = game;
  window.me = this;

  game.camera.follow(player.sprite);

  this.useJoysticks = !game.game.device.desktop;
  this.useJoysticks = true;

  // Controls
  if (this.useJoysticks) {
    var rightBound = game.game.width;
    var bottomBound = game.game.height;
    this.left = joystickFactory(game, 200, bottomBound - 200);
    this.right = joystickFactory(game, rightBound - 200, bottomBound - 200);
  } else {
    this.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.dirs = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D)
    };
  }

}


Me.prototype.update = function update() {
  var mysprite = this.player.sprite;
  mysprite.body.velocity.set(0);

  if (this.useJoysticks) {

    var direction = this.left.getStatus();
    if (direction.isDown) {
      mysprite.body.velocity.x = this.player.SPEED * direction.x;
      mysprite.body.velocity.y = this.player.SPEED * direction.y;
    }

    var aim = this.right.getStatus();
    if (aim.isDown) {
      this.player.shoot(
        mysprite.x + (aim.x * 90),
        mysprite.y + (aim.y * 90)
      );
    }

  } else { // keys and mouse

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

    if (this.fireButton.isDown || this.game.input.activePointer.isDown) {
      this.player.shoot(
        this.game.input.activePointer.position.x,
        this.game.input.activePointer.position.y
      );
    }

  }

  if (this.game.multi) {
    this.player.team = this.game.multi.myId();
    this.game.multi.update({
      health: this.player.health,
      x: Math.floor(mysprite.x),
      y: Math.floor(mysprite.y)
    });
  }

  this.player.updateAnimation();

};

module.exports = Me;
