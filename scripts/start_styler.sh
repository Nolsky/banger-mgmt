#!/bin/bash

export NODE_PATH=./lib:./app:./app/src:$NODE_PATH

nodemon --ignore '!*styles.js' app/styler.js