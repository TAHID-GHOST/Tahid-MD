// commands/fusion.js
const fs = require('fs');
const path = require('path');

const CARDS_FILE = path.join(__dirname, '../data/cards.json'); // user cards
const USER_FILE = path.join(__dirname, '../data/storymode.json'); // user coins/level

// Read JSON helper
function readData(file) {
    if (!fs.existsSync(file)) return {};
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function saveData(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Fusion function: combine two cards into a rare one
function fuseCards(card1, card2) {
    // Example: combine names and type
    const name = `${card1.name}-${card2.name}`;
    const type = card1.type === card2.type ? card1.type : 'Fusion';
    const image = card1.sprite || card1.image || card2.sprite || card2.image;
    return { name, type, image };
}

async function fusionCommand(sock, chatId, senderId, args, message) {
    if (!args[0] || args[0].toLowerCase() === 'help') {
        await sock.sendMessage(chatId, { text:
            '✨ *Fusion System*\n\n' +
            'Commands:\n' +
            '`.fusion list` - Show your cards\n' +
            '`.fusion combine <card1 number> <card2 number>` - Combine two cards into a rare card\n'
        }, { quoted: message });
        return;
    }

    const cardsData = readData(CARDS_FILE);
    if (!cardsData[senderId] || !cardsData[senderId].cards.length) {
        await sock.sendMessage(chatId, { text: '❌ You have no cards to fuse!' }, { quoted: message });
        return;
    }

    const userCards = cardsData[senderId].cards;

    const subcommand = args[0].toLowerCase();

    if (subcommand === 'list') {
        let text = '🎴 Your Cards:\n';
        userCards.forEach((c, i) => text += `${i+1}. ${c.name} (${c.type})\n`);
        await sock.sendMessage(chatId, { text }, { quoted: message });
        return;
    }

    if (subcommand === 'combine') {
        const index1 = parseInt(args[1], 10) - 1;
        const index2 = parseInt(args[2], 10) - 1;

        if (isNaN(index1) || isNaN(index2) || index1 === index2 || !userCards[index1] || !userCards[index2]) {
            await sock.sendMessage(chatId, { text: '❌ Invalid card numbers. Use `.fusion list` to check your cards.' }, { quoted: message });
            return;
        }

        const card1 = userCards[index1];
        const card2 = userCards[index2];

        const newCard = fuseCards(card1, card2);

        // Remove old cards
        userCards.splice(Math.max(index1, index2), 1);
        userCards.splice(Math.min(index1, index2), 1);

        // Add new fused card
        userCards.push(newCard);
        cardsData[senderId].cards = userCards;

        saveData(CARDS_FILE, cardsData);

        await sock.sendMessage(chatId, {
            text: `✨ *Fusion Successful!*\nYou fused:\n1. ${card1.name}\n2. ${card2.name}\n\nInto a new card: ${newCard.name} (${newCard.type})`,
            image: { url: newCard.sprite || newCard.image }
        }, { quoted: message });
        return;
    }

    await sock.sendMessage(chatId, { text: '❌ Invalid fusion command. Use `.fusion list` or `.fusion combine <card1> <card2>`' }, { quoted: message });
}

module.exports = fusionCommand;
