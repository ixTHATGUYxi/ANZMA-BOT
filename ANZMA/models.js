`use strict`
const config      = require('./config');
const logger      = require('./logger');
const utils       = require('./utils');
const Bluebird    = require('bluebird');
const mysql       = require('mysql');

var rmconnection = mysql.createPool({
    connectionLimit : config.sql.connections,
    host            : config.sql.rmhost,
    user            : config.sql.rmuser,
    password        : config.sql.rmpass,
    database        : config.sql.rmdb
  });

var dcconnection = mysql.createPool({
    connectionLimit : config.sql.connections,
    host            : config.sql.discordhost,
    user            : config.sql.discorduser,
    password        : config.sql.discordpass,
    database        : config.sql.discorddb
  });
  
var rmdb = Bluebird.promisifyAll(rmconnection);
var dcdb = Bluebird.promisifyAll(dcconnection);

module.exports = {

    addXP:  async function(message, staticxp){
        let points = 0;
        if(staticxp){
            points = staticxp;
        } else {
            points = message.content.length;
        }
        
        dcdb.queryAsync('INSERT INTO discordchat SET ?', {userid: message.author.id, xp: points});
    },

    getTop: async function(message){
        let top = "```\nTop XP:\n";
        let results = await dcdb.queryAsync('SELECT userid, sum(xp) AS totalxp FROM discordchat WHERE time > DATE_SUB(NOW(), INTERVAL 7 DAY) GROUP BY userid ORDER BY totalxp DESC LIMIT 10');
        for(let row in results){
            let nick
            nick = message.guild.member(results[row].userid).displayName;
            if(nick == null){continue;}
            let spaces = " ";
            for(let i = nick.length; i < 30; i++){
                spaces += " ";
            }
            top += nick + spaces + "-	" + results[row].totalxp + "\n";
        }

        return top + "```";
    },

    getLGAs: async function(){
        let results = await rmdb.queryAsync('SELECT lga, shortname, role FROM geowebhooks');
        let lgas = {};
        for(let row in results){
            if(results[row].shortname != null){
                lgas[results[row].shortname.toLowerCase()] = {lga: results[row].lga, roleid: results[row].role.toString()};
            }
        }
        return lgas
    },

    getEnabledEncounters: async function(){
        let results = await rmdb.queryAsync('SELECT pokemon_id, @total := (SELECT COUNT(*) FROM pokemon WHERE pokemon_id = encwhitelist.pokemon_id) AS total, ((@total / (SELECT COUNT(*) FROM pokemon)) * 100) as totalper FROM encwhitelist WHERE enabled = 1');
        let enclist = {};
        for(let row in results){
            enclist[await utils.getPokemonName(results[row].pokemon_id)] = {'total': results[row].total, 'percent': await utils.fourdec(results[row].totalper) + '%' };
            //enclist.push(await utils.getPokemonName(results[row].pokemon_id));
        }
        return enclist;
    },

    enableEncounter: async function(dexid){
        rmdb.queryAsync('INSERT INTO encwhitelist (pokemon_id, enabled) VALUES (' + dexid + ', 1) ON DUPLICATE KEY UPDATE enabled=1')
    },
    
    disableEncounter: async function(dexid){
        rmdb.queryAsync('INSERT INTO encwhitelist (pokemon_id, enabled) VALUES (' + dexid + ', 0) ON DUPLICATE KEY UPDATE enabled=0')
    }
}
