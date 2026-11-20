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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!APP_ID || !SECRET_KEY) {
    return res.status(500).json({ error: 'Cashfree credentials not configured' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }
    const { amount, name, email, phone } = body || {};

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Invalid order amount' });
    }

    const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10) || '9876543210';
    const orderId = 'DZ_' + Date.now() + '_' + Math.floor(100 + Math.random() * 900);
    const orderAmount = Number(Number(amount).toFixed(2));

    const postData = {
      order_id: orderId,
      order_amount: orderAmount,
      order_currency: 'INR',
      customer_details: {
        customer_id: 'cust_' + cleanPhone,
        customer_name: (name || 'Customer').slice(0, 50),
        customer_email: (email || 'customer@dizozet.shop').slice(0, 50),
        customer_phone: cleanPhone
      },
      order_meta: {
        return_url: 'https://www.dizozet.shop/order-confirmation/{order_id}'
      },
      order_note: 'Dizozet Order'
    };

    const cashfreeRes = await fetch('https://api.cashfree.com/pg/orders', {
      method: 'POST',
      headers: {
        'x-client-id': APP_ID,
        'x-client-secret': SECRET_KEY,
        'x-api-version': API_VERSION,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });

    const responseData = await cashfreeRes.json();

    if (cashfreeRes.ok && responseData.payment_session_id) {
      return res.status(200).json({
        success: true,
        order_id: responseData.order_id,
        payment_session_id: responseData.payment_session_id,
        order_amount: responseData.order_amount
      });
    } else {
      return res.status(cashfreeRes.status || 400).json({
        success: false,
        error: responseData.message || 'Cashfree order creation failed',
        details: responseData
      });
    }
  } catch (error) {
    console.error('Serverless error:', error);
    return res.status(500).json({ error: error.message });
  }
}
