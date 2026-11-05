-- -- db/schema.sql

-- CREATE TABLE IF NOT EXISTS users (
--   id UUID PRIMARY KEY,
--   name TEXT NOT NULL,
--   email TEXT NOT NULL UNIQUE,
--   password TEXT NOT NULL,
--   role TEXT NOT NULL CHECK (role IN ('admin','manager','employee')),
--   status TEXT NOT NULL DEFAULT 'pending_payment',
--   signup_paid BOOLEAN NOT NULL DEFAULT FALSE,
--   plan TEXT NOT NULL DEFAULT 'none',
--   stripe_customer_id TEXT,
--   token_version INTEGER NOT NULL DEFAULT 0,
--   last_reconcile_at TIMESTAMPTZ,
--   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--   sub_plan TEXT DEFAULT 'none',
--   sub_status TEXT DEFAULT 'inactive',
--   sub_stripe_id TEXT,
--   sub_current_period_end TIMESTAMPTZ,
--   sub_cancel_at_period_end BOOLEAN DEFAULT FALSE
-- );

-- CREATE INDEX IF NOT EXISTS idx_users_email_lower ON users (LOWER(email));
-- CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users (stripe_customer_id);

-- CREATE TABLE IF NOT EXISTS tasks (
--   id UUID PRIMARY KEY,
--   title TEXT NOT NULL,
--   description TEXT DEFAULT '',
--   assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
--   assigned_to_name TEXT,
--   assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
--   assigned_by_name TEXT,
--   status TEXT NOT NULL DEFAULT 'pending'
--     CHECK (status IN ('pending','in-progress','completed')),
--   due_date TIMESTAMPTZ,
--   requires_reassignment BOOLEAN DEFAULT FALSE,
--   comments JSONB NOT NULL DEFAULT '[]'::jsonb,
--   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- );

-- CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks (assigned_to);
-- CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks (status);
-- CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks (created_at DESC);

-- CREATE TABLE IF NOT EXISTS payments (
--   id TEXT PRIMARY KEY,
--   user_id UUID REFERENCES users(id) ON DELETE SET NULL,
--   type TEXT NOT NULL,
--   plan TEXT,
--   amount INTEGER NOT NULL DEFAULT 0,
--   currency TEXT NOT NULL DEFAULT 'usd',
--   status TEXT NOT NULL,
--   stripe_event_id TEXT,
--   stripe_session_id TEXT,
--   stripe_subscription_id TEXT,
--   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- );

-- CREATE UNIQUE INDEX IF NOT EXISTS uniq_payments_session
--   ON payments (stripe_session_id) WHERE stripe_session_id IS NOT NULL;
-- CREATE UNIQUE INDEX IF NOT EXISTS uniq_payments_sub
--   ON payments (stripe_subscription_id)
--   WHERE stripe_subscription_id IS NOT NULL AND type = 'subscription';
-- CREATE UNIQUE INDEX IF NOT EXISTS uniq_payments_event
--   ON payments (stripe_event_id) WHERE stripe_event_id IS NOT NULL;
-- CREATE INDEX IF NOT EXISTS idx_payments_user ON payments (user_id);
-- CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments (created_at DESC);

-- CREATE TABLE IF NOT EXISTS webhook_events (
--   id TEXT PRIMARY KEY,
--   type TEXT NOT NULL,
--   user_id UUID,
--   received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- );

-- CREATE TABLE IF NOT EXISTS reset_codes (
--   email TEXT PRIMARY KEY,
--   code TEXT NOT NULL,
--   expires_at BIGINT NOT NULL,
--   verified BOOLEAN NOT NULL DEFAULT FALSE,
--   attempts INTEGER NOT NULL DEFAULT 0,
--   created_at BIGINT NOT NULL
-- );

-- CREATE INDEX IF NOT EXISTS idx_reset_codes_expires ON reset_codes (expires_at);