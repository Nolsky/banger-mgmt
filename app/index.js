'use strict';

window.PIXI = require('pixi.js');
window.p2 = require('p2');
window.Phaser = require('phaser');


var game = new Phaser.Game(640,360, Phaser.AUTO);

var image;

var GameState = {
  preload: function() {
    //LOAD RESOURCES
    game.load.image('crapSnowflake', 'assets/imgs/iceTowerBase.png');

  },
  create: function() {
    //INSTANTIATE GAME ENTITIES
    image = game.add.sprite(0, 0, 'crapSnowflake');

    game.physics.enable(image, Phaser.Physics.ARCADE);
    image.anchor.set(0.5);

  },
  update: function() {
    //GAME LOOP

    if (game.physics.arcade.distanceToPointer(image, game.input.activePointer) > 8) {
      game.physics.arcade.moveToPointer(image,300);
    } else {
      image.body.velocity.set(0);
    }

  }
};

game.state.add('GameState', GameState);
game.state.start('GameState');