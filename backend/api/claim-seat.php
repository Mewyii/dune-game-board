<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/bootstrap.php';

/*
 * POST { sessionCode, deviceId, playerId }
 * 200  { revision, seats }
 * 409  { error: 'seat-taken', seats }
 */
handleRequest('POST', function (array $config): void {
    $body = readJsonRequestBody();
    $sessionCode = readSessionCode($body->sessionCode ?? null);
    $deviceId = readDeviceId($body->deviceId ?? null);
    $playerId = readPlayerId($body->playerId ?? null);

    $repository = SessionRepository::connect($config['database']);

    [$status, $response] = $repository->runInTransaction(
        function () use ($repository, $sessionCode, $deviceId, $playerId): array {
            $session = $repository->getSessionOrFail($sessionCode, true);
            $seatDeviceId = $repository->findSeatDeviceId($sessionCode, $playerId);

            if ($seatDeviceId === $deviceId) {
                return [200, ['revision' => $session['revision'], 'seats' => $repository->getSeats($sessionCode)]];
            }
            if ($seatDeviceId !== null) {
                return [409, ['error' => 'seat-taken', 'seats' => $repository->getSeats($sessionCode)]];
            }

            $repository->insertSeat($sessionCode, $playerId, $deviceId);
            $newRevision = $repository->increaseRevision($sessionCode, $session['revision']);
            return [200, ['revision' => $newRevision, 'seats' => $repository->getSeats($sessionCode)]];
        }
    );

    sendJson($status, $response);
});
