//Script by ShirokamiRyzen

import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {

    if (!args[0]) throw 'المرجو إرسال Url الفيديو الذي تريد تحميله من البوت مع الأمر \n fb + Url';
    const sender = m.sender.split(`@`)[0];

    m.reply(wait);

    try {
        const url = args[0];
        const apiUrl = `https://widipe.com/download/fbdl?url=${url}`;
        let response = await fetch(apiUrl);
        let result = await response.json();

        if (!result || !result.status || !result.result || (!result.result.HD && !result.result.Normal_video)) {
            // Try the second API if the first one fails
            const backupApiUrl = `https://widipe.com/download/fbdown?url=${url}`;
            response = await fetch(backupApiUrl);
            result = await response.json();

            if (!result || !result.status || !result.result || !result.result.url) {
                throw 'Failed to fetch video details from both APIs';
            }

            const videoLink = result.result.url.isHdAvailable ? result.result.url.urls[0].hd : result.result.url.urls[1].sd;
            const caption = `
*Title*: ${result.result.title || 'No title'}

> *تابعني على إنستجرام من هنا* \n https://instagram.com/7vkoq`;

            const videoBuffer = await fetch(videoLink).then(res => res.buffer());

            await conn.sendMessage(
                m.chat, {
                video: videoBuffer,
                mimetype: "video/mp4",
                fileName: `video.mp4`,
                caption: `Ini kak videonya @${sender} \n${caption}`,
                mentions: [m.sender],
            }, {
                quoted: m
            });
        } else {
            // Handle the first API response
            const videoLink = result.result.HD || result.result.Normal_video;
            const caption = `
*Title*: ${result.result.title || 'No title'}

> *تابعني على إنستجرام من هنا* \n https://instagram.com/7vkoq`;

            const videoBuffer = await fetch(videoLink).then(res => res.buffer());

            await conn.sendMessage(
                m.chat, {
                video: videoBuffer,
                mimetype: "video/mp4",
                fileName: `video.mp4`,
                caption: `Ini kak videonya @${sender} \n${caption}`,
                mentions: [m.sender],
            }, {
                quoted: m
            });
        }
    } catch (error) {
        console.error('Handler Error:', error);
        conn.reply(m.chat, `An error occurred: ${error}`, m);
    }
};

handler.help = ['fb <url>'];
handler.tags = ['downloader'];
handler.command = /^(fbdownload|facebook|fb(dl)?)$/i;

handler.register = false;

export default handler;