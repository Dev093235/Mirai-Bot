module.exports.config = {
  name: "anime",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "Rudra",
  description: "📸 Get random anime images by tag (Safe For Work)",
  commandCategory: "fun-img",
  usages: "[tag]",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "path": ""
  }
};

module.exports.languages = {
  en: {
    addTags: "🎌 Available Anime Tags:\n%1"
  }
};

module.exports.getAnime = async function (type) {
  try {
    const { readFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const { getContent, downloadFile, randomString } = global.utils;
    const animeData = JSON.parse(readFileSync(await global.utils.assets.data("ANIME")));
    const dataImage = (await getContent(animeData[type])).data;
    const urlImage = dataImage.data.response.url;
    const ext = urlImage.substring(urlImage.lastIndexOf(".") + 1);
    const string = randomString(5);
    const path = join(__dirname, "cache", `${string}.${ext}`);
    await downloadFile(urlImage, path);
    return path;
  } catch (e) {
    console.log("❌ Error in getAnime:", e);
    return null;
  }
};

module.exports.run = async function ({ event, api, args, getText }) {
  const { createReadStream, unlinkSync, readFileSync } = global.nodemodule["fs-extra"];
  const { threadID, messageID } = event;

  const animeData = JSON.parse(readFileSync(await global.utils.assets.data("ANIME")));

  if (!animeData.hasOwnProperty(args[0])) {
    const list = Object.keys(animeData);
    return api.sendMessage(getText("addTags", list.join(", ")), threadID, messageID);
  }

  try {
    const path = await this.getAnime(args[0]);
    if (!path) return api.sendMessage("❌ Failed to fetch image.", threadID, messageID);
    return api.sendMessage({ attachment: createReadStream(path) }, threadID, () => unlinkSync(path), messageID);
  } catch (e) {
    console.log("❌ Error sending image:", e);
  }
};
