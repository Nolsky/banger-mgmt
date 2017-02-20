'use strict';

window.PIXI = require('pixi.js');
window.p2 = require('p2');
window.Phaser = require('phaser');


var game = new Phaser.Game(640,360, Phaser.AUTO);

var dogeSprite, cursors, wasd;

var GameState = {
  preload: function() {
    //LOAD RESOURCES
    game.load.atlas('doge', 'assets/imgs/doge/dogeAtlas.png', 'assets/imgs/doge/dogeAtlas.json');
  },

  create: function() {
    //INSTANTIATE GAME ENTITIES
    dogeSprite = game.add.sprite(100, 100, 'doge');
    dogeSprite.scale.set(0.2);
    dogeSprite.animations.add('idleDoge', [0,1,2,3,4,5,6,7,8,9], 5, true);
    dogeSprite.play('idleDoge');
    dogeSprite.animations.add('runDoge', [10,11,12,13,14,15,16,17], 8, true);
    game.physics.enable(dogeSprite, Phaser.Physics.ARCADE);
    dogeSprite.anchor.set(0.5, 1);
    dogeSprite.body.collideWorldBounds = true;
    dogeSprite.body.setSize(350,450,100,10);

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
    dogeSprite.body.velocity.set(0);

    if (wasd.right.isDown || cursors.right.isDown) {
      dogeSprite.body.velocity.x = 400;
      dogeSprite.scale.x = 0.2;
      dogeSprite.play('runDoge');
    } else if (wasd.left.isDown || cursors.left.isDown) {
      dogeSprite.body.velocity.x = (-400);
      dogeSprite.scale.x = -0.2;
      dogeSprite.play('runDoge');
    }

    if (wasd.down.isDown || cursors.down.isDown) {
      dogeSprite.body.velocity.y = 400;
      dogeSprite.play('runDoge');
    } else if (wasd.up.isDown || cursors.up.isDown) {
      dogeSprite.body.velocity.y = (-400);
      dogeSprite.play('runDoge');
    }

    if (!(wasd.right.isDown || wasd.left.isDown ||
      wasd.down.isDown || wasd.up.isDown ||
      cursors.right.isDown || cursors.left.isDown ||
      cursors.down.isDown || cursors.up.isDown)
      ) {
      dogeSprite.play('idleDoge');
    }

  }
};

game.state.add('GameState', GameState);
game.state.start('GameState');