const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    /** @type {import('commandkit').CommandData}  */
    data: {
        name: 'trivia',
        description: 'Spiele ein Trivia-Quiz'
    },

    /**
     * @param {import('commandkit').SlashCommandProps} param0 
     */
    run: async ({ interaction }) => {
        const questions = [
            {
                question: 'Was ist die Hauptstadt von Deutschland?',
                options: ['Berlin', 'München', 'Hamburg', 'Köln'],
                correct: 0,
                category: 'Geographie'
            },
            {
                question: 'Welches Jahr war der Zweite Weltkrieg zu Ende?',
                options: ['1943', '1944', '1945', '1946'],
                correct: 2,
                category: 'Geschichte'
            },
            {
                question: 'Was ist 2 + 2?',
                options: ['3', '4', '5', '6'],
                correct: 1,
                category: 'Mathematik'
            },
            {
                question: 'Welcher Planet ist der größte in unserem Sonnensystem?',
                options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
                correct: 2,
                category: 'Wissenschaft'
            },
            {
                question: 'Wer hat "Romeo und Julia" geschrieben?',
                options: ['Goethe', 'Shakespeare', 'Schiller', 'Homer'],
                correct: 1,
                category: 'Literatur'
            }
        ];

        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        
        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('0')
                    .setLabel(`A: ${randomQuestion.options[0]}`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('1')
                    .setLabel(`B: ${randomQuestion.options[1]}`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('2')
                    .setLabel(`C: ${randomQuestion.options[2]}`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('3')
                    .setLabel(`D: ${randomQuestion.options[3]}`)
                    .setStyle(ButtonStyle.Primary)
            );

        const embed = new EmbedBuilder()
            .setTitle('🧠 Trivia-Quiz')
            .setDescription(`**Kategorie:** ${randomQuestion.category}\n\n**Frage:** ${randomQuestion.question}`)
            .setColor('#9C27B0')
            .addFields(
                { name: 'Optionen', value: 'Wähle eine Antwort aus den Buttons unten!', inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'Trivia-Quiz' });

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
                await i.reply({ content: 'Du kannst dieses Quiz nicht spielen!', ephemeral: true });
                return;
            }

            const selectedAnswer = parseInt(i.customId);
            const isCorrect = selectedAnswer === randomQuestion.correct;

            let resultEmbed;
            if (isCorrect) {
                resultEmbed = new EmbedBuilder()
                    .setTitle('✅ Richtig!')
                    .setDescription('Glückwunsch! Du hast die richtige Antwort!')
                    .setColor('#4CAF50')
                    .addFields(
                        { name: 'Deine Antwort', value: randomQuestion.options[selectedAnswer], inline: true },
                        { name: 'Richtige Antwort', value: randomQuestion.options[randomQuestion.correct], inline: true },
                        { name: 'Kategorie', value: randomQuestion.category, inline: true }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Trivia-Quiz' });
            } else {
                resultEmbed = new EmbedBuilder()
                    .setTitle('❌ Falsch!')
                    .setDescription('Das war leider nicht richtig!')
                    .setColor('#F44336')
                    .addFields(
                        { name: 'Deine Antwort', value: randomQuestion.options[selectedAnswer], inline: true },
                        { name: 'Richtige Antwort', value: randomQuestion.options[randomQuestion.correct], inline: true },
                        { name: 'Kategorie', value: randomQuestion.category, inline: true }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Trivia-Quiz' });
            }

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
                    .addFields(
                        { name: 'Richtige Antwort', value: randomQuestion.options[randomQuestion.correct], inline: true },
                        { name: 'Kategorie', value: randomQuestion.category, inline: true }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Trivia-Quiz' });

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
