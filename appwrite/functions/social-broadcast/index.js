// ─── Social Broadcast Function ──────────────────────────────
// Appwrite Function: Triggered on incident document update
// Event: databases.*.collections.[INCIDENTS].documents.*.update
//
// When an incident transitions from 'reported' → 'verified',
// broadcasts an alert to Telegram with the public URL.

const DOMAIN = process.env.PUBLIC_DOMAIN || 'https://nyayfauj.org';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

const CATEGORY_EMOJI = {
  recruitment: '🎯',
  propaganda: '📢',
  meeting: '🤝',
  surveillance: '👁️',
  harassment: '⚠️',
  other: '📋',
};

const SEVERITY_EMOJI = {
  low: '🟢',
  medium: '🟡',
  high: '🟠',
  critical: '🔴',
};

/**
 * @param {{ req: object, res: object, log: Function, error: Function }} context
 */
module.exports = async ({ req, res, log, error }) => {
  try {
    // ─── 1. Parse event payload ───────────────────────────
    const payload = JSON.parse(req.body || '{}');
    const eventData = payload.$id ? payload : (payload.document || payload);

    if (!eventData || !eventData.$id) {
      log('No valid document in payload — skipping');
      return res.empty();
    }

    // ─── 2. Check status transition ───────────────────────
    // The function fires on every document update.
    // We only proceed if the new status is 'verified'.
    const newStatus = eventData.status;

    if (newStatus !== 'verified') {
      log(`Status is '${newStatus}' — not 'verified'. Skipping broadcast.`);
      return res.empty();
    }

    // ─── 3. Construct the message ─────────────────────────
    const category = eventData.category || 'other';
    const severity = eventData.severity || 'medium';
    const title = eventData.title || 'Untitled Incident';
    const description = (eventData.description || '').substring(0, 200);
    const publicUrl = `${DOMAIN}/p/${eventData.$id}`;

    const catEmoji = CATEGORY_EMOJI[category] || '📋';
    const sevEmoji = SEVERITY_EMOJI[severity] || '🟡';

    const message = [
      `${sevEmoji} *NyayFauj Alert — Verified*`,
      ``,
      `${catEmoji} *${category.charAt(0).toUpperCase() + category.slice(1)}*: ${title}`,
      ``,
      description ? `_${description}${description.length >= 200 ? '...' : ''}_` : '',
      ``,
      `🔗 [View Full Report](${publicUrl})`,
      ``,
      `📍 Okhla, New Delhi`,
      `🕐 ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
    ].filter(Boolean).join('\n');

    // ─── 4. Send to Telegram ──────────────────────────────
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      log('⚠️  Telegram credentials not configured. Message would have been:');
      log(message);
      return res.json({ success: true, broadcast: 'skipped', reason: 'no_credentials' });
    }

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const telegramRes = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: false,
      }),
    });

    const telegramData = await telegramRes.json();

    if (telegramData.ok) {
      log(`✅ Telegram broadcast sent for incident ${eventData.$id}`);
    } else {
      error(`❌ Telegram API error: ${JSON.stringify(telegramData)}`);
    }

    return res.json({
      success: true,
      broadcast: 'telegram',
      incidentId: eventData.$id,
      publicUrl,
    });
  } catch (err) {
    error(`Function error: ${err.message || err}`);
    return res.json({ success: false, error: err.message || 'Unknown error' });
  }
};
