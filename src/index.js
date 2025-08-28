require('dotenv/config');

const { Client, IntentsBitField } = require('discord.js');
const { CommandKit } = require('commandkit');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages
    ]
});

new CommandKit({
    client,
    commandsPath: `${__dirname}/commands`
});

client.login(process.env.TOKEN);