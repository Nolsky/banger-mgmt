'use strict';

window.PIXI = require('pixi.js');
window.p2 = require('p2');
window.Phaser = require('phaser');


var game = new Phaser.Game(640,360, Phaser.AUTO);

var image, cursors, wasd;

var GameState = {
  preload: function() {
    //LOAD RESOURCES
    game.load.image('badSnowflake', 'assets/imgs/iceTowerBase.png');

  },
  create: function() {
    //INSTANTIATE GAME ENTITIES
    image = game.add.sprite(0, 0, 'badSnowflake');

    game.physics.enable(image, Phaser.Physics.ARCADE);
    image.anchor.set(0.5);

    cursors = game.input.keyboard.createCursorKeys();
    wasd = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D)
    };


  },
  update: function() {
    //GAME LOOP
    // if (game.physics.arcade.distanceToPointer(image, game.input.activePointer) > 8) {
    //   game.physics.arcade.moveToPointer(image,300);
    // } else {
    //   image.body.velocity.set(0);
    // }

    image.body.velocity.set(0);

    if (wasd.right.isDown || cursors.right.isDown) {
      image.body.velocity.x = 400;
    } else if (wasd.left.isDown || cursors.left.isDown) {
      image.body.velocity.x = (-400);
    }

    if (wasd.down.isDown || cursors.down.isDown) {
      image.body.velocity.y = 400;
    } else if (wasd.up.isDown || cursors.up.isDown) {
      image.body.velocity.y = (-400);
    }



  }
};

game.state.add('GameState', GameState);
game.state.start('GameState');