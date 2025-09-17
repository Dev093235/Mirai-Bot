const fs = require("fs");
const request = require("request");

module.exports.config = {
  name: "hack",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Tag someone to generate a hacked-style image",
  commandCategory: "fun",
  usages: "@mention",
  dependencies: {
    "axios": "",
    "fs-extra": ""
  },
  cooldowns: 0
};

module.exports.wrapText = (ctx, name, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(name).width < maxWidth) return resolve([name]);
    if (ctx.measureText('W').width > maxWidth) return resolve(null);
    const words = name.split(' ');
    const lines = [];
    let line = '';
    while (words.length > 0) {
      let split = false;
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
        else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
};

module.exports.run = async function ({ args, Users, api, event }) {
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];

  const pathImg = __dirname + "/cache/background.png";
  const pathAvt = __dirname + "/cache/avatar.png";

  const id = Object.keys(event.mentions)[0] || event.senderID;
  const name = await Users.getNameUser(id);

  const backgrounds = [
    "https://i.imgur.com/VXXK2Oy.jpeg"
  ];
  const selectedBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

  // 🖼 Get avatar
  const avatarBuffer = (
    await axios.get(`https://graph.facebook.com/${id}/picture?width=720&height=720`, {
      responseType: "arraybuffer"
    })
  ).data;
  fs.writeFileSync(pathAvt, Buffer.from(avatarBuffer, "utf-8"));

  // 🖼 Get background
  const bgBuffer = (
    await axios.get(selectedBg, {
      responseType: "arraybuffer"
    })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(bgBuffer, "utf-8"));

  const baseImage = await loadImage(pathImg);
  const avatarImage = await loadImage(pathAvt);

  const canvas = createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.font = "400 23px Arial";
  ctx.fillStyle = "#1878F3";
  ctx.textAlign = "start";

  const lines = await this.wrapText(ctx, name, 1160);
  ctx.fillText(lines.join('\n'), 200, 497);
  ctx.beginPath();

  ctx.drawImage(avatarImage, 83, 437, 100, 101);

  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvt);

  return
