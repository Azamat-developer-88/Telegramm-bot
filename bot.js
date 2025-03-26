require('dotenv').config();
const { Telegraf, Markup, session } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);
const SERPER_API_KEY = process.env.SERPER_API_KEY;
const TENOR_API_KEY = process.env.TENOR_API_KEY;

// ✅ Webhookni o‘chirib tashlash (409 xatolikni oldini olish)
(async () => {
    try {
        await bot.telegram.deleteWebhook();
        console.log("✅ Webhook o‘chirildi.");
    } catch (error) {
        console.error("❌ Webhook o‘chirishda xatolik:", error.message);
    }
})();

// ✅ Session o‘rnatish
bot.use(session());

// ✅ Start komandasi va menyu
bot.start((ctx) => {
    ctx.reply(
        '📷 Qidirish usulini tanlang:',
        Markup.inlineKeyboard([
            [Markup.button.callback('🖼 Rasm qidirish', 'search_image')],
            [Markup.button.callback('🎭 GIF qidirish', 'search_gif')]
        ])
    );
});

// ✅ Serper API orqali rasm qidirish
async function searchImage(query) {
    try {
        const response = await axios.post('https://serper.dev/images', { q: query }, {
            headers: { 'X-API-KEY': SERPER_API_KEY }
        });
        return response.data?.images?.[0]?.imageUrl || null;
    } catch (error) {
        console.error('❌ Rasm qidirishda xatolik:', error.message);
        return null;
    }
}

// ✅ Tenor API orqali GIF qidirish
async function searchGif(query) {
    try {
        const response = await axios.get(`https://g.tenor.com/v1/search?q=${encodeURIComponent(query)}&key=${TENOR_API_KEY}&limit=1`);
        return response.data?.results?.[0]?.media[0]?.gif?.url || null;
    } catch (error) {
        console.error('❌ GIF qidirishda xatolik:', error.message);
        return null;
    }
}

// ✅ Tugma bosilganda turini saqlash
bot.action('search_image', (ctx) => {
    ctx.session.searchType = 'image';
    ctx.reply('🔍 Iltimos, rasm uchun so‘rov yuboring.');
});

bot.action('search_gif', (ctx) => {
    ctx.session.searchType = 'gif';
    ctx.reply('🎭 Iltimos, GIF uchun so‘rov yuboring.');
});

// ✅ Foydalanuvchi so‘rov yuborganda
bot.on('text', async (ctx) => {
    const query = ctx.message.text;
    const searchType = ctx.session.searchType || 'image';

    try {
        if (searchType === 'image') {
            const imageUrl = await searchImage(query);
            if (imageUrl) {
                await ctx.replyWithPhoto(imageUrl, { caption: `🔍 Natija: ${query}` });
            } else {
                await ctx.reply('😔 Rasm topilmadi.');
            }
        } else if (searchType === 'gif') {
            const gifUrl = await searchGif(query);
            if (gifUrl) {
                await ctx.replyWithAnimation(gifUrl, { caption: `🎭 GIF natija: ${query}` });
            } else {
                await ctx.reply('😔 GIF topilmadi.');
            }
        }
    } catch (error) {
        console.error("❌ Xatolik yuz berdi:", error.message);
        await ctx.reply("🚨 Xatolik yuz berdi, keyinroq qayta urinib ko‘ring.");
    }
});

// ✅ Botni ishga tushirish
bot.launch()
    .then(() => console.log('✅ Bot ishga tushdi...'))
    .catch(err => console.error('❌ Botni ishga tushirishda xatolik:', err.message));

// ✅ To‘g‘ri yopish
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
