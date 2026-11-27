<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/bootstrap.php';

/*
 * POST { sessionCode, baseRevision, changedValues: {key: value} }
 * 200  { revision }
 * 409  { error: 'revision-conflict', revision, seats, changedValues } - the session changed after baseRevision.
 *      changedValues contains the game values changed after baseRevision. The client merges them and sends its changes again.
 */
handleRequest('POST', function (array $config): void {
    $body = readJsonRequestBody();
    $sessionCode = readSessionCode($body->sessionCode ?? null);
    $baseRevision = readRevision($body->baseRevision ?? null);
    $changedValues = readEncodedValues($body->changedValues ?? null);

    $repository = SessionRepository::connect($config['database']);

    [$status, $responseJson] = $repository->runInTransaction(
        function () use ($repository, $sessionCode, $baseRevision, $changedValues): array {
            $session = $repository->getSessionOrFail($sessionCode, true);
            if ($session['revision'] !== $baseRevision) {
                $remoteChanges = $repository->getValuesChangedSince($sessionCode, $baseRevision, 'game');
                $changesJson = buildSessionChangesJson($session['revision'], $repository->getSeats($sessionCode), $remoteChanges);
                return [409, '{"error":"revision-conflict",' . substr($changesJson, 1)];
            }

            rejectChangedHostSetupValues($repository, $sessionCode, $changedValues);

            $newRevision = $repository->increaseRevision($sessionCode, $session['revision']);
            $repository->saveValues($sessionCode, 'game', $changedValues, $newRevision);
            return [200, encodeJson(['revision' => $newRevision])];
        }
    );

    sendRawJson($status, $responseJson);
});

/** @param array<string, string> $changedValues */
function rejectChangedHostSetupValues(SessionRepository $repository, string $sessionCode, array $changedValues): void
{
    $changedHostSetupKeys = array_intersect(array_keys($changedValues), $repository->getHostSetupValueKeys($sessionCode));
    if (count($changedHostSetupKeys) > 0) {
        throw new HttpError(400, 'host-setup-is-fixed', ['valueKeys' => array_values($changedHostSetupKeys)]);
    }
}
