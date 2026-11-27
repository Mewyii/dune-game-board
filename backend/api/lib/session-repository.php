<?php
declare(strict_types=1);

final class SessionRepository
{
    public function __construct(private readonly PDO $database)
    {
    }

    public static function connect(array $databaseConfig): self
    {
        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
            $databaseConfig['host'],
            $databaseConfig['port'] ?? 3306,
            $databaseConfig['name'],
        );
        $database = new PDO($dsn, $databaseConfig['user'], $databaseConfig['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        return new self($database);
    }

    /** Runs the callback in a transaction and returns its result. */
    public function runInTransaction(callable $callback): mixed
    {
        $this->database->beginTransaction();
        try {
            $result = $callback();
            $this->database->commit();
            return $result;
        } catch (Throwable $error) {
            $this->database->rollBack();
            throw $error;
        }
    }

    public function deleteSessionsInactiveForDays(int $days): void
    {
        $statement = $this->database->prepare('DELETE FROM game_sessions WHERE updated_at < NOW() - INTERVAL ? DAY');
        $statement->execute([$days]);
    }

    public function insertSessionIfCodeIsFree(string $sessionCode, string $hostDeviceId, string $appVersion): bool
    {
        $statement = $this->database->prepare(
            'INSERT IGNORE INTO game_sessions (session_code, host_device_id, app_version, revision) VALUES (?, ?, ?, 1)'
        );
        $statement->execute([$sessionCode, $hostDeviceId, $appVersion]);
        return $statement->rowCount() === 1;
    }

    /** @return array{session_code: string, host_device_id: string, app_version: string, revision: int}|null */
    public function findSession(string $sessionCode, bool $lockForUpdate = false): ?array
    {
        $query = 'SELECT session_code, host_device_id, app_version, revision FROM game_sessions WHERE session_code = ?';
        if ($lockForUpdate) {
            $query .= ' FOR UPDATE';
        }
        $statement = $this->database->prepare($query);
        $statement->execute([$sessionCode]);
        $session = $statement->fetch();
        if ($session === false) {
            return null;
        }
        $session['revision'] = (int) $session['revision'];
        return $session;
    }

    public function getSessionOrFail(string $sessionCode, bool $lockForUpdate = false): array
    {
        $session = $this->findSession($sessionCode, $lockForUpdate);
        if ($session === null) {
            throw new HttpError(404, 'session-not-found');
        }
        return $session;
    }

    /** Returns the new revision. */
    public function increaseRevision(string $sessionCode, int $currentRevision): int
    {
        $newRevision = $currentRevision + 1;
        $statement = $this->database->prepare('UPDATE game_sessions SET revision = ? WHERE session_code = ?');
        $statement->execute([$newRevision, $sessionCode]);
        return $newRevision;
    }

    /** @param array<string, string> $encodedValues */
    public function saveValues(string $sessionCode, string $scope, array $encodedValues, int $revision): void
    {
        $statement = $this->database->prepare(
            'INSERT INTO game_session_values (session_code, value_key, value_scope, value_json, changed_at_revision)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE value_json = VALUES(value_json), changed_at_revision = VALUES(changed_at_revision)'
        );
        foreach ($encodedValues as $valueKey => $encodedValue) {
            $statement->execute([$sessionCode, $valueKey, $scope, $encodedValue, $revision]);
        }
    }

    /** @return string[] */
    public function getHostSetupValueKeys(string $sessionCode): array
    {
        $statement = $this->database->prepare(
            "SELECT value_key FROM game_session_values WHERE session_code = ? AND value_scope = 'host-setup'"
        );
        $statement->execute([$sessionCode]);
        return $statement->fetchAll(PDO::FETCH_COLUMN);
    }

    /** @return array<string, string> value key => encoded JSON value */
    public function getValuesChangedSince(string $sessionCode, int $sinceRevision, ?string $scope = null): array
    {
        $query = 'SELECT value_key, value_json FROM game_session_values WHERE session_code = ? AND changed_at_revision > ?';
        $parameters = [$sessionCode, $sinceRevision];
        if ($scope !== null) {
            $query .= ' AND value_scope = ?';
            $parameters[] = $scope;
        }
        $statement = $this->database->prepare($query);
        $statement->execute($parameters);
        return $statement->fetchAll(PDO::FETCH_KEY_PAIR);
    }

    /** @return array<int, array{playerId: int, deviceId: string, isReady: bool}> */
    public function getSeats(string $sessionCode): array
    {
        $statement = $this->database->prepare(
            'SELECT player_id, device_id, is_ready FROM game_session_seats WHERE session_code = ? ORDER BY player_id'
        );
        $statement->execute([$sessionCode]);
        return array_map(
            fn(array $seat) => [
                'playerId' => (int) $seat['player_id'],
                'deviceId' => $seat['device_id'],
                'isReady' => (bool) $seat['is_ready'],
            ],
            $statement->fetchAll(),
        );
    }

    public function setSeatReady(string $sessionCode, int $playerId, bool $isReady): void
    {
        $statement = $this->database->prepare(
            'UPDATE game_session_seats SET is_ready = ? WHERE session_code = ? AND player_id = ?'
        );
        $statement->execute([$isReady ? 1 : 0, $sessionCode, $playerId]);
    }

    public function findSeatDeviceId(string $sessionCode, int $playerId): ?string
    {
        $statement = $this->database->prepare(
            'SELECT device_id FROM game_session_seats WHERE session_code = ? AND player_id = ?'
        );
        $statement->execute([$sessionCode, $playerId]);
        $deviceId = $statement->fetchColumn();
        return $deviceId === false ? null : $deviceId;
    }

    public function insertSeat(string $sessionCode, int $playerId, string $deviceId): void
    {
        $statement = $this->database->prepare(
            'INSERT INTO game_session_seats (session_code, player_id, device_id) VALUES (?, ?, ?)'
        );
        $statement->execute([$sessionCode, $playerId, $deviceId]);
    }

    public function deleteSeat(string $sessionCode, int $playerId): void
    {
        $statement = $this->database->prepare('DELETE FROM game_session_seats WHERE session_code = ? AND player_id = ?');
        $statement->execute([$sessionCode, $playerId]);
    }
}
