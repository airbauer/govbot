const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    /** @type {import('commandkit').CommandData}  */
    data: {
        name: 'guess',
        description: 'Rate eine Zahl zwischen 1 und 100'
    },

    /**
     * @param {import('commandkit').SlashCommandProps} param0 
     */
    run: async ({ interaction }) => {
        const targetNumber = Math.floor(Math.random() * 100) + 1;
        let attempts = 0;
        let gameActive = true;

        const embed = new EmbedBuilder()
            .setTitle('🎯 Zahlenraten')
            .setDescription('Ich habe eine Zahl zwischen **1** und **100** gewählt!\n\nRate die Zahl mit den Buttons unten!')
            .setColor('#2196F3')
            .addFields(
                { name: 'Versuche', value: '0', inline: true },
                { name: 'Hinweis', value: 'Die Zahl liegt zwischen 1-100', inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Zahlenraten' });

        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('higher')
                    .setLabel('Höher')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('⬆️'),
                new ButtonBuilder()
                    .setCustomId('lower')
                    .setLabel('Niedriger')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('⬇️'),
                new ButtonBuilder()
                    .setCustomId('correct')
                    .setLabel('Das ist es!')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🎯')
            );

        const response = await interaction.reply({
            embeds: [embed],
            components: [actionRow],
            fetchReply: true
        });

        // Collector für Button-Interaktionen
        const collector = response.createMessageComponentCollector({
            componentType: 'BUTTON',
            time: 120000 // 2 Minuten
        });

        collector.on('collect', async (i) => {
            if (i.user.id !== interaction.user.id) {
                await i.reply({ content: 'Du kannst dieses Spiel nicht spielen!', ephemeral: true });
                return;
            }

            if (!gameActive) return;

            attempts++;

            if (i.customId === 'correct') {
                gameActive = false;
                const winEmbed = new EmbedBuilder()
                    .setTitle('🎉 Gewonnen!')
                    .setDescription(`Du hast die Zahl **${targetNumber}** in **${attempts}** Versuchen erraten!`)
                    .setColor('#4CAF50')
                    .addFields(
                        { name: 'Zahl', value: targetNumber.toString(), inline: true },
                        { name: 'Versuche', value: attempts.toString(), inline: true },
                        { name: 'Spieler', value: interaction.user.toString(), inline: true }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Zahlenraten' });

                await i.update({
                    embeds: [winEmbed],
                    components: []
                });
            } else {
                let hint;
                if (i.customId === 'higher') {
                    hint = `Die Zahl ist **höher** als deine Schätzung!`;
                } else {
                    hint = `Die Zahl ist **niedriger** als deine Schätzung!`;
                }

                const updateEmbed = new EmbedBuilder()
                    .setTitle('🎯 Zahlenraten')
                    .setDescription(`Ich habe eine Zahl zwischen **1** und **100** gewählt!\n\n${hint}`)
                    .setColor('#2196F3')
                    .addFields(
                        { name: 'Versuche', value: attempts.toString(), inline: true },
                        { name: 'Hinweis', value: hint, inline: true }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Zahlenraten' });

                await i.update({
                    embeds: [updateEmbed],
                    components: [actionRow]
                });
            }
        });

        collector.on('end', async () => {
            if (gameActive && !response.deleted) {
                const timeoutEmbed = new EmbedBuilder()
                    .setTitle('⏰ Zeit abgelaufen!')
                    .setDescription(`Das Spiel ist vorbei! Die Zahl war **${targetNumber}**`)
                    .setColor('#FF0000')
                    .addFields(
                        { name: 'Zahl', value: targetNumber.toString(), inline: true },
                        { name: 'Versuche', value: attempts.toString(), inline: true }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Zahlenraten' });

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
