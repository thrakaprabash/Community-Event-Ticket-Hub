import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './verifyToken.js';

export const requireOrgScope = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || !req.user.org_id) {
    res.status(403).json({
      success: false,
      message: 'Forbidden: Access restricted to authenticated organization tenants'
    });
    return;
  }
  next();
};
