
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const API = import.meta.env.VITE_API_URL;

const PaymentSuccess = () => {
  const { t } = useTranslation();
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
        console.log('API response ticket data:', res.data);
      } catch (err) {
        setError('Failed to fetch ticket details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  if (loading) {
    return <div className="container mx-auto p-4">{t('loading')}</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-2xl font-bold mb-4">{t('payment_successful')}!</h1>
      {ticket && (
        <div className="bg-white p-6 rounded-lg shadow-md flex">
          <div className="w-1/2 pr-4">
            <h2 className="text-2xl font-semibold mb-4">{t('your_ticket_details')}</h2>
            <p className="text-lg"><strong>{t('ticket_id')}</strong> {ticket._id}</p>
            <p className="text-lg"><strong>{t('from')}</strong> {ticket.schedule.sourceStation}</p>
            <p className="text-lg"><strong>{t('to')}</strong> {ticket.schedule.destinationStation}</p>
            <p className="text-lg"><strong>{t('fare')}</strong> {ticket.amount} {t('bdt')}</p>
            <p className="text-lg"><strong>{t('time_of_booking')}</strong> {new Date(ticket.createdAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
          {ticket.qrCode && (
            <div className="w-1/2 flex flex-col items-center justify-center">
              <h3 className="text-2xl font-semibold mb-4">{t('scan_qr_code')}</h3>
              <img src={ticket.qrCode} alt="Ticket QR Code" className="w-64 h-64" />
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = ticket.qrCode;
                  link.download = `ticket_qr_${ticket._id}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {t('download_qr_code')}
              </button>
              <button
                onClick={() => {
                  const scanUrl = `${API}/api/qr/scan?ticketId=${ticket._id}`;
                  window.open(scanUrl, '_blank');
                }}
                className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                {t('simulate_scan')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
