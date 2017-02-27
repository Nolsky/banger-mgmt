'use strict';

var Phaser = require('phaser'),
  _ = require('lodash'),
  Me = require('game/me'),
  Computer = require('game/computer'),
  ProjectileStore = require('game/projectile_store');

var state = {};
window['__bm_state'] = state;

function getQuery() {
  var s = window.location.search.slice(1);
  s = s.split('&');
  var params = {};
  _.each(s, function(kv) {
    var tuple = kv.split('=');
    params[tuple[0]] = tuple[1];
  });
  return params;
}

module.exports = {
  preload: function() {
    this.time.advancedTiming = true; // to track fps
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
    state.others = [];

    var multi = require('game/multiplayer');
    var q = getQuery();
    if (q.room) {
      multi.join(q.room);
      multi.sync(this, state);
      this.multi = multi;
    } else {
      for (var i = 0; i < 3; i++) {
        state.others.push(new Computer(this, 'computer-' + i));
      }
    }



    // Fits game in page
    // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // this.scale.pageAlignHorizontally = true;
    // this.scale.pageAlignVertically = true;
    // this.scale.setScreenSize( true );
  },

  update: function() {
    var game = this;
    // Me
    state.me.update();
    this.physics.arcade.collide(state.me.player.sprite, state.collisionLayer);
    this.physics.arcade.overlap(
      ProjectileStore.get(),
      state.me.player.sprite,
      function(hit, bullet) {
        hit;
        if (bullet.team === state.me.player.team) return;
        bullet.kill();
        state.me.player.damage();
      },
      null,
      game
    );

    // Others
    _.each(state.others, function(other) {
      if (!other.player.alive) return;
      other.update(state);
      game.physics.arcade.collide(other.player.sprite, state.collisionLayer);
      game.physics.arcade.overlap(
        ProjectileStore.get(),
        other.player.sprite,
        function(hit, bullet) {
          hit;
          if (bullet.team === other.player.team) return;
          bullet.kill();
          other.player.damage();
        },
        null,
        game
      );
    });

    // Collision Checking
    this.physics.arcade.collide(
      ProjectileStore.get(),
      state.collisionLayer,
      function(bullet) {
        bullet.kill();
      },
      null,
      game
    );
  },

  render: function(game) {
    game.debug.text('fps: ' + game.time.fps, 20, 20, 'white');
  }
};
