`use strict`
const config      = require('./config');
const logger      = require('./logger');
const utils       = require('./utils');
const models      = require('./models');


module.exports = {
    handler: async function(message){
        let mesarr = await message.content.split(' ');
        mesarr.splice(0, 1);
        if(mesarr[0] == 'list'){
            printList(message);
        }
        if(mesarr[0] == 'remove'){
            let dexid;
            let pokename;
            mesarr.splice(0, 1);
            if(mesarr.length == 0){
                return;
            }
            pokemon = mesarr.join(' ');
            if(/^[0-9]+$/.test(pokemon)){
                dexid = parseInt(pokemon);
                pokename = await utils.getPokemonName(dexid);
            } else {
                dexid = await utils.getPokemonId(pokemon);
                if(dexid === undefined) return;
                pokename = pokemon;
            }
            message.channel.send(`Disabling #${dexid} - ${pokename} for IV scanning.`)
            models.disableEncounter(dexid);
        }
        if(mesarr[0] == 'add'){
            let dexid;
            let pokename;
            mesarr.splice(0, 1);
            if(mesarr.length == 0){
                return;
            }
            pokemon = mesarr.join(' ');
            if(/^[0-9]+$/.test(pokemon)){
                dexid = parseInt(pokemon);
                pokename = await utils.getPokemonName(dexid);
            } else {
                dexid = await utils.getPokemonId(pokemon);
                if(dexid === undefined) return;
                pokename = pokemon;
            }
            message.channel.send(`Enabling #${dexid} - ${pokename} for IV scanning.`);
            models.enableEncounter(dexid);
        }
    }
}

async function printList(message){
    let ivlist = await models.getEnabledEncounters();
    let r = 'Current list of encountered pokemon:\n```\n';
    for(mon in ivlist){
        r += mon + ' - ' + ivlist[mon].percent + '\n';
    }
    r += '```';
    message.channel.send(r);
}