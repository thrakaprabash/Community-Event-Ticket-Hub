import { Router, Request, Response } from 'express';
import QRCode from 'qrcode';
import { Ticket } from '../models/Ticket.js';
import { Event } from '../models/Event.js';
import { verifyAsgardeoToken, AuthenticatedRequest } from '../middleware/verifyToken.js';
import { requireOrgScope } from '../middleware/requireOrg.js';

export const ticketsRouter = Router();

// POST /api/tickets - Public/Attendee register & mock payment
ticketsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { eventId, attendeeName, attendeeEmail, quantity = 1, userId = 'guest-user' } = req.body;

    if (!eventId || !attendeeName || !attendeeEmail) {
      res.status(400).json({ success: false, message: 'Missing required registration details' });
      return;
    }

    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    if (event.ticketsSold + Number(quantity) > event.capacity) {
      res.status(400).json({ success: false, message: 'Not enough tickets available' });
      return;
    }

    const unitPrice = event.price || 0;
    const totalAmount = unitPrice * Number(quantity);

    // Generate Mock Ticket Payload & Base64 QR Code
    const tempTicketId = 'TKT-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const qrPayload = JSON.stringify({
      ticketCode: tempTicketId,
      eventId: event._id,
      eventTitle: event.title,
      attendee: attendeeName,
      qty: quantity,
      date: event.date
    });

    const qrDataUrl = await QRCode.toDataURL(qrPayload, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 320,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });

    const ticket = new Ticket({
      eventId: event._id,
      userId,
      organizationId: event.organizationId,
      attendeeName,
      attendeeEmail,
      quantity: Number(quantity),
      unitPrice,
      totalAmount,
      paymentStatus: 'mock_paid', // Instant mock approval
      qrCode: qrDataUrl,
      purchasedAt: new Date()
    });

    await ticket.save();

    // Increment event ticketsSold
    event.ticketsSold += Number(quantity);
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Registration & Mock Payment successful',
      data: {
        ticket,
        event: {
          title: event.title,
          date: event.date,
          time: event.time,
          venue: event.venue
        }
      }
    });
  } catch (error) {
    console.error('[Tickets] Registration error:', error);
    res.status(500).json({ success: false, message: 'Failed to complete registration' });
  }
});

// GET /api/tickets/my - List tickets for user by email or userId
ticketsRouter.get('/my', async (req: Request, res: Response) => {
  try {
    const { email, userId } = req.query;
    if (!email && !userId) {
      res.status(400).json({ success: false, message: 'Please provide email or userId query param' });
      return;
    }

    const query: any = {};
    if (email) query.attendeeEmail = email;
    if (userId) query.userId = userId;

    const tickets = await Ticket.find(query).populate('eventId').sort({ createdAt: -1 });
    res.json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving your tickets' });
  }
});

// GET /api/tickets/org/attendees - List registered attendees for organizer's organization
ticketsRouter.get('/org/attendees', verifyAsgardeoToken, requireOrgScope, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orgId = req.user!.org_id;
    const { eventId } = req.query;

    const query: any = { organizationId: orgId };
    if (eventId) {
      query.eventId = eventId;
    }

    const attendees = await Ticket.find(query).populate('eventId', 'title date venue').sort({ createdAt: -1 });
    res.json({ success: true, data: attendees });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching organizer attendees' });
  }
});

// GET /api/tickets/verify/:code - Verify ticket admission by ticket ID or code
ticketsRouter.get('/verify/:code', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;
    let ticket = null;
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(code);
    if (isValidObjectId) {
      ticket = await Ticket.findById(code).populate('eventId');
    }
    if (!ticket) {
      ticket = await Ticket.findOne({ userId: code }).populate('eventId');
    }

    if (!ticket) {
      res.status(404).json({ success: false, message: 'Ticket pass not found or invalid' });
      return;
    }

    res.json({
      success: true,
      message: 'Valid admission ticket',
      data: ticket
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ticket verification failed' });
  }
});
