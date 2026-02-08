-- Create the anonymous role for PostgREST
CREATE ROLE web_anon NOLOGIN;

-- Grant usage on the public schema
GRANT USAGE ON SCHEMA public TO web_anon;

-- Grant select on all existing tables in public schema
GRANT SELECT ON ALL TABLES IN SCHEMA public TO web_anon;

-- Automatically grant select on future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO web_anon;

-- Create the authenticator role (optional, if handling auth via JWT in future)
-- CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD 'mysecretpassword';
-- GRANT web_anon TO authenticator;
