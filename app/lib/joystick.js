'use strict';

var MAX_DISTANCE = 100;

module.exports = function addJoystick(game, x, y) {
  var active = false;

  // Parent Sprite
  var joystick = game.add.sprite(0, 0, 'blue_circle');
  joystick.anchor.setTo(0.5, 0.5);
  joystick.fixedToCamera = true;
  joystick.cameraOffset.setTo(x, y);
  
  // Presentation
  var cover = game.add.sprite(0, 0, 'circle');
  cover.anchor.setTo(0.5, 0.5);
  joystick.addChild(cover);

  // Input
  var stick = game.add.sprite(0, 0, null);
  stick.anchor.setTo(0.5, 0.5);
  stick.width = MAX_DISTANCE * 2;
  stick.height = MAX_DISTANCE * 2;
  stick.inputEnabled = true;
  stick.input.enableDrag(true);
  stick.events.onDragStart.add(function() {
    active = true;
  }, joystick);
  stick.events.onDragStop.add(function() {
    active = false;
    stick.position.setTo(0, 0);
    cover.position.setTo(0, 0);
  }, joystick);
  joystick.addChild(stick);
  
  joystick.update = function(){
    if (active) {
      cover.position.copyFrom(stick.position);
      if (stick.position.getMagnitude() > MAX_DISTANCE) {
        cover.position.setMagnitude(MAX_DISTANCE);
      }
    }
  };

  var ref = new Phaser.Point(0, 0);
  joystick.getStatus = function() {
    var p = Phaser.Point.normalize(stick.position, ref);
    return {
      isDown: active,
      x: p.x,
      y: p.y
      // angle: ref.angle(p),
      // m: Math.min(p.getMagnitude, 90) / 90
    };
  };

  return joystick;
};
