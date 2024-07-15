const handler = async (m, {text, conn, usedPrefix, command}) => {
  const why = `*قم بالرد على الشخص الذي تريد حظره*\n*—◉ ${usedPrefix + command} @${m.sender.split('@')[0]}*`;
  const who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false;
  if (!who) conn.reply(m.chat, why, m, {mentions: [m.sender]});
  const res = [];
  switch (command) {
    case 'blok': case 'b':
      if (who) {
        await conn.updateBlockStatus(who, 'block').then(() => {
          res.push(who);
        });
      } else conn.reply(m.chat, why, m, {mentions: [m.sender]});
      break;
    case 'unblok': case 'unblock':
      if (who) {
        await conn.updateBlockStatus(who, 'unblock').then(() => {
          res.push(who);
        });
      } else conn.reply(m.chat, why, m, {mentions: [m.sender]});
      break;
  }
  if (res[0]) conn.reply(m.chat, `*[❗] 𝚂𝙴 𝚄𝚂𝙾 𝙲𝙾𝙽 𝙴𝚇𝙸𝚃𝙾 𝙴𝙻 𝙲𝙾𝙼𝙰𝙽𝙳𝙾 ${command} 𝙿𝙰𝚁𝙰 𝙴𝙻 𝚄𝚂𝚄𝙰𝚁𝙸𝙾/𝙰 ${res ? `${res.map((v) => '@' + v.split('@')[0])}` : ''}*`, m, {mentions: res});
};
handler.command = /^(b|unblock)$/i;
handler.rowner = true;
export default handler;
