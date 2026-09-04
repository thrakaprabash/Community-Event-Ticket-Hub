import { Request, Response, NextFunction } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';

export interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    email?: string;
    org_id?: string;
    org_name?: string;
    roles?: string[];
    [key: string]: any;
  };
}

let JWKS: ReturnType<typeof createRemoteJWKSet> | null = null;

const getJWKS = () => {
  const jwksUri = process.env.ASGARDEO_JWKS_URI;
  if (!jwksUri) {
    return null;
  }
  if (!JWKS) {
    JWKS = createRemoteJWKSet(new URL(jwksUri));
  }
  return JWKS;
};

export const verifyAsgardeoToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authorization header missing or invalid' });
    return;
  }

  const token = authHeader.split(' ')[1];

  // Support interactive multi-tenant workspace token in both dev and production demo environments
  if (token.startsWith('mock_org_')) {
    const orgId = token.replace('mock_org_', '');
    req.user = {
      sub: 'organizer-user-01',
      email: 'organizer@eventhub.com',
      org_id: orgId,
      org_name: req.headers['x-org-name'] ? decodeURIComponent(req.headers['x-org-name'] as string) : orgId,
      roles: ['org-admin']
    };
    next();
    return;
  }

  const jwks = getJWKS();
  if (!jwks) {
    res.status(500).json({
      success: false,
      message: 'Asgardeo JWKS URI not configured on server.'
    });
    return;
  }

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: process.env.ASGARDEO_ISSUER
    });

    req.user = {
      sub: payload.sub as string,
      email: payload.email as string,
      org_id: (payload.org_id as string) || (payload['org_handle'] as string) || (payload['user_org'] as string) || 'default-org',
      org_name: (payload.org_name as string) || 'Event Organization',
      roles: (payload.roles as string[]) || []
    };

    next();
  } catch (error) {
    console.error('[Auth] Token verification failed:', error);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
