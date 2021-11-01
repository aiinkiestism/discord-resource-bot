import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Message } from 'discord.js';
import isValidUrl from '../utils/urlChecker';
import axios from 'axios';

export const data = new SlashCommandBuilder()
    .setName('add-resource')
    .setDescription('Adds your link to the knowledgebase (must be airtable link)')
    .addStringOption(
        option => option.setRequired(true)
        .setName('input')
        .setDescription('Enter a link to a resource'))

export async function execute(interaction: CommandInteraction) {
    const userInput = interaction.options.getString('input')
    const validAnswers = ['y', 'n']
    const filter = (response: Message) => {
        return validAnswers.some(answer => answer.toLowerCase() === response.content.toLowerCase()) && response.author.id === interaction.user.id
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (isValidUrl(userInput!)) {
        await interaction.reply({
            content: `you are submiting ${userInput} as a new resource. \n Is this link correct? [Y/N]`,
            ephemeral: true,
        })
        const collection = await interaction.channel?.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] })
        collection?.map((message: Message) => {
            switch (message.content.toLowerCase()) {
                case 'y':
                    interaction.followUp({
                        content: 'Confirmed!',
                        ephemeral: true,
                    })
                    break;
                case 'n':
                    interaction.followUp({
                        content: 'Try again with the correct resource please!',
                        ephemeral: true,
                    })
                    break;
                default:
                    break;
            }
        })
    }
    else {
        await interaction.reply({ content: 'Sorry, that\'s not a valid url!', ephemeral: true })
    }
}