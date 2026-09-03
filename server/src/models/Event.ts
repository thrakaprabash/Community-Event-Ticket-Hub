import { Schema, model, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  category: 'Tech' | 'Music' | 'Sports' | 'University' | 'Community' | 'Other';
  date: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Tech', 'Music', 'Sports', 'University', 'Community', 'Other'],
      default: 'Community'
    },
    date: { type: Date, required: true },
    time: { type: String, default: '18:00' },
    venue: { type: String, required: true },
    city: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    ticketsSold: { type: Number, default: 0, min: 0 },
    price: { type: Number, default: 0, min: 0 },
    organizationId: { type: String, required: true, index: true },
    organizationName: { type: String, required: true },
    tags: [{ type: String }],
    imageUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming'
    }
  },
  { timestamps: true }
);

eventSchema.index({ title: 'text', description: 'text', city: 'text' });

export const Event = model<IEvent>('Event', eventSchema);
