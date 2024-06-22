import type { NextApiRequest, NextApiResponse } from 'next';
import mandrill from 'mandrill-api/mandrill';
import { getUserById } from '../../lib/users';
import connectToDatabase from '../../lib/mongodb';
import EmailStatus from '../../models/EmailStatus';

const mandrillClient = new mandrill.Mandrill(process.env.MANDRILL_API_KEY);

type MandrillSendResult = {
  email: string;
  status: string;
  _id: string;
  reject_reason?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { subject, text, attachment, month, year } = req.body;
    const userId = parseInt(req.query.userId as string, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = getUserById(userId);
    const fromEmail = user ? user.email : undefined;
    const recipientEmail = process.env.EMAIL_RECIPIENT;

    console.log('Recipient Email:', recipientEmail);

    if (!recipientEmail) {
      return res.status(500).json({ error: 'Recipient email not set in environment variables' });
    }

    const message = {
      html: `<p>${text}</p>`,
      subject,
      from_email: fromEmail,
      to: [
        {
          email: recipientEmail,
          type: 'to',
        },
      ],
      attachments: [
        {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          name: 'report.xlsx',
          content: attachment,
        },
      ],
    };

    try {
      const result: MandrillSendResult[] = await new Promise((resolve, reject) => {
        mandrillClient.messages.send(
          { message },
          (result) => resolve(result),
          (error) => reject(error)
        );
      });

      console.log('Mandrill send result:', result);

      if (result[0].status === 'sent' || result[0].status === 'queued') {
        const db = await connectToDatabase();
        const sendTime = new Date();

        console.log('Database connection established.');

        try {
          await EmailStatus.create({
            userId,
            month,
            year,
            sendTime,
          });

          console.log('Email status saved to database.');

          return res.status(200).json({ message: 'Email sent and status saved', sendTime });
        } catch (err) {
          console.error('Error saving email status to database:', err);
          return res.status(500).json({ error: 'Error saving email status to database' });
        }
      } else {
        return res.status(500).json({ error: `Mandrill did not send the email: ${result[0].reject_reason || 'No reject reason provided'}` });
      }
    } catch (error) {
      console.error('Mandrill error:', error);
      return res.status(500).json({ error: 'Error sending email' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
