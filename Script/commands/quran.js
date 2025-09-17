const moment = require("moment-timezone");

module.exports.config = {
  name: "mantra",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Rudra",
  description: "🔱 Listen to Hindu mantras and devotional chants",
  commandCategory: "spiritual",
  usages: "",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.languages = {
  en: {
    noMoney: "❌ You need at least ₹100 to listen to a mantra.",
    success: "🔱 Playing a sacred Hindu mantra..."
  }
};

module.exports.run = async ({ api, event, Currencies, getText }) => {
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];

  const audioLinks = [
    "https://audio.jukehost.co.uk/OmNamahShivaya.mp3",
    "https://audio.jukehost.co.uk/GayatriMantra.mp3",
    "https://audio.jukehost.co.uk/HanumanChalisa.mp3",
    "https://audio.jukehost.co.uk/MahaMrityunjaya.mp3",
    "https://audio.jukehost.co.uk/VishnuSahasranama.mp3",
    "https://audio.jukehost.co.uk/DurgaKavach.mp3",
    "https://audio.jukehost.co.uk/ShreeRamJaiRam.mp3",
    "https://audio.jukehost.co.uk/KrishnaGovindGovind.mp3"
  ];

  const { senderID, threadID, messageID } = event;
  const data = await Currencies.getData(senderID);
  const money = data.money || 0;

  if (money < 100) {
    return api.sendMessage(getText("noMoney"), threadID, messageID);
  }

  await Currencies.setData(senderID, { money: money - 100 });

  const selectedAudio = audioLinks[Math.floor(Math.random() * audioLinks.length)];
  const filePath = __dirname + "/cache/mantra.mp3";

  const callback = () => {
    api.sendMessage(
      { body: getText("success"), attachment: fs.createReadStream(filePath) },
      threadID,
      () => fs.unlinkSync(filePath),
      messageID
    );
  };

  request(encodeURI(selectedAudio))
    .pipe(fs.createWriteStream(filePath))
    .on("close", callback)
    .on("error", (e) => {
      console.error(e);
      api.sendMessage("❌ Error while downloading the mantra.", threadID, messageID);
    });
};
