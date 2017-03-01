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

  this.fire = function fire(x1, y1, x2, y2, team, time) {

    var bullet = projectiles.getFirstExists(false);
    if (bullet) {

      if (time) {
        var dh = (Date.now() - time) / 1000 * SPEED;
        var m = (y2-y1) / (x2-x1);
        var dx = Math.sqrt(Math.pow(dh, 2) / (1 + Math.pow(m, 2)));
        var dy = Math.sqrt(Math.abs(Math.pow(dh, 2) - Math.pow(dx, 2)));
        dx *= x2 - x1 > 0 ? 1 : -1;
        dy *= y2 - y1 > 0 ? 1 : -1;
        bullet.reset(x1 + dx, y1 + dy); // offset
      } else {
        bullet.reset(x1, y1);
      }

      bullet.team = team;
      bullet.rotation = this.game.physics.arcade.moveToXY(
        bullet, x2, y2, SPEED
      ) + Math.PI / 2;

    }
  };
}

module.exports = new ProjectileStore();
