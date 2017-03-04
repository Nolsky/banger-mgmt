'use strict';

module.exports = {
  preload: function() {
    this.load.image('preloadBar', 'assets/imgs/loadingBar.png');
  },
  create: function() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.state.start('Preloader');
  },
  update: function() {}
};