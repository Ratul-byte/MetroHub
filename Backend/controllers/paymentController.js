import axios from 'axios';
import QRCode from 'qrcode';
import Ticket from '../models/ticketModel.js';
import MetroSchedule from '../models/metroScheduleModel.js';

// v3 sandbox/session endpoint
const SSL_MODE = process.env.SSL_MODE || 'sandbox';
const INIT_URL = SSL_MODE === 'production'
  ? 'https://securepay.sslcommerz.com/gwprocess/v3/api.php'
  : 'https://sandbox.sslcommerz.com/gwprocess/v3/api.php';

const makeUrls = () => {
  const apiBase =  process.env.API_URL;
  return {
    success: `${apiBase}/api/payment/success`,
    fail: `${apiBase}/api/payment/fail`,
    cancel: `${apiBase}/api/payment/cancel`,
    ipn: `${apiBase}/api/payment/ipn`,
  };
};

export const initiatePayment = async (req, res) => {
  try {
    // Validate SSLCOMMERZ env early to provide a clear error
    if (!process.env.SSL_STORE_ID || !process.env.SSL_STORE_PASSWORD) {
      console.error('SSLCOMMERZ credentials missing. SSL_STORE_ID or SSL_STORE_PASSWORD not set.');
      return res.status(500).json({
        message: 'Payment gateway not configured. Set SSL_STORE_ID and SSL_STORE_PASSWORD in backend environment.'
      });
    }

    // log incoming request for debugging
    console.log('initiatePayment called, user:', req.user?._id || null);
    console.log('body:', JSON.stringify(req.body));

    let { scheduleId, segmentIds, amount } = req.body;

    if (!amount && amount !== 0) {
      return res.status(400).json({ message: 'amount required' });
    }

    // accept segmentIds[] as fallback
    if (!scheduleId && Array.isArray(segmentIds) && segmentIds.length > 0) {
      scheduleId = segmentIds[0];
    }

    if (!scheduleId) {
      return res.status(400).json({ message: 'scheduleId or segmentIds required' });
    }

    // ensure user is present
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const schedule = await MetroSchedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule (segment) not found' });
    }

    const tranId = `tran_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;

    const ticketData = {
      user: req.user._id,
      schedule: scheduleId,
      amount,
      transactionId: tranId,
      paymentStatus: 'pending',
      rawResponse: { initRequest: { scheduleId, segmentIds, amount } }
    };

    const ticket = await Ticket.create(ticketData);
    console.log('ticket created id=', ticket._id);

    const urls = makeUrls();
    const payload = {
      store_id: process.env.SSL_STORE_ID,
      store_passwd: process.env.SSL_STORE_PASSWORD,
      total_amount: amount,
      currency: 'BDT',
      tran_id: tranId,
      success_url: urls.success,
      fail_url: urls.fail,
      cancel_url: urls.cancel,
      ipn_url: urls.ipn,
      emi_option: 0,
      cus_name: req.user.name || 'Customer',
      cus_email: req.user.email || 'customer@example.com',
      cus_add1: '',
      cus_city: '',
      cus_country: 'Bangladesh',
      value_a: ticket._id.toString(),
    };


    console.log('SSL init keys:', Object.keys(payload));


    const params = new URLSearchParams();
    Object.entries(payload).forEach(([k, v]) => params.append(k, String(v ?? '')));

    let resp;
    try {
      resp = await axios.post(INIT_URL, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 15000,
      });
    } catch (axiosErr) {
      console.error('SSL init axios error:', axiosErr?.response?.data || axiosErr.message);
      ticket.rawResponse = { ...(ticket.rawResponse || {}), sslinitError: axiosErr?.response?.data || axiosErr.message };
      await ticket.save();
      return res.status(502).json({ message: 'Payment gateway error', details: axiosErr?.response?.data || axiosErr.message });
    }

    const data = resp.data || resp;
    // log non-sensitive part for debugging
    console.log('SSL init response status:', data.status, 'failedreason:', data.failedreason || '');
    const gatewayURL = data?.GatewayPageURL || data?.redirect_url || null;

    ticket.rawResponse = { ...(ticket.rawResponse || {}), sslinit: data };
    await ticket.save();

    if (!gatewayURL) {
      console.error('No gateway URL in response', data);
      return res.status(500).json({ message: 'No gateway URL returned from payment gateway', data });
    }

    return res.json({ url: gatewayURL });
  } catch (err) {
    console.error('initiatePayment error (unexpected):', err);
    return res.status(500).json({ message: 'Payment initiation failed', error: err.message });
  }
};

const findTicketByTran = async (tran_id, value_a) => {
  let ticket = await Ticket.findOne({ transactionId: tran_id });
  if (!ticket && value_a) ticket = await Ticket.findById(value_a);
  return ticket;
};

export const sslcommerzSuccess = async (req, res) => {
  try {
    const body = req.body || req.query;
    const tran_id = body.tran_id || body.tran_id;
    const value_a = body.value_a;
    const ticket = await findTicketByTran(tran_id, value_a);
    if (!ticket) return res.status(404).send('Ticket not found');

    ticket.paymentStatus = 'paid';
    ticket.rawResponse = { ...(ticket.rawResponse || {}), success: body };
    const qr = await QRCode.toDataURL(ticket._id.toString());
    ticket.qrCode = qr;
    await ticket.save();

    const frontend = process.env.FRONTEND_URL;
    const redirectUrl = `${frontend}/payment-success?ticket=${ticket._id}`;

    // Send an HTML page with a JavaScript redirect
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Redirecting...</title>
          <script>
            window.location.href = "${redirectUrl}";
          </script>
        </head>
        <body>
          <p>Payment successful. Redirecting to your ticket...</p>
          <p>If you are not redirected automatically, <a href="${redirectUrl}">click here</a>.</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('sslcommerzSuccess error', err);
    return res.status(500).send('success handler error');
  }
};

export const sslcommerzFail = async (req, res) => {
  try {
    const body = req.body || req.query;
    const tran_id = body.tran_id;
    const ticket = await Ticket.findOne({ transactionId: tran_id });
    if (ticket) {
      ticket.paymentStatus = 'failed';
      ticket.rawResponse = { ...(ticket.rawResponse || {}), fail: body };
      await ticket.save();
    }
    const frontend = process.env.FRONTEND_URL;
    return res.redirect(`${frontend}/payment-failed?ticket=${ticket?._id || ''}`);
  } catch (err) {
    console.error('sslcommerzFail error', err);
    return res.status(500).send('fail handler error');
  }
};

export const sslcommerzCancel = async (req, res) => {
  try {
    const body = req.body || req.query;
    const tran_id = body.tran_id;
    const ticket = await Ticket.findOne({ transactionId: tran_id });
    if (ticket) {
      ticket.paymentStatus = 'cancelled';
      ticket.rawResponse = { ...(ticket.rawResponse || {}), cancel: body };
      await ticket.save();
    }
    const frontend = process.env.FRONTEND_URL;
    return res.redirect(`${frontend}/payment-cancelled?ticket=${ticket?._id || ''}`);
  } catch (err) {
    console.error('sslcommerzCancel error', err);
    return res.status(500).send('cancel handler error');
  }
};

export const sslcommerzIPN = async (req, res) => {
  try {
    const body = req.body || {};
    const tran_id = body.tran_id || body.tran_id;
    const ticket = await Ticket.findOne({ transactionId: tran_id });
    if (!ticket) return res.status(404).send('Ticket not found');

    if (body.status && body.status.toLowerCase() === 'success') {
      ticket.paymentStatus = 'paid';
      const qr = await QRCode.toDataURL(ticket._id.toString());
      ticket.qrCode = qr;
    } else {
      ticket.paymentStatus = 'failed';
    }
    ticket.rawResponse = { ...(ticket.rawResponse || {}), ipn: body };
    await ticket.save();

    return res.status(200).send('IPN received');
  } catch (err) {
    console.error('sslcommerzIPN error', err);
    return res.status(500).send('ipn handler error');
  }
};