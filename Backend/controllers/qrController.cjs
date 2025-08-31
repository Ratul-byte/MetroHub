const Ticket = require('../models/ticketModel.js');
const User = require('../models/userModel.js');

exports.scanQrCode = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.body.ticketId);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const now = new Date();

    if (!ticket.scannedAt) {
      // First scan
      ticket.journeyStartTime = now;
      ticket.scannedAt = now;
      console.log(`First scan for ticket ${ticket._id} at ${now}`);
      await ticket.save();
      res.json({ message: 'Journey started' });
    } else {
      // Second scan
      console.log(`Second scan for ticket ${ticket._id} at ${now}`);
      ticket.journeyEndTime = now;

      const timeDiff = (now - ticket.journeyStartTime) / 1000 / 60; // in minutes

      if (timeDiff > 1) {
        const fine = Math.floor(timeDiff - 1) * 10;
        ticket.fine = fine;

        const user = await User.findById(ticket.user);
        if (user) {
          user.fine = (user.fine || 0) + fine;
          await user.save();
        }
      }

      await ticket.save();
      res.json({ message: 'Journey ended', fine: ticket.fine });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};