const { EmbedBuilder } = require('discord.js');

module.exports = {
    /** @type {import('commandkit').CommandData}  */
    data: {
        name: 'coinflip',
        description: 'Wirft eine Münze (Kopf oder Zahl)'
    },

    /**
     * @param {import('commandkit').SlashCommandProps} param0 
     */
    run: ({ interaction }) => {
        const result = Math.random() < 0.5 ? 'Kopf' : 'Zahl';
        const emoji = result === 'Kopf' ? '🪙' : '🪙';
        
        const embed = new EmbedBuilder()
            .setTitle('🪙 Münzwurf')
            .setDescription(`Die Münze dreht sich...`)
            .setColor('#FFD700')
            .addFields(
                { name: 'Ergebnis', value: `${emoji} **${result}**`, inline: true },
                { name: 'Geworfen von', value: interaction.user.toString(), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Münzwurf' });

        interaction.reply({ embeds: [embed] });
    },

    /** @type {import('commandkit').CommandOptions} */
    options: {
        // https://commandkit.js.org/typedef/CommandOptions
    }
};
