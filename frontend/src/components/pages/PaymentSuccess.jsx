
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const ticketId = searchParams.get('ticket');
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      if (!ticketId) {
        setError('No ticket ID found in URL.');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API}/api/user/tickets/${ticketId}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });
        setTicket(res.data);
      } catch (err) {
        setError('Failed to fetch ticket details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
      {ticket && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Your Ticket Details</h2>
          <p><strong>Ticket ID:</strong> {ticket._id}</p>
          <p><strong>Train:</strong> {ticket.schedule.trainName}</p>
          <p><strong>From:</strong> {ticket.schedule.sourceStation}</p>
          <p><strong>To:</strong> {ticket.schedule.destinationStation}</p>
          <p><strong>Departure:</strong> {ticket.schedule.departureTime}</p>
          <p><strong>Arrival:</strong> {ticket.schedule.arrivalTime}</p>
          <p><strong>Fare:</strong> {ticket.amount} BDT</p>
          {ticket.qrCode && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Your QR Code:</h3>
              <img src={ticket.qrCode} alt="Ticket QR Code" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
