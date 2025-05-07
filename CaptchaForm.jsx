import React, { useState } from 'react';
import axios from 'axios';

const CaptchaForm = () => {
  const [captchaResponse, setCaptchaResponse] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const handleCaptchaVerification = async () => {
    try {
      const response = await axios.post('http://localhost:5000/verify-captcha', {
        captchaResponse, // Captcha response
      });

      if (response.data.success) {
        setIsVerified(true);
        setError('');
        console.log('CAPTCHA Verified!');
        // Continue with form submission or other actions
      } else {
        setError('CAPTCHA verification failed!');
      }
    } catch (err) {
      setError('Error while verifying CAPTCHA.');
    }
  };

  return (
    <div>
      <h3>Captcha Verification Form</h3>
      {/* Add your ALTCHA CAPTCHA widget here */}
      <input
        type="text"
        value={captchaResponse}
        onChange={(e) => setCaptchaResponse(e.target.value)}
        placeholder="Enter CAPTCHA response"
      />
      <button onClick={handleCaptchaVerification}>Verify CAPTCHA</button>
      {isVerified && <p>CAPTCHA Verified Successfully!</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default CaptchaForm;
