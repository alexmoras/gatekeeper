const axios = require('axios');
const config = require('../config');

let add = (user, groups) => {
    let workingGroups = [...groups];
    return axios({
        method: "put",
        url: "https://discord.com/api/guilds/" + config.discord.guild_id +
            "/members/" + user + "/roles/" + config.groups[workingGroups[0]],
        headers: {
            Authorization: "Bot " + config.discord.bot_secret
        }
    })
        .then(() => {
            workingGroups.shift();
            if(workingGroups.length > 0){
                setTimeout(() => {
                    return add(user, workingGroups);
                }, config.api_timeout)
            }
        })
}

module.exports = add;