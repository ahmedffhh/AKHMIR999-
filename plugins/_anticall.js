const delay = time => new Promise(res => setTimeout(res, time));

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
    let bot = global.db.data.settings[this.user.jid] || {};

    // التحقق مما إذا كانت الرسالة قادمة من مكتبة "Baileys" أو إذا كانت دردشة antiCall معطلة.
    if (m.isBaileys) return;
    if (!bot.antiCall) return;

    // إنشاء رسالة تذكير بالمرسل للرسالة الواردة.
    const mentionSender = `🧙‍♂️ @${m.sender.split('@')[0]} 🧙‍♂️`;

    // تحديد أنواع الرسائل المختلفة ورسائلها المقابلة.
    const messageType = {
        40: '📞 لقد فاتك مكالمة صوتية، ولقد تم تفويت المكالمة.',
        41: '📹 لقد فاتك مكالمة فيديو، ولقد تم تفويت المكالمة.',
        45: '📞 لقد فاتك مكالمة صوتية في المجموعة، ولقد تم تفويت المكالمة.',
        46: '📹 لقد فاتك مكالمة فيديو في المجموعة، ولقد تم تفويت المكالمة.'
    }[m.messageStubType];

    // إذا تم العثور على نوع الرسالة، أرسل رسالة إلى الدردشة.
    if (messageType) {
        // إرسال رسالة تذكير بالمرسل ونوع الرسالة.
        await conn.sendMessage(m.chat, { text: `تم منعك من استخدام البوت بسبب خرق لاحد قوانين البوت *"يمنع الاتصال ب البوت مكالمة صوتية"* جرب الاتصال ا ب احد المطورين ل رفع الحضر.`, mentions: [m.sender] });

        // إرسال رسالة تحذير تشير إلى أن المستخدم قد تم حظره وحظره وتحذيره وطرده.

        // الانتظار لفترة معينة.
        await delay(1000);

        // تحديث حالة المستخدم إلى محظور ومنحهم تحذير.
        global.db.data.users[m.sender].banned = true;
        global.db.data.users[m.sender].warning = 1;

        // حظر المستخدم من إرسال الرسائل إلى البوت.
        await conn.updateBlockStatus(m.sender, "block");

        // إذا كانت الرسالة قادمة من مجموعة، قم بإزالة المرسل من المجموعة.
        if (m.isGroup) {
            await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove");
        }
    } else {
        // إذا لم يتم التعرف على نوع الرسالة، قم بتسجيل معلومات حولها.
        console.log({ messageStubType: m.messageStubType, messageStubParameters: m.messageStubParameters, type: m.messageStubType });
    }
}

// تعطيل الأمر إذا كانت القيمة متاحة وتكون true.
export const disabled = false;