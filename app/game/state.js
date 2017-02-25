'use strict';

var Phaser = require('phaser'),
    _ = require('lodash'),
    Player = require('game/player'),
    Me = require('game/me'),
    Computer = require('game/computer'),
    ProjectileStore = require('game/projectile_store');

var state = {};
window.bm_state = state;

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
    state.me = new Me(this);
    ProjectileStore.init(this, 100);

    state.enemies = [];
    for (var i = 0; i < 10; i++) {
      state.enemies.push(new Computer(this, 'computer-' + i));
    }

    // Fits game in page
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    // this.scale.setScreenSize( true );      
    
  },

  update: function() {
    var game = this;
    // Me
    state.me.update();
    this.physics.arcade.collide(state.me.player.sprite, state.collisionLayer);
    this.physics.arcade.collide(
      ProjectileStore.get(), state.me.player.sprite, function(hit, bullet) {
        bullet.kill();
        state.me.player.damage();
      }, null, game
    );

    // Others
    _.each(state.enemies, function(enemy) {
      if (!enemy.player.alive) return;
      enemy.update(state);
      game.physics.arcade.collide(enemy.player.sprite, state.collisionLayer);
      game.physics.arcade.collide(
        ProjectileStore.get(), enemy.player.sprite, function(hit, bullet) {
          bullet.kill();
          enemy.player.damage();
        }, null, game
      );
    });

    // Collision Checking
    this.physics.arcade.collide(
      ProjectileStore.get(), state.collisionLayer, function(bullet) {
        bullet.kill();
      }, null, game
    );
    
  },

  render: function(game) {
    game.debug.text('fps: ' + game.time.fps, 20, 20, 'white');
  }
};
