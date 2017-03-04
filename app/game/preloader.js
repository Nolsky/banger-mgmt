'use strict';

module.exports = {
  preload: function() {
    this.stage.backgroundColor = '#222222';
    this.preloadBar = this.add.sprite(300, 300, 'preloadBar');
    this.load.setPreloadSprite(this.preloadBar);

    this.load.atlas(
      'doge',
      'assets/imgs/doge/dogeAtlas.png',
      'assets/imgs/doge/dogeAtlas.json'
    );
    this.load.atlas(
      'bullets',
      'assets/imgs/bullets.png',
      'assets/imgs/bullets.json'
    );

    this.load.tilemap(
      'arena',
      'assets/tilesets/arena.json',
      null,
      Phaser.Tilemap.TILED_JSON
    );

    // joystick
    this.load.image('blue_circle', 'assets/imgs/blue_circle.png');
    // this.load.image('blue_dot', 'assets/imgs/blue_dot.png');
    this.load.image('circle', 'assets/imgs/circle.png');
    
    this.load.image('menuBanger', 'assets/imgs/mainMenu/banger.png');
    this.load.image('menuManagement', 'assets/imgs/mainMenu/management.png');
    this.load.image('menuPlay', 'assets/imgs/mainMenu/menuPlayButton.png');
    this.load.image('menuPractice', 'assets/imgs/mainMenu/menuPracticeButton.png');
    this.load.image('menuJoin', 'assets/imgs/mainMenu/menuJoinButton.png');
    this.load.image('menuAbout', 'assets/imgs/mainMenu/menuAboutButton.png');

    this.load.image('tiles', 'assets/tilesets/scifitiles-sheet.png');

  },
  create: function() {
    this.state.start('MainMenu');
  },
  update: function() {}
};
