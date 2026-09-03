import { Schema, model, Document, Types } from 'mongoose';

export interface ITicket extends Document {
  eventId: Types.ObjectId;
  userId: string;
  organizationId: string;
  attendeeName: string;
  attendeeEmail: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paymentStatus: 'mock_paid' | 'pending' | 'cancelled';
  qrCode: string;
  purchasedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    userId: { type: String, required: true, index: true },
    organizationId: { type: String, required: true, index: true },
    attendeeName: { type: String, required: true },
    attendeeEmail: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    unitPrice: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },
    paymentStatus: {
      type: String,
      enum: ['mock_paid', 'pending', 'cancelled'],
      default: 'mock_paid'
    },
    qrCode: { type: String, default: '' },
    purchasedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Ticket = model<ITicket>('Ticket', ticketSchema);
