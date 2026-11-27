<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/bootstrap.php';

/*
 * GET ?sessionCode=ABC234&sinceRevision=12
 * 200 { revision, seats, changedValues: {key: value} } - changedValues contains game values changed after sinceRevision.
 */
handleRequest('GET', function (array $config): void {
    $sessionCode = readSessionCode($_GET['sessionCode'] ?? null);
    $sinceRevision = readRevision($_GET['sinceRevision'] ?? null);

    $repository = SessionRepository::connect($config['database']);
    $session = $repository->getSessionOrFail($sessionCode);

    $changedValues = [];
    if ($session['revision'] > $sinceRevision) {
        $changedValues = $repository->getValuesChangedSince($sessionCode, $sinceRevision, 'game');
    }

    sendRawJson(200, buildSessionChangesJson($session['revision'], $repository->getSeats($sessionCode), $changedValues));
});
