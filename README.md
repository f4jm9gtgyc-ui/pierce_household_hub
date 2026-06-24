# Homestead Hub + Tiny Tenant v1.0

## What this package changes

This package adds/updates only:

- root `index.html` landing page
- root `styles.css` for the landing page
- `tiny_tenant_hub/` rebuilt dashboard files

It does not include, edit, or replace files inside:

- `finance_hub/`
- `solar_hub/`

## Install steps

1. In GitHub, open your `homestead_hub` repository.
2. Upload/replace the root `index.html` and root `styles.css`.
3. Replace the entire `tiny_tenant_hub/` folder with the one in this package.
4. Run `tiny_tenant_hub/tiny_tenant_v1_schema.sql` in the Finance Supabase project.
5. Commit and push.
6. Open `https://f4jm9gtgyc-ui.github.io/homestead_hub/`.

## Important note

Tiny Tenant does not use login. Anyone with the Tiny Tenant link can view and update the shared dashboard. This is intentional based on the current project direction.

## Theme behavior

Tiny Tenant uses the device/browser color setting:

- light device setting = light mode
- dark device setting = dark mode

There is no toggle button.
