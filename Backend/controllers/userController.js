
import Ticket from '../models/ticketModel.js';

export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId).populate('schedule');
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Optional: Check if the ticket belongs to the authenticated user
    if (ticket.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You do not have access to this ticket' });
    }

    res.json(ticket);
  } catch (err) {
    console.error('getTicketById error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id }).populate('schedule').sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error('getAllUserTickets error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
