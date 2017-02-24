'use strict';

module.exports = function Game() {
  var game = new Phaser.Game(800, 800, Phaser.AUTO);
  window.game = game;

  return game;
}
