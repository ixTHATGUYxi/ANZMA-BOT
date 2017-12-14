`use strict`

const config   = require('./vmdiscord/config');
const models   = require('./vmdiscord/models');
const logger   = require('./vmdiscord/logger');
const whosthat = require('./vmdiscord/whosthat');
const utils    = require('./vmdiscord/utils');
const Discord  = require('discord.js');
const client = new Discord.Client({fetchAllMembers: true});


client.on('ready', () => {
  logger.info('I am ready!');
  whosthat.start(client);
  if(config.discord.roles === true){
    var roles    = require('./vmdiscord/roles');
  }
});

client.on('message', message => {
    let channel = message.channel;
    if(message.author.bot){ return; }

    if(message.content === "testt"){
        message.reply(message.author.username);
        message.reply(message.author.tag);
        message.reply(message.author.toString());

    }

    if(config.discord.roles === true){
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
