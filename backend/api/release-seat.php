<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/bootstrap.php';

/*
 * POST { sessionCode, deviceId, playerId }
 * 200  { revision, seats }
 * 403  { error: 'seat-claimed-by-other-device' }
 * The host may release every seat, e.g. when removing a player slot in the lobby.
 */
handleRequest('POST', function (array $config): void {
    $body = readJsonRequestBody();
    $sessionCode = readSessionCode($body->sessionCode ?? null);
    $deviceId = readDeviceId($body->deviceId ?? null);
    $playerId = readPlayerId($body->playerId ?? null);

    $repository = SessionRepository::connect($config['database']);

    $response = $repository->runInTransaction(function () use ($repository, $sessionCode, $deviceId, $playerId): array {
        $session = $repository->getSessionOrFail($sessionCode, true);
        $seatDeviceId = $repository->findSeatDeviceId($sessionCode, $playerId);

        if ($seatDeviceId === null) {
            return ['revision' => $session['revision'], 'seats' => $repository->getSeats($sessionCode)];
        }
        $isHost = $session['host_device_id'] === $deviceId;
        if ($seatDeviceId !== $deviceId && !$isHost) {
            throw new HttpError(403, 'seat-claimed-by-other-device');
        }

        $repository->deleteSeat($sessionCode, $playerId);
        $newRevision = $repository->increaseRevision($sessionCode, $session['revision']);
        return ['revision' => $newRevision, 'seats' => $repository->getSeats($sessionCode)];
    });

    sendJson(200, $response);
});
