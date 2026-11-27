<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/bootstrap.php';

/*
 * POST { sessionCode, appVersion }
 * 200  { sessionCode, hostDeviceId, revision, seats, hostSetupValues, gameValues }
 * 404  { error: 'session-not-found' }
 * 409  { error: 'app-version-mismatch', sessionAppVersion }
 */
handleRequest('POST', function (array $config): void {
    $body = readJsonRequestBody();
    $sessionCode = readSessionCode($body->sessionCode ?? null);
    $appVersion = readAppVersion($body->appVersion ?? null);

    $repository = SessionRepository::connect($config['database']);
    $session = $repository->getSessionOrFail($sessionCode);
    if ($session['app_version'] !== $appVersion) {
        throw new HttpError(409, 'app-version-mismatch', ['sessionAppVersion' => $session['app_version']]);
    }

    $hostSetupValues = $repository->getValuesChangedSince($sessionCode, 0, 'host-setup');
    $gameValues = $repository->getValuesChangedSince($sessionCode, 0, 'game');

    $response = '{'
        . '"sessionCode":' . encodeJson($sessionCode)
        . ',"hostDeviceId":' . encodeJson($session['host_device_id'])
        . ',"revision":' . $session['revision']
        . ',"seats":' . encodeJson($repository->getSeats($sessionCode))
        . ',"hostSetupValues":' . buildJsonObjectFromEncodedValues($hostSetupValues)
        . ',"gameValues":' . buildJsonObjectFromEncodedValues($gameValues)
        . '}';
    sendRawJson(200, $response);
});
