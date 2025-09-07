const Ticket = require('../models/ticketModel.js').default;
const { User } = require('../models/userModel.js');
const path = require('path');
const fs = require('fs');

const activeJourneyTimeouts = new Map(); // Map to store timeout IDs: ticketId -> timeoutId
const MAX_JOURNEY_TIME_MINUTES = 10 / 60; // 10 seconds for testing (converted to minutes)

// Base HTML structure for pages - MOVED OUTSIDE FUNCTION
const baseHtml = (title, heading, buttonHtml = '') => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
          body { font-family: sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; background-color: #f0f8ff; }
          h1 { color: ${title.includes('Started') ? '#4CAF50' : title.includes('Ended') ? '#f44336' : '#ff9800'}; }
          .button-container { margin-top: 20px; }
          .scan-button {
              padding: 10px 20px;
              font-size: 18px;
              cursor: pointer;
              background-color: #007bff;
              color: white;
              border: none;
              border-radius: 5px;
              text-decoration: none;
          }
      </style>
  </head>
  <body>
      <h1>${heading}</h1>
      ${buttonHtml}
  </body>
  </html>
`;

exports.scanQrCode = async (req, res) => {
  try {
    const { ticketId } = req.query;
    console.log('QR Scan Request received for ticketId:', ticketId); // New log
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      console.log('Ticket not found for ID:', ticketId); // New log
      return res.status(404).send(baseHtml('Invalid Ticket', 'Invalid Ticket'));
    }

    console.log('Ticket found:', ticket); // New log - show ticket state before logic
    const now = new Date();
    const scanUrl = `/api/qr/scan?ticketId=${ticketId}`;

    if (!ticket.scannedAt) {
      // First scan
      console.log('First scan detected for ticket:', ticket._id); // New log
      ticket.journeyStartTime = now;
      ticket.scannedAt = now;
      await ticket.save();
      console.log('Ticket after first scan save:', ticket); // New log

      // Start countdown for fine if not scanned again
      console.log(`Countdown started for ticket ${ticket._id}. Fine will be applied in ${MAX_JOURNEY_TIME_MINUTES} minute(s) if not scanned again.`);
      const timeoutId = setTimeout(async () => {
        const updatedTicket = await Ticket.findById(ticket._id);
        if (updatedTicket && !updatedTicket.journeyEndTime) {
          // Journey not ended, apply fine
          const fineAmount = 50; // Example fine amount
          updatedTicket.fine = (updatedTicket.fine || 0) + fineAmount;
          await updatedTicket.save();
          console.log(`Fine of ${fineAmount} applied to ticket ${updatedTicket._id}. Journey not ended within ${MAX_JOURNEY_TIME_MINUTES} minute(s).`);

          const user = await User.findById(updatedTicket.user);
          if (user) {
            user.fine = (user.fine || 0) + fineAmount;
            await user.save();
            console.log(`User ${user._id} fine updated to ${user.fine}.`);
          }
        }
        activeJourneyTimeouts.delete(ticket._id.toString());
      }, MAX_JOURNEY_TIME_MINUTES * 60 * 1000);

      activeJourneyTimeouts.set(ticket._id.toString(), timeoutId);

      const button = `<div class="button-container"><a href="${scanUrl}" class="scan-button">End Journey</a></div>`;
      res.send(baseHtml('Journey Started', 'Journey Started', button));
    } else if (!ticket.journeyEndTime) {
      // Second scan
      console.log('Second scan detected for ticket:', ticket._id); // New log
      ticket.journeyEndTime = now;

      // Clear the timeout for this ticket
      const timeoutId = activeJourneyTimeouts.get(ticket._id.toString());
      if (timeoutId) {
        clearTimeout(timeoutId);
        activeJourneyTimeouts.delete(ticket._id.toString());
        console.log(`Countdown cleared for ticket ${ticket._id}. Journey ended.`);
      }

      await ticket.save();
      console.log('Ticket after second scan save:', ticket); // New log
      const button = `<div class="button-container"><a href="${scanUrl}" class="scan-button">Scan Again (Invalid)</a></div>`;
      res.send(baseHtml('Journey Ended', 'Journey Ended', button));
    } else {
      // Already scanned twice
      console.log('Ticket already scanned twice:', ticket._id); // New log
      res.send(baseHtml('Invalid Ticket', 'Invalid Ticket'));
    }
  } catch (error) {
    console.error('Error in scanQrCode:', error);
    res.status(500).send(baseHtml('Error', 'An error occurred'));
  }
};