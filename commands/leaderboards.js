// commands/leaderboards.js
const fs = require('fs');
const path = require('path');

const STORY_DATA = path.join(__dirname, '../data/storymode.json'); // for level, exp, completed quests, coins
const SHOP_DATA = path.join(__dirname, '../data/storymode.json');  // coins are stored here
const CLAN_DATA = path.join(__dirname, '../data/clanwars.json');   // clan points
const CARDS_DATA = path.join(__dirname, '../data/cards.json');     // cards count

// Helper: read JSON
function readData(filePath) {
    if (!fs.existsSync(filePath)) return {};
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

async function leaderboardsCommand(sock, chatId, senderId, args, message) {
    const storyData = readData(STORY_DATA);
    const clanData = readData(CLAN_DATA);
    const cardsData = readData(CARDS_DATA);

    if (!args[0]) {
        let text = '🏆 *Leaderboards*\n\n' +
                   'Use: `.leaderboards coins` | `.leaderboards level` | `.leaderboards quests` | `.leaderboards cards` | `.leaderboards clans`\n';
        await sock.sendMessage(chatId, { text }, { quoted: message });
        return;
    }

    const type = args[0].toLowerCase();
    let sorted = [];

    if (type === 'coins') {
        sorted = Object.entries(storyData)
            .map(([uid, data]) => ({ uid, coins: data.coins || 0 }))
            .sort((a,b) => b.coins - a.coins)
            .slice(0, 10);

        let text = '💰 Top Coins:\n';
        sorted.forEach((u, i) => text += `${i+1}. ${u.uid} - ${u.coins} coins\n`);
        await sock.sendMessage(chatId, { text }, { quoted: message });
        return;
    }

    if (type === 'level') {
        sorted = Object.entries(storyData)
            .map(([uid, data]) => ({ uid, level: data.level || 1 }))
            .sort((a,b) => b.level - a.level)
            .slice(0,10);

        let text = '🎖 Top Levels:\n';
        sorted.forEach((u, i) => text += `${i+1}. ${u.uid} - Level ${u.level}\n`);
        await sock.sendMessage(chatId, { text }, { quoted: message });
        return;
    }

    if (type === 'quests') {
        sorted = Object.entries(storyData)
            .map(([uid, data]) => ({ uid, quests: (data.completedQuests || []).length }))
            .sort((a,b) => b.quests - a.quests)
            .slice(0,10);

        let text = '📖 Top Completed Quests:\n';
        sorted.forEach((u, i) => text += `${i+1}. ${u.uid} - ${u.quests} quests\n`);
        await sock.sendMessage(chatId, { text }, { quoted: message });
        return;
    }

    if (type === 'cards') {
        sorted = Object.entries(cardsData)
            .map(([uid, data]) => ({ uid, cards: (data.cards || []).length }))
            .sort((a,b) => b.cards - a.cards)
            .slice(0,10);

        let text = '🎴 Top Cards Collected:\n';
        sorted.forEach((u,i) => text += `${i+1}. ${u.uid} - ${u.cards} cards\n`);
        await sock.sendMessage(chatId, { text }, { quoted: message });
        return;
    }

    if (type === 'clans') {
        if (!clanData.clans) {
            await sock.sendMessage(chatId, { text: '❌ No clan data available yet.' }, { quoted: message });
            return;
        }
        sorted = Object.entries(clanData.clans)
            .map(([name, data]) => ({ name, points: data.points || 0 }))
            .sort((a,b) => b.points - a.points)
            .slice(0,10);

        let text = '🏰 Clan Leaderboard:\n';
        sorted.forEach((c,i) => text += `${i+1}. ${c.name} - ${c.points} points\n`);
        await sock.sendMessage(chatId, { text }, { quoted: message });
        return;
    }

    await sock.sendMessage(chatId, { text: '❌ Invalid leaderboard type. Use coins, level, quests, cards, or clans.' }, { quoted: message });
}

module.exports = leaderboardsCommand;
