'use strict';

var Phaser = require('phaser'),
    Player = require('game/player'),
    ProjectileStore = require('game/projectile_store');

var state = {};
window.bm_state = state;

var PLAYER_SPEED = 300;

module.exports = {
  preload: function() {
    this.time.advancedTiming = true; // to track fps
    
    this.load.atlas('doge', 'assets/imgs/doge/dogeAtlas.png',
                    'assets/imgs/doge/dogeAtlas.json');
    this.load.atlas('bullets', 'assets/imgs/bullets.png',
                    'assets/imgs/bullets.json');
    
    this.load.tilemap('arena', 'assets/tilesets/arena.json',
                      null, Phaser.Tilemap.TILED_JSON);
    
    this.load.image('badSnowFlake', 'assets/imgs/iceTowerBase.png');
    this.load.image('tiles', 'assets/tilesets/scifitiles-sheet.png');
  },

  create: function() {
    // Map
    var tileMap = this.add.tilemap('arena');
    tileMap.addTilesetImage('scifitiles-sheet', 'tiles');
    tileMap.createLayer('Base');
    state.collisionLayer = tileMap.createLayer('Collision');
    state.collisionLayer.visible = false;
    tileMap.setCollisionByExclusion([], true, state.collisionLayer);
    state.collisionLayer.resizeWorld();

    // Entities
    state.me = new Player(this);
    window.me = state.me;
    this.camera.follow(state.me.sprite);
    ProjectileStore.init(this, 100);

    // Controls
    state.fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    state.wasd = {
      up: this.input.keyboard.addKey(Phaser.Keyboard.W),
      down: this.input.keyboard.addKey(Phaser.Keyboard.S),
      left: this.input.keyboard.addKey(Phaser.Keyboard.A),
      right: this.input.keyboard.addKey(Phaser.Keyboard.D)
    };

    // Fits game in page
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    // this.scale.setScreenSize( true );      
    
  },

  update: function() {
    // Me
    var mysprite = state.me.sprite;
    mysprite.body.velocity.set(0);

    var wasd = state.wasd;
    if (wasd.right.isDown) {
      if (!wasd.left.isDown) {
        mysprite.body.velocity.x = PLAYER_SPEED;
        mysprite.scale.x = 0.2;
      }
    } else if (wasd.left.isDown) {
      mysprite.body.velocity.x = -PLAYER_SPEED;
      mysprite.scale.x = -0.2;
    }

    if (wasd.down.isDown) {
      if (!wasd.up.isDown) {
        mysprite.body.velocity.y = PLAYER_SPEED;
      }
    } else if (wasd.up.isDown) {
      mysprite.body.velocity.y = -PLAYER_SPEED;
    }

    state.me.updateAnimation();


    if (state.fireButton.isDown) {
      ProjectileStore.fire(mysprite.x, mysprite.y, 'pointer');
    }

    // Collision Checking
    this.physics.arcade.collide(mysprite, state.collisionLayer);
    this.physics.arcade.collide(
      ProjectileStore.get(), state.collisionLayer, function(bullet) {
        bullet.kill();
      }, null, this
    );
    
  },

  render: function(game) {
    game.debug.text('fps: ' + game.time.fps, 20, 20, 'white');
  }
};
