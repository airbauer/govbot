const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    /** @type {import('commandkit').CommandData}  */
    data: {
        name: 'rps',
        description: 'Spiele Schere, Stein, Papier gegen den Bot'
    },

    /**
     * @param {import('commandkit').SlashCommandProps} param0 
     */
    run: async ({ interaction }) => {
        const choices = ['Schere', 'Stein', 'Papier'];
        const emojis = {
            'Schere': '✂️',
            'Stein': '🪨',
            'Papier': '📄'
        };

        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('schere')
                    .setLabel('Schere')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('✂️'),
                new ButtonBuilder()
                    .setCustomId('stein')
                    .setLabel('Stein')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🪨'),
                new ButtonBuilder()
                    .setCustomId('papier')
                    .setLabel('Papier')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('📄')
            );

        const embed = new EmbedBuilder()
            .setTitle('✂️ Schere, Stein, Papier')
            .setDescription('Wähle deine Waffe!')
            .setColor('#4ECDC4')
            .setTimestamp()
            .setFooter({ text: 'RPS Spiel' });

        const response = await interaction.reply({
            embeds: [embed],
            components: [actionRow],
            fetchReply: true
        });

        // Collector für Button-Interaktionen
        const collector = response.createMessageComponentCollector({
            componentType: 'BUTTON',
            time: 30000 // 30 Sekunden
        });

        collector.on('collect', async (i) => {
            if (i.user.id !== interaction.user.id) {
                await i.reply({ content: 'Du kannst dieses Spiel nicht spielen!', ephemeral: true });
                return;
            }

            const playerChoice = i.customId.charAt(0).toUpperCase() + i.customId.slice(1);
            const botChoice = choices[Math.floor(Math.random() * choices.length)];

            let result;
            let color;
            let resultEmoji;

            // Gewinn-Logik
            if (playerChoice === botChoice) {
                result = 'Unentschieden! 🤝';
                color = '#FFA500';
                resultEmoji = '🤝';
            } else if (
                (playerChoice === 'Schere' && botChoice === 'Papier') ||
                (playerChoice === 'Stein' && botChoice === 'Schere') ||
                (playerChoice === 'Papier' && botChoice === 'Stein')
            ) {
                result = 'Du gewinnst! 🎉';
                color = '#4CAF50';
                resultEmoji = '🎉';
            } else {
                result = 'Der Bot gewinnt! 😈';
                color = '#F44336';
                resultEmoji = '😈';
            }

            const resultEmbed = new EmbedBuilder()
                .setTitle(`${resultEmoji} Spiel beendet!`)
                .setDescription(`**${result}**`)
                .setColor(color)
                .addFields(
                    { name: 'Deine Wahl', value: `${emojis[playerChoice]} **${playerChoice}**`, inline: true },
                    { name: 'Bot Wahl', value: `${emojis[botChoice]} **${botChoice}**`, inline: true },
                    { name: 'Ergebnis', value: result, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'RPS Spiel' });

            await i.update({
                embeds: [resultEmbed],
                components: []
            });
        });

        collector.on('end', async () => {
            if (!response.deleted) {
                const timeoutEmbed = new EmbedBuilder()
                    .setTitle('⏰ Zeit abgelaufen!')
                    .setDescription('Du warst zu langsam!')
                    .setColor('#FF0000')
                    .setTimestamp()
                    .setFooter({ text: 'RPS Spiel' });

                await response.edit({
                    embeds: [timeoutEmbed],
                    components: []
                });
            }
        });
    },

    /** @type {import('commandkit').CommandOptions} */
    options: {
        // https://commandkit.js.org/typedef/CommandOptions
    }
};
