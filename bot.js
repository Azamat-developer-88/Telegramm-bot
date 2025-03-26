const { Telegraf, Markup } = require("telegraf");
const { handleImageSearch, handleGifSearch } = require("./handlers");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    "Salom! Men rasm va GIF izlash botiman.\nQuyidagi tugmalardan foydalaning:",
    Markup.keyboard([["📷 Rasm Izlash", "🎥 GIF Izlash"]])
      .resize()
      .oneTime()
  );
});

bot.hears("📷 Rasm Izlash", (ctx) => {
  ctx.reply("Qanday rasm izlamoqchisiz? Matn kiriting.");
  bot.on("text", (ctx) => handleImageSearch(ctx));
});

bot.hears("🎥 GIF Izlash", (ctx) => {
  ctx.reply("Qanday GIF izlamoqchisiz? Matn kiriting.");
  bot.on("text", (ctx) => handleGifSearch(ctx));
});

const startBot = () => {
  bot.launch();
  console.log("Bot ishga tushdi!");
};

module.exports = { startBot };
