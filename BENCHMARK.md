# VBD-strapi: synthetic vulnerability benchmark

This fork is a **synthetic, openly labelled benchmark**. It is not the upstream project
and must not be used as one. Each sample is an isolated pair of branches off `baseline`:

- `baseline`: the pinned upstream commit plus any hardening; the common ancestor.
- `smpl/<NNN>/safe`: the genuine negative (validated control) of sample `NNN`.
- `smpl/<NNN>/vuln`: `safe` plus exactly one commit that weakens the control.

The class and the coordinates of every sample live only in `GROUND_TRUTH.csv` on this
orphan branch, never in the analysed branches.

| sample | file | class |
|---|---|---|
| 001 | `packages/plugins/users-permissions/server/src/middlewares/rateLimit.js` | F115 |
| 002 | `packages/core/admin/server/src/controllers/authentication.ts` | F115 |
| 003 | `packages/core/admin/ee/server/src/services/auth.ts` | F115 |
| 004 | `packages/core/admin/server/src/strategies/content-api-token.ts` | F115 |
