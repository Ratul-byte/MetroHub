const API = import.meta.env.VITE_API_URL;

export async function startPayment(scheduleId, amount) {
  const res = await fetch(`${API}/api/payment/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // for cookies
    body: JSON.stringify({ scheduleId, amount })
  });
  if (!res.ok) throw new Error(`Payment init failed: ${res.status}`);
  return res.json(); // { url: gatewayURL }
}