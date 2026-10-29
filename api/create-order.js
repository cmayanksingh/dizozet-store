const https = require('https');

const APP_ID = process.env.CASHFREE_APP_ID;
const SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const API_VERSION = '2023-08-01';

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!APP_ID || !SECRET_KEY) {
    return res.status(500).json({ error: 'Cashfree credentials not configured in environment variables' });
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

    const postData = JSON.stringify({
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
        return_url: 'https://www.dizozet.shop/?order_id={order_id}'
      },
      order_note: 'Dizozet Reels Bundle Order'
    });

    const options = {
      hostname: 'api.cashfree.com',
      port: 443,
      path: '/pg/orders',
      method: 'POST',
      headers: {
        'x-client-id': APP_ID,
        'x-client-secret': SECRET_KEY,
        'x-api-version': API_VERSION,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const response = await new Promise((resolve, reject) => {
      const request = https.request(options, (resp) => {
        let data = '';
        resp.on('data', chunk => data += chunk);
        resp.on('end', () => {
          try {
            resolve({ statusCode: resp.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ statusCode: resp.statusCode, data });
          }
        });
      });
      request.on('error', reject);
      request.write(postData);
      request.end();
    });

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return res.status(200).json({
        success: true,
        order_id: response.data.order_id,
        payment_session_id: response.data.payment_session_id,
        order_amount: response.data.order_amount
      });
    } else {
      return res.status(response.statusCode).json({
        success: false,
        error: response.data.message || 'Cashfree order creation failed',
        details: response.data
      });
    }
  } catch (error) {
    console.error('Serverless error:', error);
    return res.status(500).json({ error: error.message });
  }
};
