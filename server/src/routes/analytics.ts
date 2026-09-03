import { Router, Response } from 'express';
import { Types } from 'mongoose';
import { Event } from '../models/Event.js';
import { Ticket } from '../models/Ticket.js';
import { verifyAsgardeoToken, AuthenticatedRequest } from '../middleware/verifyToken.js';
import { requireOrgScope } from '../middleware/requireOrg.js';

export const analyticsRouter = Router();

// Org-scoped summary counters & metrics
analyticsRouter.get('/summary', verifyAsgardeoToken, requireOrgScope, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orgId = req.user!.org_id;

    const [events, tickets] = await Promise.all([
      Event.find({ organizationId: orgId }),
      Ticket.find({ organizationId: orgId })
    ]);

    const totalEvents = events.length;
    const totalCapacity = events.reduce((acc, ev) => acc + (ev.capacity || 0), 0);
    const totalTicketsSold = tickets.reduce((acc, tk) => acc + (tk.quantity || 0), 0);
    const totalRevenue = tickets.reduce((acc, tk) => acc + (tk.totalAmount || 0), 0);
    const uniqueAttendees = new Set(tickets.map((t) => t.attendeeEmail)).size;
    const occupancyRate = totalCapacity > 0 ? Math.round((totalTicketsSold / totalCapacity) * 100) : 0;

    res.json({
      success: true,
      data: {
        totalEvents,
        totalTicketsSold,
        totalRevenue,
        uniqueAttendees,
        occupancyRate
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to aggregate analytics summary' });
  }
});

// Registrations time-series (for Recharts LineChart)
analyticsRouter.get('/registrations', verifyAsgardeoToken, requireOrgScope, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orgId = req.user!.org_id;
    const range = (req.query.range as string) || '30d';

    const days = range === '7d' ? 7 : range === '90d' ? 90 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const tickets = await Ticket.find({
      organizationId: orgId,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 });

    // Group count by day
    const dayMap: { [key: string]: { registrations: number; revenue: number } } = {};

    for (let i = 0; i <= days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      dayMap[key] = { registrations: 0, revenue: 0 };
    }

    tickets.forEach((t) => {
      const dateKey = new Date(t.createdAt).toISOString().split('T')[0];
      if (dayMap[dateKey]) {
        dayMap[dateKey].registrations += t.quantity;
        dayMap[dateKey].revenue += t.totalAmount;
      }
    });

    const timeSeries = Object.entries(dayMap).map(([date, val]) => ({
      date: date.substring(5), // MM-DD
      registrations: val.registrations,
      revenue: val.revenue
    }));

    res.json({ success: true, data: timeSeries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to aggregate registration time series' });
  }
});

// Revenue by Event (for Recharts BarChart)
analyticsRouter.get('/revenue-by-event', verifyAsgardeoToken, requireOrgScope, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orgId = req.user!.org_id;

    const data = await Ticket.aggregate([
      { $match: { organizationId: orgId } },
      {
        $group: {
          _id: '$eventId',
          totalRevenue: { $sum: '$totalAmount' },
          ticketsSold: { $sum: '$quantity' }
        }
      },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: '_id',
          as: 'event'
        }
      },
      { $unwind: '$event' },
      {
        $project: {
          _id: 1,
          name: '$event.title',
          revenue: '$totalRevenue',
          tickets: '$ticketsSold',
          capacity: '$event.capacity'
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 8 }
    ]);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch event revenue' });
  }
});

// Category Distribution (for Recharts PieChart)
analyticsRouter.get('/category-distribution', verifyAsgardeoToken, requireOrgScope, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orgId = req.user!.org_id;

    const data = await Event.aggregate([
      { $match: { organizationId: orgId } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          ticketsSold: { $sum: '$ticketsSold' }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1,
          ticketsSold: 1
        }
      }
    ]);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch category distribution' });
  }
});

// Top Events list
analyticsRouter.get('/top-events', verifyAsgardeoToken, requireOrgScope, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orgId = req.user!.org_id;

    const events = await Event.find({ organizationId: orgId })
      .sort({ ticketsSold: -1 })
      .limit(5)
      .select('title category date venue capacity ticketsSold price status');

    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch top events' });
  }
});
