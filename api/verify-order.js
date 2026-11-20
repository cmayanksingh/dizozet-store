const APP_ID = process.env.CASHFREE_APP_ID || '1495948439669a2ddbdd5af37fc8495941';
const SECRET_KEY = process.env.CASHFREE_SECRET_KEY || Buffer.from('Y2Zza19tYV9wcm9kXzk4N2EwZWIzYWY1NjM1MDFlZDRlYTkwZjJkYjliYzg5X2M1OWU4OGFm', 'base64').toString('utf-8');
const API_VERSION = '2023-08-01';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const orderId = req.query?.order_id || req.body?.order_id;

  if (!orderId) {
    return res.status(400).json({ error: 'Missing order_id' });
  }

  try {
    const cashfreeRes = await fetch(`https://api.cashfree.com/pg/orders/${encodeURIComponent(orderId)}`, {
      method: 'GET',
      headers: {
        'x-client-id': APP_ID,
        'x-client-secret': SECRET_KEY,
        'x-api-version': API_VERSION,
        'Content-Type': 'application/json'
      }
    });

    const data = await cashfreeRes.json();

    if (cashfreeRes.ok) {
      return res.status(200).json({
        success: true,
        order_status: data.order_status,
        order_id: data.order_id,
        order_amount: data.order_amount,
        data
      });
    } else {
      return res.status(cashfreeRes.status || 400).json({
        success: false,
        error: data.message || 'Failed to verify order status',
        data
      });
    }
  } catch (error) {
    console.error('Verify error:', error);
    return res.status(500).json({ error: error.message });
  }
}
