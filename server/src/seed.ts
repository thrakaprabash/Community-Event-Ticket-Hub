import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Event } from './models/Event.js';
import { Ticket } from './models/Ticket.js';

dotenv.config();

const sampleEvents = [
  {
    title: 'Global Tech Meetup 2026: AI & Cloud Horizons',
    description: 'Join developers, engineers, and founders for deep dives into autonomous agent frameworks, Kubernetes microservices, and modern web architectures. Includes lunch and networking sessions.',
    category: 'Tech',
    date: new Date(Date.now() + 86400000 * 3), // 3 days from now
    time: '09:30 AM',
    venue: 'Colombo Innovation Center, Auditorium A',
    city: 'Colombo',
    capacity: 250,
    ticketsSold: 184,
    price: 15,
    organizationId: 'org-techconf',
    organizationName: 'TechConf Global Ltd',
    tags: ['AI', 'Cloud', 'Microservices', 'React'],
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    status: 'upcoming'
  },
  {
    title: 'Midnight Beats: Outdoor Summer Electronic Fest',
    description: 'An open-air electronic and indie music festival featuring premier DJs, acoustic bands, food stalls, and an immersive laser light display under the stars.',
    category: 'Music',
    date: new Date(Date.now() + 86400000 * 6),
    time: '06:00 PM',
    venue: 'Galle Face Coastal Green',
    city: 'Colombo',
    capacity: 600,
    ticketsSold: 420,
    price: 30,
    organizationId: 'org-soundwave',
    organizationName: 'SoundWave Productions',
    tags: ['EDM', 'Concert', 'LiveMusic', 'FoodTrucks'],
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
    status: 'upcoming'
  },
  {
    title: 'University Annual Charity 5K Walk & Run',
    description: 'Support local student scholarship funds with a refreshing morning 5K walk across scenic campus parks. Free t-shirts, energy drinks, and participation medals for all finishers.',
    category: 'University',
    date: new Date(Date.now() + 86400000 * 10),
    time: '06:30 AM',
    venue: 'University Central Grounds',
    city: 'Kandy',
    capacity: 400,
    ticketsSold: 310,
    price: 0, // Free community event
    organizationId: 'org-unicouncil',
    organizationName: 'University Student Council',
    tags: ['Fitness', 'Charity', 'CampusLife', 'Free'],
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&auto=format&fit=crop&q=80',
    status: 'upcoming'
  },
  {
    title: 'Frontend React & TypeScript Masterclass',
    description: 'Intensive weekend hands-on workshop building high-performance SPAs, mastering state management, server components, and enterprise design systems.',
    category: 'Tech',
    date: new Date(Date.now() + 86400000 * 14),
    time: '10:00 AM',
    venue: 'Apex Tech Labs, 4th Floor',
    city: 'Colombo',
    capacity: 60,
    ticketsSold: 48,
    price: 25,
    organizationId: 'org-techconf',
    organizationName: 'TechConf Global Ltd',
    tags: ['React', 'TypeScript', 'Frontend', 'Workshop'],
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&auto=format&fit=crop&q=80',
    status: 'upcoming'
  },
  {
    title: 'Southern Coastal Acoustic Night',
    description: 'Relaxed sunset acoustic vibes right on the sand with tropical drinks, live bonfire jam sessions, and local acoustic soloists.',
    category: 'Music',
    date: new Date(Date.now() + 86400000 * 18),
    time: '05:30 PM',
    venue: 'Mirissa Beachfront Pavilion',
    city: 'Mirissa',
    capacity: 150,
    ticketsSold: 95,
    price: 10,
    organizationId: 'org-soundwave',
    organizationName: 'SoundWave Productions',
    tags: ['Acoustic', 'Beach', 'Sunset', 'Indie'],
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
    status: 'upcoming'
  },
  {
    title: 'Inter-University Coding Championship 2026',
    description: 'A 12-hour collegiate algorithmic problem solving & hackathon competition. Cash prizes, tech recruiters on-site, and exciting sponsor swags.',
    category: 'University',
    date: new Date(Date.now() + 86400000 * 22),
    time: '08:00 AM',
    venue: 'Faculty of Computing Main Hall',
    city: 'Kandy',
    capacity: 200,
    ticketsSold: 130,
    price: 0,
    organizationId: 'org-unicouncil',
    organizationName: 'University Student Council',
    tags: ['Hackathon', 'Algorithms', 'Students', 'Prizes'],
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
    status: 'upcoming'
  }
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eventhub';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    await Event.deleteMany({});
    await Ticket.deleteMany({});
    console.log('[Seed] Cleared existing events and tickets');

    const createdEvents = await Event.insertMany(sampleEvents);
    console.log(`[Seed] Successfully inserted ${createdEvents.length} events`);

    // Create realistic seed ticket purchases for analytics charts demonstration
    const dummyAttendees = [
      { name: 'Kasun Perera', email: 'kasun@example.com' },
      { name: 'Amara Silva', email: 'amara@example.com' },
      { name: 'Ruwan Fernando', email: 'ruwan@example.com' },
      { name: 'Dinithi Jayasinghe', email: 'dinithi@example.com' },
      { name: 'Tharindu Wickrama', email: 'tharindu@example.com' },
      { name: 'Nadeesha Senanayake', email: 'nadeesha@example.com' },
      { name: 'Malik Deen', email: 'malik@example.com' }
    ];

    const sampleTickets = [];
    for (const ev of createdEvents) {
      for (let i = 0; i < dummyAttendees.length; i++) {
        const attendee = dummyAttendees[i];
        const daysAgo = Math.floor(Math.random() * 25);
        const purchaseDate = new Date();
        purchaseDate.setDate(purchaseDate.getDate() - daysAgo);

        sampleTickets.push({
          eventId: ev._id,
          userId: `usr-${i + 1}`,
          organizationId: ev.organizationId,
          attendeeName: attendee.name,
          attendeeEmail: attendee.email,
          quantity: Math.floor(Math.random() * 3) + 1,
          unitPrice: ev.price,
          totalAmount: ev.price * (Math.floor(Math.random() * 3) + 1),
          paymentStatus: 'mock_paid',
          qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          purchasedAt: purchaseDate,
          createdAt: purchaseDate
        });
      }
    }

    await Ticket.insertMany(sampleTickets);
    console.log(`[Seed] Successfully generated ${sampleTickets.length} realistic tickets for chart visualization!`);

    await mongoose.disconnect();
    console.log('[Seed] Done!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Failed:', error);
    process.exit(1);
  }
}

seed();
