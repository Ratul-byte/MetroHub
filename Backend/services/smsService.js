
//import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

//const client = twilio(accountSid, authToken);

export const sendSms = async (to, body) => {
  try {
    await client.messages.create({
      body,
      from: twilioPhoneNumber,
      to,
    });
    console.log('SMS sent successfully');
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};
