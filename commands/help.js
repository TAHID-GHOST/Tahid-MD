const helpMessage = `
╔══════════════════════╗
 🤖 *${settings.botName || 'Tahid-MD'}*  
 🧩 Version: *${settings.version || '3.0.0'}*
 👑 Owner: ${settings.botOwner || 'Minato'}
 ▶️ YT: ${global.ytch}
╚══════════════════════╝

✨ *COMMAND MENU* ✨

╔══════════════════════╗
🌐 *GENERAL*
║ ➤ .help / .menu  
║ ➤ .ping  
║ ➤ .alive  
║ ➤ .tts <text>  
║ ➤ .owner  
║ ➤ .joke 😂  
║ ➤ .quote 💬  
║ ➤ .fact 📚  
║ ➤ .weather <city> ☁️  
║ ➤ .news 📰  
║ ➤ .attp <text>  
║ ➤ .lyrics <song> 🎵  
║ ➤ .8ball <question> 🎱  
║ ➤ .groupinfo 👥  
║ ➤ .staff / .admins  
║ ➤ .vv  
║ ➤ .trt <text> <lang> 🌍  
║ ➤ .ss <link> 📸  
║ ➤ .jid  
║ ➤ .url 🔗  
╚══════════════════════╝ 

╔══════════════════════╗
👮‍♂️ *ADMIN*
║ ➤ .ban @user 🔨  
║ ➤ .kick @user 👢  
║ ➤ .promote @user ⬆️  
║ ➤ .demote @user ⬇️  
║ ➤ .mute <min> 🔇  
║ ➤ .unmute 🔊  
║ ➤ .delete / .del 🗑️  
║ ➤ .warnings @user ⚠️  
║ ➤ .warn @user  
║ ➤ .antilink 🚫  
║ ➤ .antibadword 🤬  
║ ➤ .clear 🧹  
║ ➤ .tag <msg> 📣  
║ ➤ .tagall 👥  
║ ➤ .tagnotadmin  
║ ➤ .hidetag <msg> 👻  
║ ➤ .chatbot 🤖  
║ ➤ .resetlink 🔄  
║ ➤ .antitag <on/off>  
║ ➤ .welcome <on/off> 🎉  
║ ➤ .goodbye <on/off> 😢  
║ ➤ .setgdesc <text> 📝  
║ ➤ .setgname <name> ✏️  
║ ➤ .setgpp (reply img) 🖼️  
╚══════════════════════╝

╔══════════════════════╗
🔒 *OWNER*
║ ➤ .mode <public/private> 🔐  
║ ➤ .clearsession  
║ ➤ .antidelete  
║ ➤ .cleartmp  
║ ➤ .update ♻️  
║ ➤ .settings ⚙️  
║ ➤ .setpp (reply img)  
║ ➤ .autoreact <on/off> ❤️  
║ ➤ .autostatus <on/off>  
║ ➤ .autotyping <on/off> ⌨️  
║ ➤ .autoread <on/off> 👀  
║ ➤ .anticall <on/off> 📵  
║ ➤ .pmblocker <on/off/status>  
║ ➤ .pmblocker setmsg <text>  
║ ➤ .setmention (reply)  
║ ➤ .mention <on/off>  
╚══════════════════════╝

╔══════════════════════╗
🎨 *IMAGE / STICKER*
║ ➤ .blur <img>  
║ ➤ .simage (reply stkr)  
║ ➤ .sticker (reply img)  
║ ➤ .removebg  
║ ➤ .remini  
║ ➤ .crop (reply img)  
║ ➤ .tgsticker <link>  
║ ➤ .meme 😂  
║ ➤ .take <pack>  
║ ➤ .emojimix 😄+🔥  
║ ➤ .igs <link>  
║ ➤ .igsc <link>  
╚══════════════════════╝  

╔══════════════════════╗
🖼️ *PIES*
║ ➤ .pies <country>  
║ ➤ .china 🇨🇳  
║ ➤ .indonesia 🇮🇩  
║ ➤ .japan 🇯🇵  
║ ➤ .korea 🇰🇷  
║ ➤ .hijab 🧕  
╚══════════════════════╝

╔══════════════════════╗
🎮 *GAMES*
║ ➤ .tictactoe @user ❌⭕  
║ ➤ .hangman  
║ ➤ .guess <letter>  
║ ➤ .trivia 🧠  
║ ➤ .answer <ans>  
║ ➤ .truth  
║ ➤ .dare  
╚══════════════════════╝

╔══════════════════════╗
🤖 *AI*
║ ➤ .gpt <q>  
║ ➤ .gemini <q>  
║ ➤ .imagine <prompt> 🖌️  
║ ➤ .flux <prompt>  
║ ➤ .sora <prompt>  
╚══════════════════════╝

╔══════════════════════╗
🎯 *FUN*
║ ➤ .compliment @user 💖  
║ ➤ .insult @user 😈  
║ ➤ .flirt 😘  
║ ➤ .shayari 📝  
║ ➤ .goodnight 🌙  
║ ➤ .roseday 🌹  
║ ➤ .character @user  
║ ➤ .wasted @user  
║ ➤ .ship @user ❤️  
║ ➤ .simp @user  
║ ➤ .stupid @user  
╚══════════════════════╝

╔══════════════════════╗
🔤 *TEXTMAKER*
║ ➤ .metallic  
║ ➤ .ice  
║ ➤ .snow ❄️  
║ ➤ .matrix  
║ ➤ .neon ✨  
║ ➤ .fire 🔥  
║ ➤ .glitch  
║ ➤ .blackpink  
║ ➤ .hacker  
║ ➤ .sand  
╚══════════════════════╝

╔══════════════════════╗
📥 *DOWNLOADER*
║ ➤ .play <song> 🎧  
║ ➤ .song <song>  
║ ➤ .spotify <query>  
║ ➤ .instagram <link>  
║ ➤ .facebook <link>  
║ ➤ .tiktok <link>  
║ ➤ .video <song>  
║ ➤ .ytmp4 <link>  
╚══════════════════════╝

╔══════════════════════╗
💻 *GITHUB*
║ ➤ .git  
║ ➤ .github  
║ ➤ .sc  
║ ➤ .script  
║ ➤ .repo  
╚══════════════════════╝

✨ *Join our channel for updates!* ✨
`;

    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');
        
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363404917414335@newsletter',
                        newsletterName: 'Tahid MD',
                        serverMessageId: -1
                    }
                }
            },{ quoted: message });
        } else {
            console.error('Bot image not found at:', imagePath);
            await sock.sendMessage(chatId, { 
                text: helpMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363161513685998@newsletter',
                        newsletterName: 'KnightBot MD by Mr Unique Hacker',
                        serverMessageId: -1
                    } 
                }
            });
        }
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;
