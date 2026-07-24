import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { phone, countryCode } = await req.json();

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Mobile number is required' }, { status: 400 });
    }

    // Strip non-digits and leading zero if present
    let cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.startsWith('0')) {
      cleanedPhone = cleanedPhone.substring(1);
    }

    const cCode = countryCode || '+966';
    const fullPhoneNumber = `${cCode}${cleanedPhone}`;
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Check for SMS Gateway Keys
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;
    const textbeltKey = process.env.TEXTBELT_KEY || 'textbelt';

    let smsSent = false;
    let smsMessage = '';
    let gatewayUsed = '';

    // 1. Try Twilio API if credentials are set
    if (accountSid && authToken && fromPhone) {
      try {
        const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
        const params = new URLSearchParams({
          To: fullPhoneNumber,
          From: fromPhone,
          Body: `Your Royal Supermarket verification code is: ${otpCode}`,
        });

        const twilioRes = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
          }
        );

        if (twilioRes.ok) {
          smsSent = true;
          gatewayUsed = 'Twilio';
          smsMessage = `Real SMS sent via Twilio to ${fullPhoneNumber}`;
        } else {
          const errData = await twilioRes.json();
          smsMessage = `Twilio error: ${errData.message || 'Failed'}`;
        }
      } catch (err: any) {
        smsMessage = `Twilio error: ${err.message}`;
      }
    }

    // 2. Try Textbelt Free Gateway API if Twilio wasn't used or failed
    if (!smsSent) {
      try {
        const textbeltRes = await fetch('https://textbelt.com/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: fullPhoneNumber,
            message: `Royal Supermarket verification code: ${otpCode}`,
            key: textbeltKey,
          }),
        });

        const textbeltData = await textbeltRes.json();
        if (textbeltData.success) {
          smsSent = true;
          gatewayUsed = 'Textbelt Gateway';
          smsMessage = `Real SMS sent to ${fullPhoneNumber} (Quota remaining: ${textbeltData.quotaRemaining})`;
        } else {
          smsMessage = `SMS Gateway notice: ${textbeltData.error || 'Daily free SMS limit reached for this IP.'}`;
        }
      } catch (err: any) {
        smsMessage = `Textbelt error: ${err.message}`;
      }
    }

    return NextResponse.json({
      success: true,
      otpCode,
      phoneNumber: fullPhoneNumber,
      smsSent,
      gatewayUsed,
      message: smsMessage,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to process OTP request' }, { status: 500 });
  }
}
