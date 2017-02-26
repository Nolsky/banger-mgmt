'use strict';

var _ = require('lodash'),
    config = require('config').pubnub,
    PubNub = require('pubnub');

// API as per: https://www.pubnub.com/docs/javascript/api-reference-sdk-v4

var pubnub = new PubNub(_.pick(config, 'publishKey','subscribeKey'));

_.extend(exports, _.pick(
  pubnub, 'getUUID', 'setUUID', 'hereNow', 'addListener', 'unsubscribeAll'));

var listeners = [];
function addListener(l) {
  listeners.push(l);
  pubnub.addListener(l);
}

exports.clearListeners = function clearListeners() {
  _.each(listeners, pubnub.removeListener);
};

exports.onMessage = function onMessage(fn) {
  addListener({message: fn});
};

exports.onPresence = function onPresence(fn) {
  addListener({presence: fn});
};


exports.subscribe = function subscribe(channels, opts) {
  console.log('Subscribing to ', channels);
  pubnub.subscribe(_.extend({
    channels: _.isArray(channels) ? channels : [channels]
  }, opts || {}));
};

exports.unsubscribe = function unsubscribe(channels) {
  pubnub.unsubscribe({
    channels: _.isArray(channels) ? channels : [channels]
  });
};

exports.publish = function publish(channel, message) {
  pubnub.publish({
    channel: channel,
    message: message
  }, function(status) {
    if (status.statusCode !== 200) {
      console.error('pub error ', channel, message, status);
    }
  });
};
