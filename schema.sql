-- Run this in the Neon SQL Editor (or via psql) once, after creating the project.

create extension if not exists pgcrypto;

create table if not exists candidates (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  role text not null check (role in ('PM', 'SPM')),
  role_source text default 'manual' check (role_source in ('auto', 'manual')),
  recommended_role text check (recommended_role in ('PM', 'SPM')),
  role_rationale text,

  cv_filename text,
  cv_mime_type text,
  cv_data bytea, -- the original uploaded file, kept for audit/reference

  extracted jsonb,
  dimension_scores jsonb,
  total_score int default 0,
  max_score int default 21,
  probe_question text,

  interview_brief text,
  selection_rationale text,
  invite_email_subject text,
  invite_email_body text,
  reject_email_subject text,
  reject_email_body text,

  suggested_decision text check (suggested_decision in ('invite', 'reject')),
  decision text check (decision in ('invite', 'reject')),

  status text default 'ready', -- ready | sent | error
  sent_at timestamptz,
  sent_to_candidate boolean default false,
  sent_to_arjun boolean default false,

  created_at timestamptz default now()
);

create index if not exists candidates_total_score_idx on candidates (total_score desc);
