export interface EventItem {
  _id: string;
  title: string;
  description: string;
  category: 'Tech' | 'Music' | 'Sports' | 'University' | 'Community' | 'Other';
  date: string;
  time: string;
  venue: string;
  city: string;
  capacity: number;
  ticketsSold: number;
  price: number;
  organizationId: string;
  organizationName: string;
  tags: string[];
  imageUrl: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface TicketItem {
  _id: string;
  eventId: string | EventItem;
  attendeeName: string;
  attendeeEmail: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paymentStatus: 'mock_paid' | 'pending' | 'cancelled';
  qrCode: string;
  purchasedAt: string;
}

export interface AnalyticsSummary {
  totalEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  uniqueAttendees: number;
  occupancyRate: number;
}

export interface OrganizationItem {
  _id?: string;
  orgId: string;
  name: string;
  description: string;
  category?: string;
  contactEmail?: string;
}
