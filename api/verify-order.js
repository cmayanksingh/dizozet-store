const https = require('https');

const APP_ID = process.env.CASHFREE_APP_ID;
const SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const API_VERSION = '2023-08-01';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!APP_ID || !SECRET_KEY) {
    return res.status(500).json({ error: 'Cashfree credentials not configured in environment variables' });
  }

  const { order_id } = req.query || {};
  if (!order_id) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  try {
    const options = {
      hostname: 'api.cashfree.com',
      port: 443,
      path: '/pg/orders/' + encodeURIComponent(order_id),
      method: 'GET',
      headers: {
        'x-client-id': APP_ID,
        'x-client-secret': SECRET_KEY,
        'x-api-version': API_VERSION,
        'Content-Type': 'application/json'
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
      request.end();
    });

    if (response.statusCode === 200) {
      return res.status(200).json({
        success: true,
        order_id: response.data.order_id,
        order_status: response.data.order_status,
        order_amount: response.data.order_amount,
        customer_details: response.data.customer_details
      });
    } else {
      return res.status(response.statusCode).json({
        success: false,
        error: response.data.message || 'Failed to verify order'
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
