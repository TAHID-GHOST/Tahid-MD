// commands/market.js
const fs = require('fs');
const path = require('path');

const CARDS_FILE = path.join(__dirname, '../data/cards.json');       // user cards
const USER_FILE = path.join(__dirname, '../data/storymode.json');    // coins
const MARKET_FILE = path.join(__dirname, '../data/market.json');     // market listings

// Helpers to read/write JSON
function readData(file) {
    if (!fs.existsSync(file)) return {};
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function saveData(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Ensure market exists
if (!fs.existsSync(MARKET_FILE)) saveData(MARKET_FILE, { listings: [] });

async function marketCommand(sock, chatId, senderId, args, message) {
    const userData = readData(USER_FILE);
    const cardsData = readData(CARDS_FILE);
    const marketData = readData(MARKET_FILE);

    if (!userData[senderId]) userData[senderId] = { coins: 100, inventory: [] };
    if (!cardsData[senderId]) cardsData[senderId] = { cards: [] };

    const subcommand = args[0]?.toLowerCase();

    if (!subcommand || subcommand === 'help') {
        await sock.sendMessage(chatId, { text:
            '💎 *Market Commands*\n\n' +
            '`.market list` - Show all market listings\n' +
            '`.market sell <card number> <price>` - Sell a card from your inventory\n' +
            '`.market buy <listing number>` - Buy a listed card\n'
        }, { quoted: message });
        return;
    }

    if (subcommand === 'list') {
        if (!marketData.listings.length) {
            await sock.sendMessage(chatId, { text: '📭 The market is empty!' }, { quoted: message });
            return;
        }

        let text = '🛒 *Market Listings:*\n\n';
        marketData.listings.forEach((listing, i) => {
            text += `${i+1}. ${listing.card.name} (${listing.card.type}) - Price: ${listing.price} coins\nSeller: ${listing.seller}\n\n`;
        });

        await sock.sendMessage(chatId, { text }, { quoted: message });
        return;
    }

    if (subcommand === 'sell') {
        const index = parseInt(args[1], 10) - 1;
        const price = parseInt(args[2], 10);

        if (isNaN(index) || isNaN(price) || price <= 0) {
            await sock.sendMessage(chatId, { text: '❌ Invalid command. Use `.market sell <card number> <price>`' }, { quoted: message });
            return;
        }

        const userCards = cardsData[senderId].cards;
        if (!userCards[index]) {
            await sock.sendMessage(chatId, { text: '❌ Card number does not exist.' }, { quoted: message });
            return;
        }

        const card = userCards.splice(index, 1)[0];
        marketData.listings.push({ card, price, seller: senderId });

        saveData(CARDS_FILE, cardsData);
        saveData(MARKET_FILE, marketData);

        await sock.sendMessage(chatId, { text: `✅ Your card *${card.name}* is now listed for ${price} coins.` }, { quoted: message });
        return;
    }

    if (subcommand === 'buy') {
        const listingIndex = parseInt(args[1], 10) - 1;
        const listing = marketData.listings[listingIndex];

        if (!listing) {
            await sock.sendMessage(chatId, { text: '❌ Invalid listing number.' }, { quoted: message });
            return;
        }

        if (userData[senderId].coins < listing.price) {
            await sock.sendMessage(chatId, { text: `❌ You do not have enough coins. You need ${listing.price} coins.` }, { quoted: message });
            return;
        }

        // Transfer coins
        userData[senderId].coins -= listing.price;
        if (!userData[listing.seller]) userData[listing.seller] = { coins: 0, inventory: [] };
        userData[listing.seller].coins += listing.price;

        // Give card to buyer
        if (!cardsData[senderId]) cardsData[senderId] = { cards: [] };
        cardsData[senderId].cards.push(listing.card);

        // Remove from market
        marketData.listings.splice(listingIndex, 1);

        // Save data
        saveData(USER_FILE, userData);
        saveData(CARDS_FILE, cardsData);
        saveData(MARKET_FILE, marketData);

        await sock.sendMessage(chatId, {
            text: `✅ You bought *${listing.card.name}* for ${listing.price} coins from ${listing.seller}!`
        }, { quoted: message });
        return;
    }

    await sock.sendMessage(chatId, { text: '❌ Invalid market command. Use `.market list`, `.market sell <card> <price>`, or `.market buy <number>`' }, { quoted: message });
}

module.exports = marketCommand;
