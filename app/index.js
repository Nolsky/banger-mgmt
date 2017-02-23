'use strict';

window.PIXI = require('pixi.js');
window.p2 = require('p2');
window.Phaser = require('phaser');
var Phaser = window.Phaser;

var game = new Phaser.Game(800,800, Phaser.AUTO);
window.game = game;

var dogeSprite, cursors, wasd, projectiles, fireButton,
tileMap, collisionLayer, baddies, bullet, enemyProjectiles,
animRef = null, bulletTime = 0;
var projectileCount = 16;
var enemyCount = 15;
var playerHealth = 10;
var score = 0;
var scoreMultiplier = 0;


var Enemy = function(index, game, player) {
  this.game = game;
  this.health = 1;
  this.player = player;
  this.alive = true;
  this.nextSwitch = 0;
  this.rotationSpeed = Math.floor(Math.random() * 21) - 10;
  var x = game.world.randomX;
  var y = game.world.randomY;
  this.index = index;
  this.img = game.add.sprite(x, y, 'badSnowFlake');
  game.physics.enable(this.img, Phaser.Physics.ARCADE);
  this.img.scale.set(0.5);
  this.img.anchor.set(0.5, 0.5);
  this.img.body.immovable = false;
  this.img.body.collideWorldBounds = true;
  this.img.angle = game.rnd.angle();
};

Enemy.prototype.damage = function() {
  this.health -= 1;
  if (this.health <= 0) {
    this.alive = false;
    this.img.kill();
    return true;
  }

  return false;
};

Enemy.prototype.update = function() {
  if ((game.time.now > this.nextSwitch) && this.alive) {
    this.img.body.velocity.x = Math.floor(Math.random() * 201) - 100;
    this.img.body.velocity.y = Math.floor(Math.random() * 201) - 100;
    this.rotationSpeed = Math.floor(Math.random() * 11) - 5;
    this.nextSwitch = game.time.now + (Math.random() * 10000);
    if (Math.random() > 0.75 && this.alive) {
      enemyBullet(this.img.body.x, this.img.body.y);
    }
  }
  this.img.angle += this.rotationSpeed;

};

