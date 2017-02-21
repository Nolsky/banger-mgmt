'use strict';

require('./index');

function rerun() {
  if (window.game) window.game.destroy();
  require('./index');
}
if (module.hot) module.hot.accept('./index', rerun);
