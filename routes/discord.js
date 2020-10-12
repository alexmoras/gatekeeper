const express = require('express');
const router = express.Router();
const qs = require('query-string');
const axios = require('axios');
const config = require('../config');

/* Discord oauth callback - makes request to get the user's Discord account */
router.get('/callback', (req, res, next) => {
    let accessToken = null;
    let discordUser = null;
    axios({
        method: "post",
        url: "https://discord.com/api/oauth2/token",
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        data: qs.stringify({
            client_id: config.discord.client_id,
            client_secret: config.discord.client_secret,
            code: req.query.code,
            grant_type: "authorization_code",
            redirect_uri: config.url + config.discord.redirect_uri,
            scope: "identify guilds.join"
        })
    })
        .then(msg => {
            accessToken = msg.data.access_token;
            return axios({
                method: "get",
                url: "https://discord.com/api/users/@me",
                headers: {
                    "Authorization": "Bearer " + accessToken
                }
            })
        })
        .then(msg => {
            discordUser = msg.data.id;
            req.session.discord.username = msg.data.username;
            req.session.discord.discriminator = msg.data.discord;
            req.session.discord.avatar = msg.data.avatar;
            return axios({
                method: "put",
                url: "https://discord.com/api/guilds/" + config.discord.guild_id +
                    "/members/" + discordUser,
                headers: {
                    "Authorization": "Bot " + config.discord.bot_secret,
                    "content-type": "application/json"
                },
                data: JSON.stringify({
                    "access_token": accessToken
                })
            })
        })
        .then(() => {
            return axios({
                method: "PATCH",
                url: "https://discord.com/api/guilds/" + config.discord.guild_id +
                    "/members/" + discordUser,
                headers: {
                    "Authorization": "Bot " + config.discord.bot_secret,
                    "Content-Type": "application/json"
                },
                data: {
                    "roles": req.session.discord.roles
                }
            })
        })
        .then(response => {
            req.session.discord.connected = true;
            res.redirect('/');
        })
        .catch(err => {
            res.send(err);
        })
});

module.exports = router;