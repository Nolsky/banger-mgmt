'use strict';

var $ = process.env;

module.exports = {
  pubnub: {
    publishKey: $.PUBNUB_PUBLISH
      || 'pub-c-2addf19c-5ab3-47b0-bd2e-3fd57e1eed5d',
    subscribeKey: $.PUBNUB_SUBSCRIBE
      || 'sub-c-49b316ee-fc55-11e6-99d2-0619f8945a4f'
  }
};
