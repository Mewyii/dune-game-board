<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/bootstrap.php';

/*
 * POST { sessionCode, deviceId, playerId, isReady }
 * 200  { revision, seats }
 * 403  { error: 'seat-claimed-by-other-device' }
 * 404  { error: 'seat-not-found' }
 */
handleRequest('POST', function (array $config): void {
    $body = readJsonRequestBody();
    $sessionCode = readSessionCode($body->sessionCode ?? null);
    $deviceId = readDeviceId($body->deviceId ?? null);
    $playerId = readPlayerId($body->playerId ?? null);
    $isReady = readBoolean($body->isReady ?? null, 'invalid-is-ready');

    $repository = SessionRepository::connect($config['database']);

    $response = $repository->runInTransaction(
        function () use ($repository, $sessionCode, $deviceId, $playerId, $isReady): array {
            $session = $repository->getSessionOrFail($sessionCode, true);
            $seatDeviceId = $repository->findSeatDeviceId($sessionCode, $playerId);

            if ($seatDeviceId === null) {
                throw new HttpError(404, 'seat-not-found');
            }
            if ($seatDeviceId !== $deviceId) {
                throw new HttpError(403, 'seat-claimed-by-other-device');
            }

            $repository->setSeatReady($sessionCode, $playerId, $isReady);
            $newRevision = $repository->increaseRevision($sessionCode, $session['revision']);
            return ['revision' => $newRevision, 'seats' => $repository->getSeats($sessionCode)];
        }
    );

    sendJson(200, $response);
});
