'use strict';

var Phaser = require('Phaser');
var ProjectileStore = require('game/projectile_store');

function Player(game, team) {
  this.game = game;
  this.team = team;
  this.health = 5;
  this.alive = true;
  this.SPEED = 300;
  this.FIRERATE = 300;

  var x = game.world.randomX;
  var y = game.world.randomY;

  this.sprite = game.add.sprite(x, y, 'doge');
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.scale.set(0.2);
  this.sprite.anchor.set(0.5, 0.5);
  this.sprite.body.immovable = false;
  this.sprite.body.collideWorldBounds = true;
  this.sprite.body.setSize(200, 150, 150, 350); // x, y, offsetx, offsety

  this.sprite.animations.add(
    'idleDoge', [10,11,12,13,14,15,16,17,18,19], 5, true);
  this.sprite.play('idleDoge');
  this.currentAnimation = 'idleDoge';

  this.sprite.animations.add('runDoge', [20,21,22,23,24,25,26,27], 8, true);
}

Player.prototype.damage = function damage() {
  this.health -= 1;
  if (this.health <= 0) {
    this.die();
    return true;
  }
  return false;
};

Player.prototype.die = function damage() {
  this.alive = false;
  this.sprite.kill();
};

Player.prototype.shoot = function shoot(target) {
  if (!this.alive) return;
  if (Date.now() - this.lastShot < this.FIRERATE) return;
  if (this.game.multi) {
    this.game.multi.emit('I_SHOT', {
      team: this.team,
      x: this.sprite.x,
      y: this.sprite.y
    });
  }
  this.lastShot = Date.now();
  ProjectileStore.fire(this.sprite.x, this.sprite.y, target, this.team);
};

Player.prototype.updateAnimation = function updateAnimation() {
  var vx = this.sprite.body.velocity.x;
  var vy = this.sprite.body.velocity.y;

  this.sprite.scale.x = 0.2 * (vx < 0 ? -1 : 1);

  var isMoving = Math.abs(vx) + Math.abs(vy) > 1;
  if (isMoving) {
    if (this.currentAnimation === 'idleDoge') {
      this.sprite.play('runDoge');
      this.currentAnimation = 'runDoge';
    }
  } else {
    if (this.currentAnimation === 'runDoge') {
      this.sprite.play('idleDoge');
      this.currentAnimation = 'idleDoge';
    }
  }
};

module.exports = Player;
