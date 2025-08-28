const { 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    StringSelectMenuBuilder,
    ButtonStyle,
    ComponentType,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');

module.exports = {
    /** @type {import('commandkit').CommandData}  */
    data: {
        name: 'embed',
        description: 'Erstellt einen interaktiven Embed-Ersteller'
    },

    /**
     * @param {import('commandkit').SlashCommandProps} param0 
     */
    run: async ({ interaction }) => {
        // Initiales Embed
        const embed = new EmbedBuilder()
            .setTitle('📝 Embed-Ersteller')
            .setDescription('Klicke auf die Buttons um dein Embed zu bearbeiten!')
            .setColor('#0099ff')
            .setTimestamp()
            .setFooter({ text: 'Embed-Ersteller' });

        // Buttons für verschiedene Aktionen
        const actionRow1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('edit_title')
                    .setLabel('Titel bearbeiten')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('📝'),
                new ButtonBuilder()
                    .setCustomId('edit_description')
                    .setLabel('Beschreibung bearbeiten')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('📄'),
                new ButtonBuilder()
                    .setCustomId('edit_color')
                    .setLabel('Farbe wählen')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🎨'),
                new ButtonBuilder()
                    .setCustomId('edit_thumbnail')
                    .setLabel('Thumbnail')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🖼️')
            );

        const actionRow2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('edit_image')
                    .setLabel('Bild hinzufügen')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🖼️'),
                new ButtonBuilder()
                    .setCustomId('edit_footer')
                    .setLabel('Footer bearbeiten')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📌'),
                new ButtonBuilder()
                    .setCustomId('add_field')
                    .setLabel('Feld hinzufügen')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('➕'),
                new ButtonBuilder()
                    .setCustomId('preview_embed')
                    .setLabel('Vorschau')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('👁️')
            );

        const actionRow3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('send_embed')
                    .setLabel('Embed senden')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('📤'),
                new ButtonBuilder()
                    .setCustomId('reset_embed')
                    .setLabel('Zurücksetzen')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('🔄')
            );

        // Dropdown für Farben
        const colorRow = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('color_select')
                    .setPlaceholder('Wähle eine Farbe')
                    .addOptions([
                        { label: 'Blau', value: '#0099ff', emoji: '🔵' },
                        { label: 'Rot', value: '#ff0000', emoji: '🔴' },
                        { label: 'Grün', value: '#00ff00', emoji: '🟢' },
                        { label: 'Gelb', value: '#ffff00', emoji: '🟡' },
                        { label: 'Lila', value: '#800080', emoji: '🟣' },
                        { label: 'Orange', value: '#ffa500', emoji: '🟠' },
                        { label: 'Weiß', value: '#ffffff', emoji: '⚪' },
                        { label: 'Schwarz', value: '#000000', emoji: '⚫' }
                    ])
            );

        // Speichere den aktuellen Embed-Status
        const embedData = {
            title: '',
            description: '',
            color: '#0099ff',
            thumbnail: '',
            image: '',
            footer: '',
            fields: []
        };

        const response = await interaction.reply({
            embeds: [embed],
            components: [actionRow1, actionRow2, actionRow3],
            fetchReply: true
        });

        // Einziger Collector für alle Interaktionen
        const collector = response.createMessageComponentCollector({
            time: 300000 // 5 Minuten
        });

        collector.on('collect', async (i) => {
            if (i.user.id !== interaction.user.id) {
                await i.reply({ content: 'Du kannst diesen Embed-Ersteller nicht verwenden!', ephemeral: true });
                return;
            }

            try {
                switch (i.customId) {
                    case 'edit_title':
                        await showTitleModal(i, embedData, embed, actionRow1, actionRow2, actionRow3);
                        break;
                    case 'edit_description':
                        await showDescriptionModal(i, embedData, embed, actionRow1, actionRow2, actionRow3);
                        break;
                    case 'edit_color':
                        await i.update({
                            embeds: [embed],
                            components: [actionRow1, actionRow2, actionRow3, colorRow]
                        });
                        break;
                    case 'edit_thumbnail':
                        await showThumbnailModal(i, embedData, embed, actionRow1, actionRow2, actionRow3);
                        break;
                    case 'edit_image':
                        await showImageModal(i, embedData, embed, actionRow1, actionRow2, actionRow3);
                        break;
                    case 'edit_footer':
                        await showFooterModal(i, embedData, embed, actionRow1, actionRow2, actionRow3);
                        break;
                    case 'add_field':
                        await showFieldModal(i, embedData, embed, actionRow1, actionRow2, actionRow3);
                        break;
                    case 'preview_embed':
                        await previewEmbed(i, embedData);
                        break;
                    case 'send_embed':
                        await sendEmbed(i, embedData);
                        break;
                    case 'reset_embed':
                        await resetEmbed(i, embedData, embed, actionRow1, actionRow2, actionRow3);
                        break;
                    case 'color_select':
                        if (i.isStringSelectMenu()) {
                            embedData.color = i.values[0];
                            updateEmbed(embed, embedData);
                            await i.update({
                                embeds: [embed],
                                components: [actionRow1, actionRow2, actionRow3]
                            });
                        }
                        break;
                }
            } catch (error) {
                console.error('Interaction error:', error);
                if (!i.replied) {
                    await i.reply({ content: '❌ Ein Fehler ist aufgetreten!', ephemeral: true });
                }
            }
        });
    },

    /** @type {import('commandkit').CommandOptions} */
    options: {
        // https://commandkit.js.org/typedef/CommandOptions
    }
};

