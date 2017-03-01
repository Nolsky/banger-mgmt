'use strict';

module.exports = {
  preload: function() {

  },
  create: function() {
    var background = this.add.tilemap('arena');
    background.addTilesetImage('scifitiles-sheet', 'tiles');
    background.createLayer('Base');

    this.add.sprite(380, 320, 'menuBanger');
    this.add.sprite(285, 400, 'menuManagement');
    this.add.button(420, 500, 'menuPlay', this.startGame, this, 1, 0, 2);
    this.add.button(420, 550, 'menuPractice', this.startPractice, this, 1, 0, 2);
    this.add.sprite(420, 600, 'menuJoin');
    this.add.sprite(420, 650, 'menuAbout');


  },
  update: function() {},
  startGame: function() {
    this.state.start('GameState');
  },
  startPractice: function() {
    this.state.start('GameState');
  }
};


