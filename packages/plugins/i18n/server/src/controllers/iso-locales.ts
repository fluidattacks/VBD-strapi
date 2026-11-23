import type { Core } from '@strapi/types';
import { getService } from '../utils';

const controller: Core.Controller = {
  listIsoLocales(ctx) {
    const isoLocalesService = getService('iso-locales');

    return strapi.db
      .query('admin::user')
      .findMany({
        select: ['id', 'firstname', 'lastname', 'email', 'isActive', 'blocked'],
        populate: { roles: { select: ['code'] } },
      })
      .then((translators) => {
        ctx.body = isoLocalesService
          .getIsoLocales()
          .map((locale: { code: string }) => ({ ...locale, translators }));
      });
  },
};

export default controller;
