import { Router, Request, Response } from 'express';
import { Event } from '../models/Event.js';
import { verifyAsgardeoToken, AuthenticatedRequest } from '../middleware/verifyToken.js';
import { requireOrgScope } from '../middleware/requireOrg.js';

export const eventsRouter = Router();

// GET /api/events - Public discovery with search, filter, pagination
eventsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { search, category, city, maxPrice, dateFilter, page = '1', limit = '9' } = req.query;

    const query: any = { status: { $ne: 'cancelled' } };

    if (search && typeof search === 'string' && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { venue: searchRegex },
        { city: searchRegex },
        { tags: searchRegex }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (city && city !== 'All') {
      query.city = city;
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      const priceNum = Number(maxPrice);
      if (!isNaN(priceNum)) {
        query.price = { $lte: priceNum };
      }
    }

    const now = new Date();
    if (dateFilter === 'today') {
      const start = new Date(now.setHours(0, 0, 0, 0));
      const end = new Date(now.setHours(23, 59, 59, 999));
      query.date = { $gte: start, $lte: end };
    } else if (dateFilter === 'this_week') {
      const endOfWeek = new Date();
      endOfWeek.setDate(now.getDate() + 7);
      query.date = { $gte: new Date(), $lte: endOfWeek };
    } else if (dateFilter === 'upcoming') {
      query.date = { $gte: new Date() };
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 9);
    const skip = (pageNum - 1) * limitNum;

    const [events, total] = await Promise.all([
      Event.find(query).sort({ date: 1 }).skip(skip).limit(limitNum),
      Event.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: events,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('[Events] Error fetching events:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving events' });
  }
});

// GET /api/events/meta/filters - List available categories & cities
eventsRouter.get('/meta/filters', async (_req: Request, res: Response) => {
  try {
    const [categories, cities] = await Promise.all([
      Event.distinct('category'),
      Event.distinct('city')
    ]);
    res.json({
      success: true,
      data: {
        categories: ['All', ...categories],
        cities: ['All', ...cities]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving filter metadata' });
  }
});

// GET /api/events/:id - Public event details
eventsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching event detail' });
  }
});

// GET /api/events/org/my-events - List events for authenticated organizer org
eventsRouter.get('/org/my-events', verifyAsgardeoToken, requireOrgScope, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orgId = req.user!.org_id;
    const events = await Event.find({ organizationId: orgId }).sort({ createdAt: -1 });
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching organization events' });
  }
});

// POST /api/events - Create new event for organizer org
eventsRouter.post('/', verifyAsgardeoToken, requireOrgScope, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, category, date, time, venue, city, capacity, price, tags, imageUrl } = req.body;

    if (!title || !description || !date || !venue || !city || !capacity) {
      res.status(400).json({ success: false, message: 'Missing required event fields' });
      return;
    }

    const orgId = req.user!.org_id!;
    const orgName = req.user!.org_name || 'My Organization';

    const newEvent = new Event({
      title,
      description,
      category: category || 'Community',
      date: new Date(date),
      time: time || '18:00',
      venue,
      city,
      capacity: Number(capacity),
      ticketsSold: 0,
      price: Number(price) || 0,
      organizationId: orgId,
      organizationName: orgName,
      tags: Array.isArray(tags) ? tags : [],
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
      status: 'upcoming'
    });

    await newEvent.save();
    res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    console.error('[Events] Error creating event:', error);
    res.status(500).json({ success: false, message: 'Failed to create event' });
  }
});

// PUT /api/events/:id - Update event (Org-scoped guard)
eventsRouter.put('/:id', verifyAsgardeoToken, requireOrgScope, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orgId = req.user!.org_id;
    const event = await Event.findOne({ _id: req.params.id, organizationId: orgId });

    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found or unauthorized to edit' });
      return;
    }

    Object.assign(event, req.body);
    await event.save();

    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update event' });
  }
});

// DELETE /api/events/:id - Cancel/Delete event (Org-scoped guard)
eventsRouter.delete('/:id', verifyAsgardeoToken, requireOrgScope, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orgId = req.user!.org_id;
    const event = await Event.findOne({ _id: req.params.id, organizationId: orgId });

    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found or unauthorized to delete' });
      return;
    }

    event.status = 'cancelled';
    await event.save();

    res.json({ success: true, message: 'Event marked as cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete event' });
  }
});
