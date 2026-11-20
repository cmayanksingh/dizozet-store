export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }
    const { order, botToken: paramToken, chatId: paramChatId, isTest } = body || {};

    let botToken = (paramToken && typeof paramToken === 'string' && paramToken.trim()) || process.env.TELEGRAM_BOT_TOKEN;
    let chatId = (paramChatId && String(paramChatId).trim()) || process.env.TELEGRAM_CHAT_ID;

    // Automatic Server-Side Fallback: Lookup from Firestore settings/store_config
    if (!botToken || !chatId) {
      try {
        const firestoreRes = await fetch('https://firestore.googleapis.com/v1/projects/dizozet-store/databases/(default)/documents/settings/store_config');
        if (firestoreRes.ok) {
          const fsData = await firestoreRes.json();
          const fields = fsData.fields || {};
          const fsToken = fields.telegramBotToken?.stringValue?.trim();
          const fsChatId = fields.telegramChatId?.stringValue?.trim();
          if (!botToken && fsToken) {
            botToken = fsToken;
          }
          if (!chatId && fsChatId) {
            chatId = fsChatId;
          }
        }
      } catch (fsErr) {
        console.warn('Firestore fallback fetch settings in notify-telegram error:', fsErr);
      }
    }

    if (!botToken || !chatId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Telegram Bot Token or Chat ID is missing. Please configure them in the Admin Panel or environment variables.' 
      });
    }

    let messageText = '';

    if (isTest) {
      messageText = `🤖 <b>Dizozet Telegram Bot Connected Successfully!</b>\n\n` +
        `✅ <b>Status:</b> Ready to receive live order notifications!\n` +
        `🕒 <b>Time:</b> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n` +
        `🏬 <b>Store:</b> Dizozet Digital Store\n\n` +
        `Jab bhi koi client order karega, uska pura data (Name, Phone, Email, Items, Drive link) yahan aayega!`;
    } else if (order) {
      const customer = order.customer || {};
      const cleanPhone = (customer.phone || '').replace(/\D/g, '');
      const waPhone = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone;

      const itemsList = (order.items || []).map((item, idx) => {
        let line = `<b>${idx + 1}. ${escapeHtml(item.title || 'Product')}</b>\n` +
          `   • Type: ${escapeHtml(item.type || 'Digital Item')}\n` +
          `   • Plan/License: ${escapeHtml(item.planName || 'Standard')}\n` +
          `   • Price: ₹${item.price || 0}`;
        if (item.googleDriveLink || item.downloadUrl) {
          const rawLink = item.googleDriveLink || item.downloadUrl;
          line += `\n   • Drive Link: <a href="${escapeHtml(rawLink)}">Access Drive Folder</a>`;
        }
        return line;
      }).join('\n\n');

      messageText = `🛍️ <b>🚨 NEW ORDER RECEIVED!</b>\n\n` +
        `🆔 <b>Order ID:</b> <code>${escapeHtml(order.orderId || 'ORD-NEW')}</code>\n` +
        `💰 <b>Amount Paid:</b> <b>₹${order.total || 0}</b>\n` +
        `💳 <b>Payment Method:</b> ${escapeHtml(order.paymentMethod || 'Online Gateway')}\n` +
        `🔢 <b>Txn ID:</b> <code>${escapeHtml(order.transactionId || 'N/A')}</code>\n` +
        `🕒 <b>Date & Time:</b> ${new Date(order.date || Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n\n` +
        `👤 <b>CLIENT / CUSTOMER DETAILS:</b>\n` +
        `• <b>Name:</b> ${escapeHtml(customer.name || 'Not provided')}\n` +
        `• <b>Phone:</b> <a href="tel:${customer.phone}">${escapeHtml(customer.phone || 'N/A')}</a>\n` +
        `• <b>WhatsApp:</b> <a href="https://wa.me/${waPhone}">Click to Chat on WhatsApp</a>\n` +
        `• <b>Email:</b> ${escapeHtml(customer.email || 'N/A')}\n` +
        `• <b>City:</b> ${escapeHtml(customer.city || 'N/A')}\n\n` +
        `📦 <b>ITEMS PURCHASED (${order.items?.length || 0}):</b>\n\n` +
        `${itemsList}\n\n` +
        `⚡ <i>Delivered automatically via Dizozet Checkout</i>`;
    } else {
      return res.status(400).json({ success: false, error: 'No order or test payload provided.' });
    }

    let telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    let telegramData = await telegramRes.json();

    // Plain text fallback if HTML parsing fails (e.g., special characters in user input or link)
    if (!telegramData.ok) {
      console.warn('Telegram HTML send failed:', telegramData.description, '- Retrying with plain text fallback...');
      const plainText = messageText.replace(/<[^>]*>/g, '');
      telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: plainText,
          disable_web_page_preview: true
        })
      });
      telegramData = await telegramRes.json();
    }

    if (!telegramData.ok) {
      return res.status(400).json({ 
        success: false, 
        error: telegramData.description || 'Failed to send message via Telegram Bot API' 
      });
    }

    return res.status(200).json({ success: true, result: telegramData.result });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
