const { searchUnsplash, searchTenor } = require("./api");

const handleImageSearch = async (ctx) => {
  const query = ctx.message.text;
  const imageUrl = await searchUnsplash(query);
  if (imageUrl) {
    ctx.replyWithPhoto(imageUrl);
  } else {
    ctx.reply("Hech qanday rasm topilmadi. Boshqa so‘z kiriting.");
  }
};

const handleGifSearch = async (ctx) => {
  const query = ctx.message.text;
  const gifUrl = await searchTenor(query);
  if (gifUrl) {
    ctx.replyWithAnimation(gifUrl);
  } else {
    ctx.reply("Hech qanday GIF topilmadi. Boshqa so‘z kiriting.");
  }
};

module.exports = { handleImageSearch, handleGifSearch };
