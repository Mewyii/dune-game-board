-- Run once on databases created before seats had a ready state.
ALTER TABLE game_session_seats
  ADD COLUMN IF NOT EXISTS is_ready TINYINT(1) NOT NULL DEFAULT 0 AFTER device_id;
