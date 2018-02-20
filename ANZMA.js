`use strict`

const config   = require('./ANZMA/config');
const models   = require('./ANZMA/models');
const logger   = require('./ANZMA/logger');
const whosthat = require('./ANZMA/whosthat');
const utils    = require('./ANZMA/utils');
const iv       = require('./ANZMA/iv');
const Discord  = require('discord.js');
const roles    = require('./ANZMA/roles');
const client = new Discord.Client({fetchAllMembers: true});

client.on('ready', () => {
  logger.info('I am ready!');
  whosthat.start(client);
});

client.on('message', message => {
    let channel = message.channel;
    if(message.author.bot){ return; }

    if(message.content === "testt"){
        message.reply(message.author.username);
        message.reply(message.author.tag);
        message.reply(message.author.toString());
    }

    if((message.content.startsWith("!iv ")) && (config.discord.admins) && (config.discord.admins.indexOf(message.author.id) > -1)){
        iv.handler(message);
    }

    if(config.roles){
        if(message.content.startsWith('%')){
            roles.handler(message);
        }
    }

    if((message.content.startsWith('?')) && (channel.id === config.discord.whosthat)){
        whosthat.handler(message);
    }

    if(message.content.startsWith('!')){
        let msg = message.content.substring(1);
        switch(msg){
            case 'top':
                top(message);
                return;
            case 'rank':
                console.log('rank');
                break;
            case 'who':
                console.log('who');
                break;
            case 'nest':
                timeReply(message);
                break;
        }
    }

    models.addXP(message, false)
});

client.on('error', error => {
    logger.error(error);
});

async function timeReply(message){
    time = await utils.getNestTime();
    message.reply('Next nest rotation is in: ' + time);
}

async function top(message){
    let top = await models.getTop(message);
    message.channel.send(top);
}

client.login(config.discord.token);
