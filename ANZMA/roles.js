`use strict`
const config      = require('./config');
const logger      = require('./logger');
const utils       = require('./utils');
const models      = require('./models');


let lgas = {};
if(config.roles.sortlga === true){
    getLGAs();
}

module.exports = {
    handler: async function(message){
        let command = message.content.substring(1);
        if(config.roles.sortlga === true){
            if(command.toLowerCase() === 'list'){
                list(message);
                return;
            }
            if(command.toLowerCase() === 'all'){
                let role = message.guild.roles.find('name', 'All Regions');
                if(message.member != null && message.member.roles.find('name', 'All Regions')){
                    message.member.removeRole(role);
                    message.channel.send(`You have been removed from the group All Regions`)
                } else {
                    message.member.addRole(role);
                    message.channel.send(`You have been added to the group All Regions`)
                }
                return;
            }
            if(lgas.hasOwnProperty(command.toLowerCase())){
                setLocale(message);
                return;
            }
        }
        if(config.roles.teams === true){
            if(command.toLowerCase() === 'mystic' || 
            command.toLowerCase() === 'valor' || 
            command.toLowerCase() === 'instinct'){
                setTeam(message);
                return;
            }
        }
    }
}

async function list(message){
    let msg = 'type \`%all\` to join all channels\n';
    for(let k in lgas){
        msg += `type \`%${k}\` to join ${lgas[k].lga} channels\n`;
    }
    message.channel.send(msg);
}

async function setTeam(message){
    let team = message.content.substring(1);
    //check if player has any teams
    if((message.member != null) && (message.member.roles.find("name", "Mystic") || message.member.roles.find("name", "Valor") || message.member.roles.find("name", "Instinct"))){
        message.channel.send('You already have an assigned team!');
        return;
    }
    teamright = team[0].toUpperCase() + team.substring(1);
    message.member.addRole(message.guild.roles.find('name', teamright));
    message.channel.send(`You have been assigned to team ${teamright}`)
}

async function setLocale(message){
    let locale = message.content.substring(1).toLowerCase();
    let id = lgas[locale].roleid;
    let role = message.guild.roles.find('name', lgas[locale].lga);
    if(message.member != null && message.member.roles.find('name', lgas[locale].lga)){
        message.member.removeRole(role);
        message.channel.send(`You have been removed from the group ${lgas[locale].lga}`)
    } else {
        message.member.addRole(role);
        message.channel.send(`You have been added to the group ${lgas[locale].lga}`)
    }
}

async function getLGAs(){
    lgas = await models.getLGAs();
    console.log(lgas);
}
