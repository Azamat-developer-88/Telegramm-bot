require("dotenv").config();
const { startBot } = require("./bot");

const express = require("express");
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

bot.start((ctx) => ctx.reply("Bot ishga tushdi!"));
bot.launch();

// Render uchun kerak bo'lgan HTTP server
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("Bot ishlayapti!"));
app.listen(PORT, () => console.log(`Server ${PORT} portda ishlayapti`));
startBot();
