# Seller authentication operations

Dylan's Palace seller access is authenticated by Supabase Auth and authorized by the `profiles.role` field. The former client-side PIN and `dylan_seller_auth` localStorage flag are not valid credentials.

## Create a seller account

1. In Supabase Authentication, create or invite the administrator using their real email address.
2. Set a strong temporary password or passcode. A four-digit value is technically accepted by the UI but is not recommended for production.
3. Ensure a matching row exists in `public.profiles` with the same user UUID.
4. Set `role = 'seller'` for that profile.
5. Test sign-in through `/seller/login` and confirm a customer-role account is rejected.

## Rotate or revoke access

Rotate a credential through Supabase Authentication. Revoke access by setting the profile role to `customer`, banning/deleting the auth user, or both. Existing browser sessions should also be revoked from Supabase when immediate removal is required.

## Security requirements

- Never place an admin password or passcode in `VITE_*` variables, source files, seed scripts or browser storage.
- Do not grant seller privileges based on email alone.
- All product, inventory, order and customer mutations must remain protected by row-level security or server-side operations.
- Remove the historical `0506` credential from any external deployment notes and rotate any account that used it.
