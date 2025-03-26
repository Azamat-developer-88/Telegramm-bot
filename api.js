const axios = require("axios");

const searchUnsplash = async (query) => {
  try {
    const response = await axios.get(
      `https://api.unsplash.com/photos/random?query=${query}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
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
      `https://tenor.googleapis.com/v2/search?q=${query}&key=${process.env.TENOR_API_KEY}&limit=1`
    );
    return response.data.results[0]?.media_formats.gif.url;
  } catch (error) {
    console.error("Tenor API xatosi:", error);
    return null;
  }
};

module.exports = { searchUnsplash, searchTenor };
