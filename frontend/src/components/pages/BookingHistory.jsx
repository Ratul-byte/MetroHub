
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const BookingHistory = () => {
  const { t } = useTranslation();
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [ticketsError, setTicketsError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      if (user && token) {
        try {
          setLoadingTickets(true);
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/tickets`, {
            headers: {
              'x-auth-token': token,
            },
          });
          setTickets(response.data.slice(0, 30)); // Get the last 30 tickets
        } catch (err) {
          setTicketsError(err.response?.data?.message || t('failed_to_fetch_ticket_details'));
        } finally {
          setLoadingTickets(false);
        }
      }
    };
    fetchTickets();
  }, [user, token, t]);

  if (!user) {
    return null; // Don't render if user is not logged in
  }

  return (
    <section id="my-tickets" className="py-16 lg:py-24 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl text-foreground text-center mb-8">
          {t('recent_booking_history')}
        </h2>
        {loadingTickets ? (
          <div className="text-center">{t('loading')}</div>
        ) : ticketsError ? (
          <div className="text-center text-red-500">{ticketsError}</div>
        ) : tickets.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="bg-white p-6 rounded-lg shadow-md">
                <p><strong>{t('ticket_id')}</strong> {ticket._id}</p>
                <p><strong>{t('train')}</strong> {ticket.schedule.trainName}</p>
                <p><strong>{t('from')}</strong> {ticket.schedule.sourceStation}</p>
                <p><strong>{t('to')}</strong> {ticket.schedule.destinationStation}</p>
                <p><strong>{t('departure')}</strong> {ticket.schedule.departureTime}</p>
                <p><strong>{t('arrival')}</strong> {ticket.schedule.arrivalTime}</p>
                <p><strong>{t('fare')}</strong> {ticket.amount} {t('bdt')}</p>
                <p><strong>{t('status')}</strong> {ticket.paymentStatus}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">{t('no_tickets_found')}</p>
        )}
      </div>
    </section>
  );
};

export default BookingHistory;
