"use strict";
/* eslint-disable global-require */
const nodecg_1 = require("./util/nodecg");
module.exports = (nodecg) => {
    nodecg_1.set(nodecg);
    require('./tracker');
};
