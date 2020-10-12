const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config');

/* SUCS oauth callback - makes request to get the user's OpenID profile and groups */
router.get('/callback', (req, res, next) => {
    axios({
        method: "post",
        url: "https://projects.sucs.org/oauth/token",
        data: {
            client_id: config.sucs.client_id,
            client_secret: config.sucs.client_secret,
            code: req.query.code,
            grant_type: "authorization_code",
            redirect_uri: config.url + config.sucs.redirect_uri
        }
    })
        .then(msg => {
            return axios({
                method: "post",
                url: "https://projects.sucs.org/oauth/userinfo",
                headers: {
                    Authorization: "Bearer " + msg.data.access_token
                }
            });
        })
        .then(msg => {
            let session = req.session;
            session.sucs = {};
            session.sucs.connected = true;
            session.sucs.email = msg.data.email;
            session.sucs.groups = msg.data.groups;
            session.sucs.nickname = msg.data.nickname;
            session.sucs.avatar = msg.data.picture;
            session.discord = {};
            session.discord.roles = [];
            session.sucs.groups.forEach(group => {
                if(config.groups[group]){
                    session.discord.roles.push(config.groups[group]);
                }
            })
            res.redirect('/');
        })
        .catch(err => {
            res.send(err);
        })
});

module.exports = router;