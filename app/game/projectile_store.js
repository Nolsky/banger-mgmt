'use strict';

var Phaser = require('phaser');

function ProjectileStore() {
  var projectiles = null;

  var SPEED = 400;

  this.init = function init(game, num) {
    this.game = game;
    this.num = num;

    projectiles = game.add.group();
    projectiles.enableBody = true;
    projectiles.physicsBodyType = Phaser.Physics.ARCADE;
    projectiles.createMultiple(num, 'bullets');
    projectiles.setAll('anchor.x', 0.5);
    projectiles.setAll('anchor.y', 0.5);
    projectiles.setAll('outOfBoundsKill', true);
    projectiles.setAll('checkWorldBounds', true);
    projectiles.setAll('scale.x', 1);
    projectiles.setAll('scale.y', 1);
    projectiles.setAll('body.setSize.x', 3);
    projectiles.setAll('body.setSize.y', 3);

    // projectiles.callAll('animations.add', 'animations',
    //                     'fired', [0,1,2,3], 200, true);
    // projectiles.callAll('animations.play', 'animations', 'fired');
  };

  this.get = function get() {
    return projectiles;
  };

  this.fire = function fire(x, y, target, team) {
    var bullet = projectiles.getFirstExists(false);
    if (bullet) {
      bullet.reset(x, y);
      bullet.team = team;
      if (target === 'pointer') {
        bullet.rotation = this.game.physics.arcade.moveToPointer(
          bullet, SPEED, this.game.input.activePointer
        ) + Math.PI / 2;
      } else if (target.x && target.y) {
        bullet.rotation = this.game.physics.arcade.moveToXY(
          bullet, target.x, target.y, SPEED
        ) + Math.PI / 2;
      } else {
        bullet.rotation = this.game.physics.arcade.moveToObject(
          bullet, target, SPEED
        ) + Math.PI / 2;
      }
    }
  };
}

module.exports = new ProjectileStore();