// Hilfsfunktionen
async function showTitleModal(interaction, embedData, embed, actionRow1, actionRow2, actionRow3) {
    const modal = new ModalBuilder()
        .setCustomId('title_modal')
        .setTitle('Titel bearbeiten');

    const titleInput = new TextInputBuilder()
        .setCustomId('title_input')
        .setLabel('Neuer Titel')
        .setStyle(TextInputStyle.Short)
        .setValue(embedData.title || '')
        .setRequired(false)
        .setMaxLength(256)
        .setPlaceholder('Gib den Titel ein...');

    const firstActionRow = new ActionRowBuilder().addComponents(titleInput);
    modal.addComponents(firstActionRow);

    try {
        await interaction.showModal(modal);
        
        // Warte auf Modal-Submission
        const submission = await interaction.awaitModalSubmit({
            time: 60000,
            filter: i => i.customId === 'title_modal' && i.user.id === interaction.user.id
        });

        const titleValue = submission.fields.getTextInputValue('title_input');
        embedData.title = titleValue;
        updateEmbed(embed, embedData);
        
        await submission.reply({ 
            content: `✅ Titel wurde zu "${titleValue}" geändert!`, 
            ephemeral: true 
        });
        
        await interaction.update({
            embeds: [embed],
            components: [actionRow1, actionRow2, actionRow3]
        });
    } catch (error) {
        console.error('Modal error:', error);
        if (!interaction.replied) {
            await interaction.reply({ content: '❌ Fehler beim Öffnen des Modals!', ephemeral: true });
        }
    }
}

async function showDescriptionModal(interaction, embedData, embed, actionRow1, actionRow2, actionRow3) {
    const modal = new ModalBuilder()
        .setCustomId('description_modal')
        .setTitle('Beschreibung bearbeiten');

    const descriptionInput = new TextInputBuilder()
        .setCustomId('description_input')
        .setLabel('Neue Beschreibung')
        .setStyle(TextInputStyle.Paragraph)
        .setValue(embedData.description || '')
        .setRequired(false)
        .setMaxLength(4000)
        .setPlaceholder('Gib die Beschreibung ein...');

    const firstActionRow = new ActionRowBuilder().addComponents(descriptionInput);
    modal.addComponents(firstActionRow);

    try {
        await interaction.showModal(modal);
        
        const submission = await interaction.awaitModalSubmit({
            time: 60000,
            filter: i => i.customId === 'description_modal' && i.user.id === interaction.user.id
        });

        const descriptionValue = submission.fields.getTextInputValue('description_input');
        embedData.description = descriptionValue;
        updateEmbed(embed, embedData);
        
        await submission.reply({ 
            content: `✅ Beschreibung wurde geändert!`, 
            ephemeral: true 
        });
        
        await interaction.update({
            embeds: [embed],
            components: [actionRow1, actionRow2, actionRow3]
        });
    } catch (error) {
        console.error('Modal error:', error);
        if (!interaction.replied) {
            await interaction.reply({ content: '❌ Fehler beim Öffnen des Modals!', ephemeral: true });
        }
    }
}

