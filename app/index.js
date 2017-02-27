'use strict';

window.PIXI = require('pixi.js');
window.p2 = require('p2');
window.Phaser = require('phaser');

var Game = require('game');
var gameState = require('game/state');

var game = Game();
game.state.add('GameState', gameState);
game.state.add('Boot', require('game/boot'));
game.state.add('Preloader', require('game/preloader'));
game.state.add('MainMenu', require('game/mainMenu'))
game.state.start('Boot');

