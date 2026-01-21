// commands/npcshop.js
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/shop.json');
const USER_DATA = path.join(__dirname, '../data/storymode.json'); // for coins/EXP

// Read shop and user data
function readShopData() {
    if (!fs.existsSync(DATA_FILE)) return {};
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function saveShopData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function readUserData() {
    if (!fs.existsSync(USER_DATA)) return {};
    return JSON.parse(fs.readFileSync(USER_DATA, 'utf-8'));
}

function saveUserData(data) {
    fs.writeFileSync(USER_DATA, JSON.stringify(data, null, 2));
}

// Example shop items
const shopItems = [
    { id: 1, name: 'Health Potion', price: 50, desc: 'Restores 50 HP in Story Mode quests' },
    { id: 2, name: 'Mana Potion', price: 75, desc: 'Restores 50 Mana for skills' },
    { id: 3, name: 'Rare Card Pack', price: 200, desc: 'Contains 1 random Pokemon/Anime card' },
    { id: 4, name: 'EXP Booster', price: 150, desc: 'Gives +50 EXP instantly' },
];

async function npcShopCommand(sock, chatId, senderId, args, message) {
    let shopData = readShopData();
    let userData = readUserData();

    if (!userData[senderId]) {
        userData[senderId] = { coins: 100, inventory: [] }; // default coins
    }

    const user = userData[senderId];

    if (!args[0]) {
        // Show shop items
        let text = '🏪 *NPC Shop*\n\n';
        shopItems.forEach(item => {
            text += `🛒 ${item.name} - ${item.price} coins\n${item.desc}\n\n`;
        });
        text += `💰 Your Coins: ${user.coins}`;
        await sock.sendMessage(chatId, { text }, { quoted: message });
        return;
    }

    const command = args[0].toLowerCase();

    if (command === 'buy') {
        const itemName = args.slice(1).join(' ').toLowerCase();
        const item = shopItems.find(i => i.name.toLowerCase() === itemName);

        if (!item) {
            await sock.sendMessage(chatId, { text: '❌ Item not found in the shop.' }, { quoted: message });
            return;
        }

        if (user.coins < item.price) {
            await sock.sendMessage(chatId, { text: `❌ You do not have enough coins. You have ${user.coins} coins.` }, { quoted: message });
            return;
        }

        user.coins -= item.price;
        user.inventory.push(item.name);
        userData[senderId] = user;

        saveUserData(userData);
        await sock.sendMessage(chatId, { text: `✅ You bought *${item.name}*!\n💰 Coins left: ${user.coins}` }, { quoted: message });
        return;
    }

    if (command === 'inventory') {
        const inv = user.inventory.length ? user.inventory.map((i, idx) => `${idx+1}. ${i}`).join('\n') : 'Empty';
        await sock.sendMessage(chatId, { text: `🎒 Your Inventory:\n${inv}` }, { quoted: message });
        return;
    }

    await sock.sendMessage(chatId, { text: '❌ Invalid command. Use `.npcshop`, `.npcshop buy <item>`, or `.npcshop inventory`' }, { quoted: message });
}

module.exports = npcShopCommand;
