// commands/cards.js
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/cards.json');

// Helper to read cards data
function readCards() {
    if (!fs.existsSync(DATA_FILE)) return {};
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

// Helper to save cards data
function saveCards(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Fetch random Pokemon from PokéAPI
async function getRandomPokemon() {
    const id = Math.floor(Math.random() * 1010) + 1; // Pokemon count ~1010
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();
    return {
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        sprite: data.sprites.front_default
    };
}

// Fetch random anime character from Jikan API
async function getRandomAnimeCharacter() {
    const page = Math.floor(Math.random() * 50) + 1;
    const res = await fetch(`https://api.jikan.moe/v4/characters?page=${page}`);
    const data = await res.json();
    const chars = data.data;
    if (!chars || chars.length === 0) return null;
    const character = chars[Math.floor(Math.random() * chars.length)];
    return {
        name: character.name,
        image: character.images.jpg.image_url
    };
}

async function cardsCommand(sock, chatId, senderId, args, message) {
    let cardsData = readCards();

    if (!cardsData[senderId]) {
        cardsData[senderId] = { cards: [] };
    }

    const userCards = cardsData[senderId].cards;

    if (!args[0]) {
        // Show user's cards
        const text = userCards.length
            ? `🎴 Your Cards:\n${userCards.map((c, i) => `${i+1}. ${c.name} (${c.type})`).join('\n')}`
            : '❌ You have no cards yet. Use `.cards claim pokemon` or `.cards claim anime` to get one!';
        await sock.sendMessage(chatId, { text }, { quoted: message });
        return;
    }

    const command = args[0].toLowerCase();

    if (command === 'claim') {
        const type = args[1]?.toLowerCase() || 'pokemon';

        let card;
        if (type === 'pokemon') {
            card = await getRandomPokemon();
            card.type = 'Pokemon';
        } else if (type === 'anime') {
            card = await getRandomAnimeCharacter();
            card.type = 'Anime';
        } else {
            await sock.sendMessage(chatId, { text: '❌ Invalid type! Use `pokemon` or `anime`.' }, { quoted: message });
            return;
        }

        // Check if user already has the card
        if (userCards.find(c => c.name === card.name && c.type === card.type)) {
            await sock.sendMessage(chatId, { text: `❌ You already have ${card.name} (${card.type})!` }, { quoted: message });
            return;
        }

        userCards.push(card);
        cardsData[senderId].cards = userCards;
        saveCards(cardsData);

        await sock.sendMessage(chatId, { text: `🎉 You claimed a new card: ${card.name} (${card.type})!`, 
            image: { url: card.sprite || card.image } 
        }, { quoted: message });
        return;
    }

    if (command === 'all') {
        await sock.sendMessage(chatId, { text: '🎴 Claim cards using:\n`.cards claim pokemon`\n`.cards claim anime`' }, { quoted: message });
        return;
    }

    await sock.sendMessage(chatId, { text: '❌ Invalid command. Use `.cards claim pokemon`, `.cards claim anime`, or `.cards all`' }, { quoted: message });
}

module.exports = cardsCommand;
