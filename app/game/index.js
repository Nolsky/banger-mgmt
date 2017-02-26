'use strict';

module.exports = function Game() {
  var game = new Phaser.Game(1057, 1057, Phaser.AUTO);
  window.game = game;

  return game;
};
