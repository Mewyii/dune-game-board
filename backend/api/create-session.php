<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/bootstrap.php';

/*
 * POST { appVersion, deviceId, hostSetupValues: {key: value}, gameValues: {key: value} }
 * 201  { sessionCode, revision }
 */
handleRequest('POST', function (array $config): void {
    $body = readJsonRequestBody();
    $hostDeviceId = readDeviceId($body->deviceId ?? null);
    $appVersion = readAppVersion($body->appVersion ?? null);
    $hostSetupValues = readEncodedValues($body->hostSetupValues ?? null);
    $gameValues = readEncodedValues($body->gameValues ?? null);

    $repository = SessionRepository::connect($config['database']);
    $repository->deleteSessionsInactiveForDays((int) ($config['deleteSessionsInactiveForDays'] ?? 14));

    $sessionCode = $repository->runInTransaction(function () use ($repository, $hostDeviceId, $appVersion, $hostSetupValues, $gameValues) {
        $sessionCode = insertSessionWithFreeCode($repository, $hostDeviceId, $appVersion);
        $initialRevision = 1;
        $repository->saveValues($sessionCode, 'host-setup', $hostSetupValues, $initialRevision);
        $repository->saveValues($sessionCode, 'game', $gameValues, $initialRevision);
        return $sessionCode;
    });

    sendJson(201, ['sessionCode' => $sessionCode, 'revision' => 1]);
});

function insertSessionWithFreeCode(SessionRepository $repository, string $hostDeviceId, string $appVersion): string
{
    for ($attempt = 0; $attempt < 10; $attempt++) {
        $sessionCode = createRandomSessionCode();
        if ($repository->insertSessionIfCodeIsFree($sessionCode, $hostDeviceId, $appVersion)) {
            return $sessionCode;
        }
    }
    throw new HttpError(503, 'no-free-session-code');
}
