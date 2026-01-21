// commands/worldboss.js
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/worldboss.json');

// Helper: read world boss data
function readBossData() {
    if (!fs.existsSync(DATA_FILE)) return {};
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

// Helper: save world boss data
function saveBossData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Default boss template
const defaultBoss = {
    name: "Ancient Dragon",
    maxHp: 1000,
    currentHp: 1000,
    attackers: {} // {userId: damage}
};

async function worldBossCommand(sock, chatId, senderId, args, message) {
    let data = readBossData();

    if (!data.boss) {
        data.boss = { ...defaultBoss };
    }

    const boss = data.boss;

    if (!args[0]) {
        // Show current boss status
        const text = `🌍 *World Boss*\n\n` +
            `Boss: ${boss.name}\n` +
            `HP: ${boss.currentHp} / ${boss.maxHp}\n` +
            `Attackers: ${Object.keys(boss.attackers).length}`;
        await sock.sendMessage(chatId, { text }, { quoted: message });
        return;
    }

    const command = args[0].toLowerCase();

    if (command === 'attack') {
        if (boss.currentHp <= 0) {
            await sock.sendMessage(chatId, { text: `⚠️ The boss is already defeated! Wait for respawn.` }, { quoted: message });
            return;
        }

        // Random damage 50-150
        const damage = Math.floor(Math.random() * 101) + 50;

        boss.currentHp -= damage;
        if (boss.currentHp < 0) boss.currentHp = 0;

        // Track user damage
        if (!boss.attackers[senderId]) boss.attackers[senderId] = 0;
        boss.attackers[senderId] += damage;

        let reply = `⚔ You attacked *${boss.name}* for ${damage} damage!\n` +
            `HP left: ${boss.currentHp} / ${boss.maxHp}`;

        // If boss defeated
        if (boss.currentHp === 0) {
            // Determine top attacker
            const sorted = Object.entries(boss.attackers).sort((a, b) => b[1] - a[1]);
            const topAttackerId = sorted[0][0];
            const topDamage = sorted[0][1];

            reply += `\n\n🎉 *${topAttackerId}* dealt the most damage (${topDamage}) and gets a reward!`;

            // Reset boss
            data.boss = { ...defaultBoss };
        }

        saveBossData(data);
        await sock.sendMessage(chatId, { text: reply }, { quoted: message });
        return;
    }

    if (command === 'leaderboard') {
        const attackers = boss.attackers;
        if (!attackers || Object.keys(attackers).length === 0) {
            await sock.sendMessage(chatId, { text: '🏆 No attacks yet! Be the first to attack the boss.' }, { quoted: message });
            return;
        }

        const sorted = Object.entries(attackers).sort((a, b) => b[1] - a[1]);
        let text = '🏆 *World Boss Leaderboard*\n\n';
        sorted.slice(0, 5).forEach(([user, dmg], i) => {
            text += `${i + 1}. ${user} - ${dmg} dmg\n`;
        });

        await sock.sendMessage(chatId, { text }, { quoted: message });
        return;
    }

    await sock.sendMessage(chatId, { text: '❌ Invalid command. Use `.worldboss attack` or `.worldboss leaderboard`' }, { quoted: message });
}

module.exports = worldBossCommand;