async function showThumbnailModal(interaction, embedData, embed, actionRow1, actionRow2, actionRow3) {
    const modal = new ModalBuilder()
        .setCustomId('thumbnail_modal')
        .setTitle('Thumbnail URL');

    const thumbnailInput = new TextInputBuilder()
        .setCustomId('thumbnail_input')
        .setLabel('Thumbnail URL (Bild-Link)')
        .setStyle(TextInputStyle.Short)
        .setValue(embedData.thumbnail || '')
        .setRequired(false)
        .setPlaceholder('https://example.com/image.png');

    const firstActionRow = new ActionRowBuilder().addComponents(thumbnailInput);
    modal.addComponents(firstActionRow);

    try {
        await interaction.showModal(modal);
        
        const submission = await interaction.awaitModalSubmit({
            time: 60000,
            filter: i => i.customId === 'thumbnail_modal' && i.user.id === interaction.user.id
        });

        const thumbnailValue = submission.fields.getTextInputValue('thumbnail_input');
        embedData.thumbnail = thumbnailValue;
        updateEmbed(embed, embedData);
        
        await submission.reply({ 
            content: `✅ Thumbnail wurde zu "${thumbnailValue}" geändert!`, 
            ephemeral: true 
        });
        
        await interaction.update({
            embeds: [embed],
            components: [actionRow1, actionRow2, actionRow3]
        });
    } catch (error) {
        console.error('Modal error:', error);
        if (!interaction.replied) {
            await interaction.reply({ content: '❌ Fehler beim Öffnen des Modals!', ephemeral: true });
        }
    }
}

async function showImageModal(interaction, embedData, embed, actionRow1, actionRow2, actionRow3) {
    const modal = new ModalBuilder()
        .setCustomId('image_modal')
        .setTitle('Bild URL');

    const imageInput = new TextInputBuilder()
        .setCustomId('image_input')
        .setLabel('Bild URL (Bild-Link)')
        .setStyle(TextInputStyle.Short)
        .setValue(embedData.image || '')
        .setRequired(false)
        .setPlaceholder('https://example.com/image.png');

    const firstActionRow = new ActionRowBuilder().addComponents(imageInput);
    modal.addComponents(firstActionRow);

    try {
        await interaction.showModal(modal);
        
        const submission = await interaction.awaitModalSubmit({
            time: 60000,
            filter: i => i.customId === 'image_modal' && i.user.id === interaction.user.id
        });

        const imageValue = submission.fields.getTextInputValue('image_input');
        embedData.image = imageValue;
        updateEmbed(embed, embedData);
        
        await submission.reply({ 
            content: `✅ Bild wurde zu "${imageValue}" geändert!`, 
            ephemeral: true 
        });
        
        await interaction.update({
            embeds: [embed],
            components: [actionRow1, actionRow2, actionRow3]
        });
    } catch (error) {
        console.error('Modal error:', error);
        if (!interaction.replied) {
            await interaction.reply({ content: '❌ Fehler beim Öffnen des Modals!', ephemeral: true });
        }
    }
}

async function showFooterModal(interaction, embedData, embed, actionRow1, actionRow2, actionRow3) {
    const modal = new ModalBuilder()
        .setCustomId('footer_modal')
        .setTitle('Footer bearbeiten');

    const footerInput = new TextInputBuilder()
        .setCustomId('footer_input')
        .setLabel('Footer Text')
        .setStyle(TextInputStyle.Short)
        .setValue(embedData.footer || '')
        .setRequired(false)
        .setMaxLength(2048)
        .setPlaceholder('Gib den Footer-Text ein...');

    const firstActionRow = new ActionRowBuilder().addComponents(footerInput);
    modal.addComponents(firstActionRow);

    try {
        await interaction.showModal(modal);
        
        const submission = await interaction.awaitModalSubmit({
            time: 60000,
            filter: i => i.customId === 'footer_modal' && i.user.id === interaction.user.id
        });

        const footerValue = submission.fields.getTextInputValue('footer_input');
        embedData.footer = footerValue;
        updateEmbed(embed, embedData);
        
        await submission.reply({ 
            content: `✅ Footer wurde zu "${footerValue}" geändert!`, 
            ephemeral: true 
        });
        
        await interaction.update({
            embeds: [embed],
            components: [actionRow1, actionRow2, actionRow3]
        });
    } catch (error) {
        console.error('Modal error:', error);
        if (!interaction.replied) {
            await interaction.reply({ content: '❌ Fehler beim Öffnen des Modals!', ephemeral: true });
        }
    }
}

