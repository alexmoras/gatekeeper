require('dotenv').config();
module.exports = {
    url: "http://localhost:3000",
    session: process.env.SESSION_KEY,
    api_timeout: 100,
    sucs: {
        client_id: process.env.SUCS_CLIENT_ID,
        client_secret: process.env.SUCS_CLIENT_SECRET,
        redirect_uri: "/sucs/callback"
    },
    discord: {
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        bot_secret: process.env.DISCORD_BOT_SECRET,
        guild_id: "614045047540678656",
        redirect_uri: "/discord/callback"
    },
    groups: {
        sucs: "765229518008352778",
        staff: "614045202478530562",
        exec: "discord_role_id_here"
    }
}