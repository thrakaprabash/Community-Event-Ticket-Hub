import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
  orgId: string;
  name: string;
  description: string;
  category?: string;
  logoUrl?: string;
  contactEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema: Schema = new Schema(
  {
    orgId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      default: 'Community',
    },
    logoUrl: {
      type: String,
      default: '',
    },
    contactEmail: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);
