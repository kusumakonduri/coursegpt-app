// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Your ALTCHA API credentials
const ALTCHA_API_KEY = 'ckey_01d6e102bdaf4b1689fa9e712422'; // Your ALTCHA API key
const ALTCHA_SECRET = 'csec_ec80fd56dde51626d9c02d12a47d0ffd9aa8c65338a37661'; // Your ALTCHA secret

// POST route to verify CAPTCHA response
app.post('/verify-captcha', async (req, res) => {
  const { captchaResponse } = req.body; // Captcha response sent from client

  if (!captchaResponse) {
    return res.status(400).json({ error: 'Captcha response is required' });
  }

  try {
    // Make a POST request to ALTCHA to verify the CAPTCHA response
    const response = await axios.post('https://altcha.org/api/v1/verify', {
      apiKey: ALTCHA_API_KEY,
      secret: ALTCHA_SECRET,
      captchaResponse,
    });

    // If the verification is successful
    if (response.data.success) {
      return res.json({ success: true, message: 'Captcha verification successful' });
    } else {
      return res.status(400).json({ error: 'Captcha verification failed' });
    }
  } catch (error) {
    // Handle errors from the ALTCHA API or server-side issues
    console.error('Error verifying CAPTCHA:', error);
    return res.status(500).json({ error: 'Error verifying CAPTCHA' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
