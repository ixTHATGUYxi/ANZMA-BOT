'use strict';
const config = require('./config');

module.exports = {
    info: function(l){
        let date = new Date();
        let time = '[' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + ']';
        console.log(time + ' - [INFO]' + ' -- ' + l);
    },

    debug: function(l){
        if(!(config.logger.debug)){
            return;
        }
        let date = new Date();
        let time = '[' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + ']';
        console.log(time + ' - [DEBUG]' + ' -- ' + l);
    },

    error: function(l){
        let date = new Date();
        let time = '[' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + ']';
        console.log(time + ' - [ERROR]' + ' -- ' + l);
    }
}

function pad(num) {
    if(String(num).length === 1){
        return '0' + String(num);
    }

    return String(num);
}