// commands/storymode.js
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/storymode.json');

// Helper: read user story data
function readStoryData() {
    if (!fs.existsSync(DATA_FILE)) return {};
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

// Helper: save user story data
function saveStoryData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Example quests
const quests = [
    { id: 1, name: 'Slay the Goblin', reward: 50 },
    { id: 2, name: 'Rescue the Villager', reward: 75 },
    { id: 3, name: 'Explore the Dark Cave', reward: 100 },
];

async function storyModeCommand(sock, chatId, senderId, args, message) {
    let data = readStoryData();

    if (!data[senderId]) {
        data[senderId] = {
            level: 1,
            exp: 0,
            currentQuest: null,
            completedQuests: []
        };
    }

    const user = data[senderId];

    if (!args[0]) {
        // Show current status
        const text = `📖 *Story Mode*\n\n` +
            `Level: ${user.level}\n` +
            `EXP: ${user.exp}\n` +
            `Current Quest: ${user.currentQuest ? user.currentQuest.name : 'None'}\n` +
            `Completed Quests: ${user.completedQuests.length}`;
        await sock.sendMessage(chatId, { text }, { quoted: message });
        return;
    }

    const command = args[0].toLowerCase();

    if (command === 'start') {
        if (user.currentQuest) {
            await sock.sendMessage(chatId, { text: `❌ You are already on a quest: ${user.currentQuest.name}` }, { quoted: message });
            return;
        }

        // Random quest
        const quest = quests[Math.floor(Math.random() * quests.length)];
        user.currentQuest = quest;
        saveStoryData(data);

        await sock.sendMessage(chatId, { text: `🎯 Quest Started: *${quest.name}*\nReward: ${quest.reward} EXP` }, { quoted: message });
        return;
    }

    if (command === 'complete') {
        if (!user.currentQuest) {
            await sock.sendMessage(chatId, { text: '❌ You are not on any quest.' }, { quoted: message });
            return;
        }

        // Add EXP
        user.exp += user.currentQuest.reward;
        user.completedQuests.push(user.currentQuest);
        const completedQuestName = user.currentQuest.name;
        user.currentQuest = null;

        // Level up every 200 EXP
        if (user.exp >= 200) {
            user.level += 1;
            user.exp -= 200;
            await sock.sendMessage(chatId, { text: `🎉 Quest Completed: *${completedQuestName}*\nYou leveled up! New Level: ${user.level}` }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text: `🎉 Quest Completed: *${completedQuestName}*\nYou earned ${user.completedQuests.slice(-1)[0].reward} EXP` }, { quoted: message });
        }

        saveStoryData(data);
        return;
    }

    if (command === 'quests') {
        const text = '📜 Available Quests:\n' + quests.map(q => `- ${q.name} (Reward: ${q.reward} EXP)`).join('\n');
        await sock.sendMessage(chatId, { text }, { quoted: message });
        return;
    }

    await sock.sendMessage(chatId, { text: '❌ Invalid command. Use `.storymode start`, `.storymode complete`, or `.storymode quests`' }, { quoted: message });
}

module.exports = storyModeCommand;