async function showFieldModal(interaction, embedData, embed, actionRow1, actionRow2, actionRow3) {
    const modal = new ModalBuilder()
        .setCustomId('field_modal')
        .setTitle('Feld hinzufügen');

    const nameInput = new TextInputBuilder()
        .setCustomId('field_name')
        .setLabel('Feld Name')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(256)
        .setPlaceholder('Gib den Feld-Namen ein...');

    const valueInput = new TextInputBuilder()
        .setCustomId('field_value')
        .setLabel('Feld Wert')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(1024)
        .setPlaceholder('Gib den Feld-Wert ein...');

    const inlineInput = new TextInputBuilder()
        .setCustomId('field_inline')
        .setLabel('Inline? (true/false)')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setValue('false')
        .setPlaceholder('true oder false');

    const firstActionRow = new ActionRowBuilder().addComponents(nameInput);
    const secondActionRow = new ActionRowBuilder().addComponents(valueInput);
    const thirdActionRow = new ActionRowBuilder().addComponents(inlineInput);

    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

    try {
        await interaction.showModal(modal);
        
        const submission = await interaction.awaitModalSubmit({
            time: 60000,
            filter: i => i.customId === 'field_modal' && i.user.id === interaction.user.id
        });

        const fieldName = submission.fields.getTextInputValue('field_name');
        const fieldValue = submission.fields.getTextInputValue('field_value');
        const fieldInline = submission.fields.getTextInputValue('field_inline') === 'true';

        embedData.fields.push({
            name: fieldName,
            value: fieldValue,
            inline: fieldInline
        });

        updateEmbed(embed, embedData);
        
        await submission.reply({ 
            content: `✅ Feld "${fieldName}" wurde hinzugefügt!`, 
            ephemeral: true 
        });
        
        await interaction.update({
            embeds: [embed],
            components: [actionRow1, actionRow2, actionRow3]
        });
    } catch (error) {
        console.error('Modal error:', error);
        if (!interaction.replied) {
            await interaction.reply({ content: '❌ Fehler beim Öffnen des Modals!', ephemeral: true });
        }
    }
}

async function previewEmbed(interaction, embedData) {
    const previewEmbed = new EmbedBuilder()
        .setTitle(embedData.title || 'Kein Titel')
        .setDescription(embedData.description || 'Keine Beschreibung')
        .setColor(embedData.color)
        .setTimestamp()
        .setFooter({ text: embedData.footer || 'Embed-Ersteller' });

    if (embedData.thumbnail) {
        previewEmbed.setThumbnail(embedData.thumbnail);
    }

    if (embedData.image) {
        previewEmbed.setImage(embedData.image);
    }

    if (embedData.fields.length > 0) {
        embedData.fields.forEach(field => {
            previewEmbed.addFields(field);
        });
    }

    await interaction.reply({
        embeds: [previewEmbed],
        ephemeral: true
    });
}

async function sendEmbed(interaction, embedData) {
    const finalEmbed = new EmbedBuilder()
        .setTitle(embedData.title || 'Kein Titel')
        .setDescription(embedData.description || 'Keine Beschreibung')
        .setColor(embedData.color)
        .setTimestamp()
        .setFooter({ text: embedData.footer || 'Embed-Ersteller' });

    if (embedData.thumbnail) {
        finalEmbed.setThumbnail(embedData.thumbnail);
    }

    if (embedData.image) {
        finalEmbed.setImage(embedData.image);
    }

    if (embedData.fields.length > 0) {
        embedData.fields.forEach(field => {
            finalEmbed.addFields(field);
        });
    }

    await interaction.channel.send({ embeds: [finalEmbed] });
    await interaction.reply({ content: '✅ Embed wurde erfolgreich gesendet!', ephemeral: true });
}

async function resetEmbed(interaction, embedData, embed, actionRow1, actionRow2, actionRow3) {
    // Reset alle Daten
    Object.keys(embedData).forEach(key => {
        if (key === 'color') {
            embedData[key] = '#0099ff';
        } else if (key === 'fields') {
            embedData[key] = [];
        } else {
            embedData[key] = '';
        }
    });

    const resetEmbed = new EmbedBuilder()
        .setTitle('📝 Embed-Ersteller')
        .setDescription('Klicke auf die Buttons um dein Embed zu bearbeiten!')
        .setColor('#0099ff')
        .setTimestamp()
        .setFooter({ text: 'Embed-Ersteller' });

    updateEmbed(resetEmbed, embedData);
    await interaction.update({
        embeds: [resetEmbed],
        components: [actionRow1, actionRow2, actionRow3]
    });
}

function updateEmbed(embed, embedData) {
    if (embedData.title) {
        embed.setTitle(embedData.title);
    }
    if (embedData.description) {
        embed.setDescription(embedData.description);
    }
    embed.setColor(embedData.color);
    if (embedData.thumbnail) {
        embed.setThumbnail(embedData.thumbnail);
    }
    if (embedData.image) {
        embed.setImage(embedData.image);
    }
    if (embedData.footer) {
        embed.setFooter({ text: embedData.footer });
    }
    
    // Felder aktualisieren
    embed.spliceFields(0, embed.data.fields?.length || 0);
    if (embedData.fields.length > 0) {
        embedData.fields.forEach(field => {
            embed.addFields(field);
        });
    }
}
