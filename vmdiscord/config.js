'use strict';
const fs     = require('fs');
const yaml   = require('js-yaml');
const logger = require('./logger');
let config = {};

if(fs.existsSync(__dirname + '/../config.yaml')){
    config = yaml.safeLoad(fs.readFileSync(__dirname + '/../config.yaml', 'utf8'));
} else {
    logger.info('Config file missing.');
    process.exit();
}

module.exports = config;