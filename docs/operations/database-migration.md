# Commerce database migration

The canonical schema is `prisma/schema.prisma`; executable history lives under `prisma/migrations/`. The former `scripts/schema.sql` definition is archived because it represented images and sizes as arrays and conflicts with the current relational model.

## Before migration

1. Export a full Supabase database backup.
2. Confirm the application currently reads `product_images` and `product_sizes` relations.
3. Apply the migration first to a staging project containing a recent production snapshot.
4. Verify every product has at least one `product_variants` row after backfill.
5. Create a seller auth user and confirm `public.profiles.role = 'seller'`.

## Apply

Run Prisma migration tooling with `SUPABASE_DB_URL` pointed at staging, or execute `prisma/migrations/0002_commerce_hardening/migration.sql` through a controlled database session. Do not execute it concurrently with product or order administration.

## Verification queries

```sql
select count(*) from products;
select count(distinct product_id) from product_variants;
select product_id, sum(stock_quantity) from product_variants group by product_id limit 20;
select proname from pg_proc where proname = 'place_order';
select tablename, policyname from pg_policies where tablename in (
  'product_variants', 'inventory_movements', 'order_status_events',
  'admin_audit_events', 'store_settings'
);
```

Place one test order against staging and confirm:

- one order row and all order-item rows are created;
- selected variant stock is decremented;
- an inventory movement and initial status event are created;
- an insufficient-stock order fails without creating any partial rows.

## Rollback

Restore the backup if production validation fails. Because the migration adds tables and columns rather than dropping live product/order data, a short application rollback can also point the previous frontend at the unchanged legacy relations; however, orders created by the new transactional function must not be discarded.
