const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    /** @type {import('commandkit').CommandData}  */
    data: {
        name: 'dice',
        description: 'Wirft 1-6 Würfel'
    },

    /**
     * @param {import('commandkit').SlashCommandProps} param0 
     */
    run: ({ interaction }) => {
        const diceCount = 1; // Standard: 1 Würfel
        
        const results = [];
        let total = 0;
        
        for (let i = 0; i < diceCount; i++) {
            const roll = Math.floor(Math.random() * 6) + 1;
            results.push(roll);
            total += roll;
        }
        
        const embed = new EmbedBuilder()
            .setTitle('🎲 Würfelwurf')
            .setDescription(`Du hast **${diceCount} Würfel** geworfen!`)
            .setColor('#FF6B6B')
            .addFields(
                { name: 'Würfel', value: results.map(r => `🎲 **${r}**`).join(' '), inline: true },
                { name: 'Gesamt', value: `**${total}**`, inline: true },
                { name: 'Geworfen von', value: interaction.user.toString(), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Würfelspiel' });

        interaction.reply({ embeds: [embed] });
    },

    /** @type {import('commandkit').CommandOptions} */
    options: {
        // https://commandkit.js.org/typedef/CommandOptions
    }
};
