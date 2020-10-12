const express = require('express');
const router = express.Router();
const config = require('../config');
const axios = require('axios');
const addDiscordRole = require('../helpers/addDiscordRole');


/* GET home page. */
router.get('/', function(req, res, next) {
  let sucs = req.session.sucs;
  let discord = req.session.discord;

  if(sucs && sucs.connected && discord && discord.connected){
      res.render('done', {
          discord_client_id: config.discord.client_id,
          discord_redirect_uri: config.url + config.discord.redirect_uri,
          sucs_client_id: config.sucs.client_id,
          sucs_redirect_uri: config.url + config.sucs.redirect_uri
      })
  } else if(sucs && sucs.connected) {
      res.render('connect-discord', {
          discord_client_id: config.discord.client_id,
          discord_redirect_uri: config.url + config.discord.redirect_uri,
          sucs_client_id: config.sucs.client_id,
          sucs_redirect_uri: config.url + config.sucs.redirect_uri
      })
  } else {
      res.render('connect-sucs', {
          discord_client_id: config.discord.client_id,
          discord_redirect_uri: config.url + config.discord.redirect_uri,
          sucs_client_id: config.sucs.client_id,
          sucs_redirect_uri: config.url + config.sucs.redirect_uri
      });
  }
});

module.exports = router;
