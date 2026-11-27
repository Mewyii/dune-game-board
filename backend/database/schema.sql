-- Multiplayer sessions for MariaDB 11.8.
-- Every persisted value of the frontend is stored as its own row, so clients only upload and download changed values.

CREATE TABLE IF NOT EXISTS game_sessions (
  session_code CHAR(6) NOT NULL,
  host_device_id VARCHAR(64) NOT NULL,
  app_version VARCHAR(16) NOT NULL,
  -- Increased by every change of the session (values or seats). Clients send the revision their changes are based on.
  revision INT UNSIGNED NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (session_code),
  KEY idx_game_sessions_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS game_session_values (
  session_code CHAR(6) NOT NULL,
  value_key VARCHAR(100) NOT NULL,
  -- 'host-setup' values are written once when the session is created and can't be changed afterwards.
  value_scope ENUM('host-setup', 'game') NOT NULL,
  value_json LONGTEXT NOT NULL,
  changed_at_revision INT UNSIGNED NOT NULL,
  PRIMARY KEY (session_code, value_key),
  KEY idx_game_session_values_changes (session_code, changed_at_revision),
  CONSTRAINT fk_game_session_values_session FOREIGN KEY (session_code)
    REFERENCES game_sessions (session_code) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS game_session_seats (
  session_code CHAR(6) NOT NULL,
  player_id TINYINT UNSIGNED NOT NULL,
  device_id VARCHAR(64) NOT NULL,
  -- Joined players confirm in the lobby that they are ready before the host can start the game.
  is_ready TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (session_code, player_id),
  CONSTRAINT fk_game_session_seats_session FOREIGN KEY (session_code)
    REFERENCES game_sessions (session_code) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
