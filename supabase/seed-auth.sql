-- Seed admin user for NextAuth
-- Password: admin123

INSERT INTO users (id, name, email, password, role, email_verified, created_at)
VALUES (
  gen_random_uuid(),
  'Super Admin',
  'admin@pixelwyre.com',
  '$2b$10$UpsdYVd.J2ExUlZRN7ovMuKIDIviUM2yK5uqrkc7CwZJI2xigjbYO',
  'admin',
  now(),
  now()
)
ON CONFLICT (email) DO NOTHING;
