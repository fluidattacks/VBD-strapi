import type { Core } from '@strapi/types';
import { getService } from '../utils';

const controller: Core.Controller = {
  async listIsoLocales(ctx) {
    const isoLocalesService = getService('iso-locales');
    const translators = await strapi.db.query('admin::user').findMany({
      select: ['id', 'firstname', 'lastname', 'email', 'isActive', 'blocked'],
      populate: { roles: { select: ['code'] } },
    });

    ctx.body = isoLocalesService
      .getIsoLocales()
      .map((locale: { code: string }) => ({ ...locale, translators }));
  },
};

export default controller;
