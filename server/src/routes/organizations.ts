import { Router, Request, Response } from 'express';
import { Organization } from '../models/Organization.js';

export const organizationsRouter = Router();

// GET /api/organizations - List all registered organizations
organizationsRouter.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const orgs = await Organization.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: orgs,
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve organizations' });
  }
});

// POST /api/organizations - Register a new organization
organizationsRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, category, contactEmail } = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({ success: false, message: 'Organization name is required' });
      return;
    }

    // Auto-generate slug orgId if not provided
    const slug =
      req.body.orgId ||
      'org-' +
        name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') +
        '-' +
        Math.random().toString(36).substring(2, 6);

    // Check if duplicate
    const existing = await Organization.findOne({ orgId: slug });
    if (existing) {
      res.status(409).json({ success: false, message: 'Organization ID already exists' });
      return;
    }

    const org = await Organization.create({
      orgId: slug,
      name: name.trim(),
      description: description?.trim() || '',
      category: category || 'Community',
      contactEmail: contactEmail?.trim() || '',
    });

    res.status(201).json({
      success: true,
      data: org,
      message: 'Organization created successfully',
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({ success: false, message: 'Failed to create organization' });
  }
});