var GameState = {
  preload: function() {
    //LOAD RESOURCES
    game.load.atlas('doge', 'assets/imgs/doge/dogeAtlas.png',
      'assets/imgs/doge/dogeAtlas.json');
    game.load.atlas('bullets', 'assets/imgs/bullets.png',
      'assets/imgs/bullets.json');
    game.load.image('badSnowFlake', 'assets/imgs/iceTowerBase.png');
    game.load.tilemap('arena', 'assets/tilesets/arena.json',
      null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/tilesets/scifitiles-sheet.png');
  },

  create: function() {
    //INSTANTIATE GAME ENTITIES

    //Map
    tileMap = game.add.tilemap('arena');
    tileMap.addTilesetImage('scifitiles-sheet', 'tiles');
    tileMap.createLayer('Base');

    collisionLayer = tileMap.createLayer('Collision');
    collisionLayer.visible = false;
    tileMap.setCollisionByExclusion([], true, collisionLayer);
    collisionLayer.resizeWorld();

    //Main Doge
    dogeSprite = game.add.sprite(100, 100, 'doge');
    dogeSprite.scale.set(0.2);
    dogeSprite.animations.add('idleDoge',
      [10,11,12,13,14,15,16,17,18,19], 5, true);
    dogeSprite.play('idleDoge');
    dogeSprite.animations.add('runDoge',
      [20,21,22,23,24,25,26,27], 8, true);
    dogeSprite.animations.add('hurtDoge',
      [0,1,2,3,4,5,6,7,8,9], 20, false);
    game.physics.enable(dogeSprite, Phaser.Physics.ARCADE);
    dogeSprite.anchor.set(0.5, 1);
    dogeSprite.body.collideWorldBounds = true;
    dogeSprite.body.setSize(350, 450, 100, 10);
    game.camera.follow(dogeSprite);

    //Projectiles
    projectiles = game.add.group();
    projectiles.enableBody = true;
    projectiles.physicsBodyType = Phaser.Physics.ARCADE;
    projectiles.createMultiple(projectileCount, 'bullets');
    // projectiles.setAll('angle', 90);
    projectiles.setAll('anchor.x', 0.5);
    projectiles.setAll('anchor.y', 0.5);
    projectiles.setAll('outOfBoundsKill', true);
    projectiles.setAll('checkWorldBounds', true);
    projectiles.setAll('scale.x', 1);
    projectiles.setAll('scale.y', 1);
    projectiles.callAll('animations.add', 'animations',
      'fired', [0,1,2,3], 200, true);
    projectiles.callAll('animations.play', 'animations', 'fired');
    projectiles.setAll('body.setSize.x', 3);
    projectiles.setAll('body.setSize.y', 3);

    enemyProjectiles = game.add.group();
    enemyProjectiles.enableBody = true;
    enemyProjectiles.physicsBodyType = Phaser.Physics.ARCADE;
    enemyProjectiles.createMultiple(enemyCount * 2, 'bullets', [3]);
    enemyProjectiles.setAll('anchor.x', 0.5);
    enemyProjectiles.setAll('anchor.y', 0.5);
    enemyProjectiles.setAll('outOfBoundsKill', true);
    enemyProjectiles.setAll('checkWorldBounds', true);
    enemyProjectiles.setAll('scale.x', 1);
    enemyProjectiles.setAll('scale.y', 1);
    enemyProjectiles.setAll('body.setSize.x', 3);
    enemyProjectiles.setAll('body.setSize.y', 3);

    //input keys
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    wasd = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D)
    };

    //enemies
    baddies = [];
    for (var i = 0; i < enemyCount; i++) {
      baddies.push(new Enemy(i, game, dogeSprite));
    }

  },

  update: function() {
    //GAME LOOP
    dogeSprite.body.velocity.set(0);

    if (wasd.right.isDown || cursors.right.isDown) {
      dogeSprite.body.velocity.x = 400;
      dogeSprite.scale.x = 0.2;
    } else if (wasd.left.isDown || cursors.left.isDown) {
      dogeSprite.body.velocity.x = (-400);
      dogeSprite.scale.x = -0.2;
    }

    if (wasd.down.isDown || cursors.down.isDown) {
      dogeSprite.body.velocity.y = 400;
    } else if (wasd.up.isDown || cursors.up.isDown) {
      dogeSprite.body.velocity.y = (-400);
    }

    if (!(wasd.right.isDown || wasd.left.isDown ||
          wasd.down.isDown || wasd.up.isDown ||
          cursors.right.isDown || cursors.left.isDown ||
          cursors.down.isDown || cursors.up.isDown)
        && !(animRef ? animRef.isPlaying : false)
       ) {
      dogeSprite.play('idleDoge');
    } else if (!(animRef ? animRef.isPlaying : false)) {
      dogeSprite.play('runDoge');
    }

    if (fireButton.isDown) {
      fireBullet();
    }

    for (var i = 0; i < baddies.length; i++) {
      if (baddies[i].alive) {
        if (!(animRef ? animRef.isPlaying : false)) {
          game.physics.arcade.collide(dogeSprite, baddies[i].img,
            enemyHitPlayer(baddies[i]), null, this);
        }
        game.physics.arcade.collide(collisionLayer, baddies[i].img);
        game.physics.arcade.overlap(projectiles, baddies[i].img,
          bulletHitEnemy(baddies[i]), null, this);
        baddies[i].update();
      }
    }

    game.physics.arcade.collide(dogeSprite, collisionLayer);
    game.physics.arcade.collide(projectiles, collisionLayer,
      bulletHitWall, null, this);
    game.physics.arcade.collide(enemyProjectiles, collisionLayer,
      bulletHitWall, null, this);
    game.physics.arcade.collide(baddies, collisionLayer);
    if (!(animRef ? animRef.isPlaying : false)) {
      game.physics.arcade.collide(dogeSprite, enemyProjectiles,
        bulletHitPlayer, null, this);
    }
  },

  render: function() {
    game.debug.text('Your Health: ' + playerHealth, 32, 32);
    game.debug.text('Score: ' + score, 32, 48);

  }
};

function fireBullet() {
  if (game.time.now > bulletTime) {
    bullet = projectiles.getFirstExists(false);
    if (bullet) {
      bullet.reset(dogeSprite.x, dogeSprite.y - 45);
      bullet.rotation = game.physics.arcade.moveToPointer(
        bullet, 400, game.input.activePointer
      ) + Math.PI / 2;
      bulletTime = game.time.now + 75;
    }
  }
}

function enemyBullet(enemyX, enemyY) {
  bullet = enemyProjectiles.getFirstExists(false);
  if (bullet) {
    bullet.reset(enemyX, enemyY);
    bullet.rotation = game.physics.arcade.moveToObject(
      bullet, dogeSprite, 300
    ) + Math.PI / 2;
  }
}

function enemyHitPlayer(enemy) {
  return function(enemySprite) {
    dogeGotHurt();
    enemy.alive = false;
    enemySprite.kill();
  };
}

function bulletHitEnemy(enemy) {
  return function(enemySprite, bullet) {
    bullet.kill();
    enemy.damage();
    scoreMultiplier += 1;
    score += 10 * scoreMultiplier;
  };
}

function bulletHitWall(bullet) {
  bullet.kill();
}

function bulletHitPlayer(bullet) {
  bullet.kill();
  dogeGotHurt();
}

function dogeGotHurt() {
  animRef = dogeSprite.play('hurtDoge');
  playerHealth -= 1;
  scoreMultiplier = 0;
  if (playerHealth <= 0) {
    dogeSprite.kill();
  }
}

game.state.add('GameState', GameState);
game.state.start('GameState');
