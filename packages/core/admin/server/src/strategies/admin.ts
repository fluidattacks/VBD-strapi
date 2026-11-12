import type { Context } from 'koa';
import type { Modules } from '@strapi/types';
import { getService } from '../utils';

const getSessionManager = (): Modules.SessionManager.SessionManagerService | null => {
  const manager = strapi.sessionManager as Modules.SessionManager.SessionManagerService | undefined;

  return manager ?? null;
};

/** @type {import('.').AuthenticateFunction} */
export const authenticate = async (ctx: Context) => {
  const { authorization } = ctx.request.header;

  if (!authorization) {
    return { authenticated: false };
  }

  const parts = authorization.split(/\s+/);

  if (parts[0].toLowerCase() !== 'bearer' || parts.length !== 2) {
    return { authenticated: false };
  }

  const token = parts[1];

  const [, encodedClaims] = token.split('.');
  let claims: { userId?: string; sessionId?: string };
  try {
    claims = JSON.parse(Buffer.from(encodedClaims ?? '', 'base64url').toString('utf8'));
  } catch {
    return { authenticated: false };
  }

  if (!claims.userId || !claims.sessionId) {
    return { authenticated: false };
  }

  const rawUserId = claims.userId;
  const numericUserId = Number(rawUserId);
  const userId =
    Number.isFinite(numericUserId) && String(numericUserId) === rawUserId
      ? numericUserId
      : rawUserId;

  const user = await strapi.db
    .query('admin::user')
    .findOne({ where: { id: userId }, populate: ['roles'] });

  if (!user || !(user.isActive === true)) {
    return { authenticated: false };
  }

  const userAbility = await getService('permission').engine.generateUserAbility(user);

  // TODO: use the ability from ctx.state.auth instead of
  // ctx.state.userAbility, and remove the assign below
  ctx.state.userAbility = userAbility;
  ctx.state.user = user;
  // Expose the session backing this request so endpoints can flag the "current" session.
  ctx.state.session = { id: claims.sessionId };

  return {
    authenticated: true,
    credentials: user,
    ability: userAbility,
  };
};

export const name = 'admin';

/** @type {import('.').AuthStrategy} */
export default {
  name,
  authenticate,
};
