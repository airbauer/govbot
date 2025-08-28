const { EmbedBuilder } = require('discord.js');

module.exports = {
    /** @type {import('commandkit').CommandData}  */
    data: {
        name: '8ball',
        description: 'Stelle dem Magic 8-Ball eine Frage'
    },

    /**
     * @param {import('commandkit').SlashCommandProps} param0 
     */
    run: ({ interaction }) => {
        const answers = [
            'Das ist sicher! 🟢',
            'Es ist entschieden so! 🟢',
            'Ohne Zweifel! 🟢',
            'Ja, definitiv! 🟢',
            'Du kannst dich darauf verlassen! 🟢',
            'Wie ich es sehe, ja! 🟢',
            'Wahrscheinlich! 🟡',
            'Gute Aussichten! 🟡',
            'Ja! 🟡',
            'Anzeichen deuten auf ja! 🟡',
            'Antwort ist neblig, versuche es nochmal! 🟡',
            'Frag später nochmal! 🟡',
            'Sag es dir jetzt nicht! 🔴',
            'Konzentriere dich und frag nochmal! 🔴',
            'Verlasse dich nicht darauf! 🔴',
            'Meine Antwort ist nein! 🔴',
            'Meine Quellen sagen nein! 🔴',
            'Aussichten sind nicht so gut! 🔴',
            'Sehr zweifelhaft! 🔴'
        ];

        const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
        const color = randomAnswer.includes('🟢') ? '#4CAF50' : 
                     randomAnswer.includes('🟡') ? '#FF9800' : '#F44336';

        const embed = new EmbedBuilder()
            .setTitle('🎱 Magic 8-Ball')
            .setDescription(`**${randomAnswer}**`)
            .setColor(color)
            .addFields(
                { name: 'Gefragt von', value: interaction.user.toString(), inline: true },
                { name: 'Antwort', value: randomAnswer.split(' ')[0], inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Magic 8-Ball' });

        interaction.reply({ embeds: [embed] });
    },

    /** @type {import('commandkit').CommandOptions} */
    options: {
        // https://commandkit.js.org/typedef/CommandOptions
    }
};
