require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const express = require("express");
const axios = require("axios");

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
const PORT = process.env.PORT || 10000;

// ======== API orqali qidirish funksiyalari ======== //
const searchUnsplash = async (query) => {
  try {
    const response = await axios.get(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    );
    return response.data.urls.regular;
  } catch (error) {
    console.error("Unsplash API xatosi:", error);
    return null;
  }
};

const searchTenor = async (query) => {
  try {
    const response = await axios.get(
      `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(query)}&key=${process.env.TENOR_API_KEY}&limit=1`
    );
    return response.data.results[0]?.media_formats.gif.url;
  } catch (error) {
    console.error("Tenor API xatosi:", error);
    return null;
  }
};

const searchGoogle = async (query) => {
  try {
    const response = await axios.post(
      "https://google.serper.dev/images",
      { q: query },
      { headers: { "X-API-KEY": process.env.SERPER_API_KEY, "Content-Type": "application/json" } }
    );
    return response.data.images[0]?.imageUrl || null;
  } catch (error) {
    console.error("Google API xatosi:", error);
    return null;
  }
};

// ======== Bot buyruqlari ======== //
bot.start((ctx) => {
  ctx.reply(
    "Salom! Menga biror so‘rov yozing yoki quyidagi tugmalardan foydalaning:",
    Markup.keyboard([
      ["🖼 Rasm Qidirish", "🎞 GIF Qidirish"],
    ]).resize()
  );
});

bot.hears("🖼 Rasm Qidirish", (ctx) => ctx.reply("Qidirayotgan rasm so‘zini kiriting: "));
bot.hears("🎞 GIF Qidirish", (ctx) => ctx.reply("Qidirayotgan GIF so‘zini kiriting: "));

bot.on("text", async (ctx) => {
  const query = ctx.message.text;
  await ctx.reply("⏳ Qidirilmoqda...");
  
  const image = await searchGoogle(query) || await searchUnsplash(query);
  const gif = await searchTenor(query);
  
  if (image) {
    await ctx.replyWithPhoto(image, { caption: `Topilgan rasm: ${query}` });
  } else if (gif) {
    await ctx.replyWithAnimation(gif, { caption: `Tenor'dan topilgan GIF: ${query}` });
  } else {
    await ctx.reply("Kechirasiz, hech narsa topilmadi 😢");
  }
});

// ======== Webhook sozlash ======== //
app.use(express.json());
app.post(`/bot${process.env.BOT_TOKEN}`, (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send("Bot ishlayapti!");
});

app.listen(PORT, async () => {
  console.log(`Server ${PORT}-portda ishlayapti`);
  await bot.telegram.setWebhook(`https://telegramm-bot-new.onrender.com/bot${process.env.BOT_TOKEN}`);
});
