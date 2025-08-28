const { EmbedBuilder } = require('discord.js');

module.exports = {
    /** @type {import('commandkit').CommandData}  */
    data: {
        name: 'help',
        description: 'Zeigt alle verfügbaren Commands an'
    },

    /**
     * @param {import('commandkit').SlashCommandProps} param0 
     */
    run: ({ interaction }) => {
        const embed = new EmbedBuilder()
            .setTitle('🤖 Discord Bot Hilfe')
            .setDescription('Hier findest du alle verfügbaren Commands für diesen Bot!')
            .setColor('#5865F2')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setTimestamp()
            .setFooter({ 
                text: 'Made by AIRbauer', 
                iconURL: 'https://cdn.pfps.gg/pfps/46237-squidward.gif' // Hier dein Avatar oder ein Standard-Emoji
            });

        // General Commands
        embed.addFields(
            { 
                name: '📝 **Embed-Ersteller**', 
                value: '`/embed` - Erstelle interaktive Embeds mit Buttons und Dropdown-Menüs', 
                inline: false 
            },
            { 
                name: '🎮 **Spiele**', 
                value: '`/coinflip` - Wirft eine Münze (Kopf oder Zahl)\n' +
                       '`/dice` - Wirft einen 6-seitigen Würfel\n' +
                       '`/rps` - Schere, Stein, Papier gegen den Bot\n' +
                       '`/8ball` - Stelle dem Magic 8-Ball eine Frage\n' +
                       '`/trivia` - Spiele ein Trivia-Quiz\n' +
                       '`/guess` - Rate eine Zahl zwischen 1 und 100', 
                inline: false 
            },
            { 
                name: '🔧 **Allgemein**', 
                value: '`/ping` - Zeigt die Bot-Latenz an\n' +
                       '`/help` - Zeigt diese Hilfe an', 
                inline: false 
            }
        );

        // Features Übersicht
        embed.addFields(
            { 
                name: '✨ **Bot Features**', 
                value: '• **Interaktive Embeds** mit vollständiger Bearbeitung\n' +
                       '• **6 verschiedene Spiele** für Unterhaltung\n' +
                       '• **Moderne Discord.js v14** Technologie\n' +
                       '• **CommandKit Integration** für einfache Verwaltung\n' +
                       '• **Deutsche Lokalisierung** für bessere Benutzerfreundlichkeit\n' +
                       '• **Responsive Design** mit schönen Embeds', 
                inline: false 
            }
        );

        // Verwendung
        embed.addFields(
            { 
                name: '📖 **Verwendung**', 
                value: 'Verwende `/` um alle verfügbaren Commands zu sehen.\n' +
                       'Alle Commands sind Slash-Commands und benötigen keine zusätzlichen Parameter.', 
                inline: false 
            }
        );

        // Support & Links
        embed.addFields(
            { 
                name: '🔗 **Links & Support**', 
                value: '• **GitHub:** [Repository](https://github.com/airbauer/gov)\n' +
                       '• **Discord:** [Server](https://discord.gg/VbcD8FrVKN)\n' +
                       '• **Website:** [Portfolio](https://vik.lol)', 
                inline: false 
            }
        );

        interaction.reply({ embeds: [embed] });
    },

    /** @type {import('commandkit').CommandOptions} */
    options: {
        // https://commandkit.js.org/typedef/CommandOptions
    }
};
