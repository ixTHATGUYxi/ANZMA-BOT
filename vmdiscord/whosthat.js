`use strict`
const config      = require('./config');
const logger      = require('./logger');
const utils       = require('./utils');
const models      = require('./models');
const Discord     = require('discord.js');

const timeout = ms => new Promise(res => setTimeout(res, ms))

const diffdex = [151, 251, 386, 493];
let LastPokemonID = 0;
let LastPokemonMessageID = 0;
let difficulty = config.discord.difficulty;
let curhint = '';
let hintlen = 0;


module.exports = {
    handler: async function(message){
        let command = message.content.substring(1);
        switch(command){
            case 'who':
                repeatthat(message);
                return;
            case 'help':
                help(message);
                return;
            case 'hint':
                hint(message);
                return;
        }
        if(command.startsWith('gen')){
            gen(message);
            return;
        }
        guessthat(message);
    },
    start: async function(client){
        whosthat(client);
    }
}

async function help(message){
    let helpmessage = `
    To guess a pokemon, type the name after a question mark, for example '?Mewtwo'

    Other commands:
    ?help - Show this message
    ?who  - Repeat the last Who's That Pokemon
    ?hint - Shows a masked version of the Pokemon's name. Use multiple times to show more letters
    ?gen <number> - Changes the difficulty level to limit to generations. Currently supports gen 1-4. Lower difficulties give less XP per answer.

    Gen is currently set to ${difficulty}
    `

    message.channel.send(helpmessage);
}

async function hint(message){
    let pokename = await utils.getPokemonName(LastPokemonID);
    if(hintlen > (pokename.length - 4) || curhint === pokename){
        message.channel.send(`Too many hints given. Current hint: \`${curhint}\``);
        return;
    }
    for(let i = 0; i < 2;){
        let rand = Math.floor(Math.random() * pokename.length + 1);
        if(curhint.charAt(rand) === pokename.charAt(rand)) continue;
        let conv = '';
        for(let c = 0; c < curhint.length; c++){
            if(c === rand){
                conv += pokename.charAt(c);
            } else {
                conv += curhint.charAt(c);
            }
        }
        hintlen += 1;
        curhint = conv;
        i++
    }
    message.channel.send(`Hint: \`${curhint}\``);
}

async function gen(message){
    let gennum = message.content.substring(5, 6);
    console.log(gennum);
    if(isNaN(gennum) || gennum > 4 || gennum < 1) return;
    if(gennum == difficulty){
        message.channel.send(`The max generation is already set to ${gennum}`);
        return;
    }
    difficulty = gennum;
    message.channel.send(`Max generation has changed to ${gennum}`);
    LastPokemonID = 0;
    whosthat(message.client);
}

async function repeatthat(message){
    message.channel.messages.get(LastPokemonMessageID).delete();
    let gameschan = config.discord.whosthat;
    let pokeid = LastPokemonID;
    let pokeurl = "https://bitbucket.org/anzmap/sprites/raw/6025d50492199d4fd2bf07a606ac5c588fc923db/" + pokeid + ".png";
    let embed = new Discord.RichEmbed()
        .setImage(pokeurl)
        .setTitle("Who's that pokemon?!")
        .setDescription("Answer by typing a question mark plus the pokemon name, for example `?Mewtwo`");
    let mess = await message.client.channels.get(gameschan).send({embed});
    LastPokemonMessageID = mess.id;
}

async function guessthat(message){
    if(LastPokemonID === 0) return;

    let lastID = LastPokemonID;
    let guess = message.content.substring(1);
    let answer = await utils.getPokemonName(lastID);

    if(answer.toLowerCase() === guess.toLowerCase()){
        let xpgain = 70 + (difficulty * 30);
        LastPokemonID = 0;
        message.reply(`${answer} was correct! You have gained ${xpgain} xp!`);
        let pokeurl = "https://bitbucket.org/anzmap/sprites/raw/6025d50492199d4fd2bf07a606ac5c588fc923db/shown/" + lastID + ".png";
        let embed = new Discord.RichEmbed()
            .setImage(pokeurl)
            .setTitle(`It was ${answer}!`)
            .setDescription(`Congratulations ${message.author}`);
        message.channel.messages.get(LastPokemonMessageID).edit({embed});
        models.addXP(message, xpgain);
        whosthat(message.client);
    }
}

async function whosthat(client){
    await timeout(1000);
    let gameschan = config.discord.whosthat;
    let pokeid = LastPokemonID;
    let highestid = diffdex[difficulty - 1];

    while(pokeid === 0){
        pokeid = Math.floor(Math.random() * highestid) + 1;
        pokename = await utils.getPokemonName(pokeid)
        curhint = '_'.repeat(pokename.length);
        hintlen = 0;
    }
    logger.info(curhint);
    let pokeurl = "https://bitbucket.org/anzmap/sprites/raw/6025d50492199d4fd2bf07a606ac5c588fc923db/" + pokeid + ".png";

    let embed = new Discord.RichEmbed()
        .setImage(pokeurl)
        .setTitle("Who's that pokemon?!")
        .setDescription("Answer by typing a question mark plus the pokemon name, for example `?Mewtwo`");
    let mess = await client.channels.get(gameschan).send({embed});
    LastPokemonMessageID = mess.id;
    LastPokemonID = pokeid;
    logger.info(`Answer to current game: #${pokeid} ${await utils.getPokemonName(pokeid)}`)
}