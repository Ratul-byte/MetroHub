import React from 'react';
import { startPayment } from '../services/paymentService';

export default function PaymentButton({ scheduleId, amount }) {
  const handlePay = async () => {
    try {
      const data = await startPayment(scheduleId, amount);
      if (data?.url) window.location.href = data.url;
      else console.error('No gateway url', data);
    } catch (err) {
      console.error('Payment error', err);
      alert('Payment initiation failed');
    }
  };

  return <button onClick={handlePay}>Pay {amount} BDT</button>;
}