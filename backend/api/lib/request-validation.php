<?php
declare(strict_types=1);

const SESSION_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const SESSION_CODE_LENGTH = 6;

function readSessionCode(mixed $value): string
{
    $sessionCode = is_string($value) ? strtoupper(trim($value)) : '';
    if (!preg_match('/^[' . SESSION_CODE_ALPHABET . ']{' . SESSION_CODE_LENGTH . '}$/', $sessionCode)) {
        throw new HttpError(400, 'invalid-session-code');
    }
    return $sessionCode;
}

function readDeviceId(mixed $value): string
{
    if (!is_string($value) || !preg_match('/^[A-Za-z0-9-]{8,64}$/', $value)) {
        throw new HttpError(400, 'invalid-device-id');
    }
    return $value;
}

function readAppVersion(mixed $value): string
{
    if (!is_string($value) || !preg_match('/^[0-9.]{1,16}$/', $value)) {
        throw new HttpError(400, 'invalid-app-version');
    }
    return $value;
}

function readRevision(mixed $value): int
{
    $revision = filter_var($value, FILTER_VALIDATE_INT, ['options' => ['min_range' => 0]]);
    if ($revision === false) {
        throw new HttpError(400, 'invalid-revision');
    }
    return $revision;
}

function readPlayerId(mixed $value): int
{
    $playerId = filter_var($value, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 255]]);
    if ($playerId === false) {
        throw new HttpError(400, 'invalid-player-id');
    }
    return $playerId;
}

function readBoolean(mixed $value, string $errorCode): bool
{
    if (!is_bool($value)) {
        throw new HttpError(400, $errorCode);
    }
    return $value;
}

/**
 * Turns a JSON object of persisted values into an array of value key => encoded JSON value.
 *
 * @return array<string, string>
 */
function readEncodedValues(mixed $values): array
{
    if (!($values instanceof stdClass)) {
        throw new HttpError(400, 'invalid-values');
    }

    $encodedValues = [];
    foreach (get_object_vars($values) as $valueKey => $value) {
        if (!preg_match('/^[A-Za-z0-9_-]{1,100}$/', (string) $valueKey)) {
            throw new HttpError(400, 'invalid-value-key', ['valueKey' => $valueKey]);
        }
        $encodedValues[(string) $valueKey] = encodeJson($value);
    }
    return $encodedValues;
}

function createRandomSessionCode(): string
{
    $sessionCode = '';
    $lastAlphabetIndex = strlen(SESSION_CODE_ALPHABET) - 1;
    for ($i = 0; $i < SESSION_CODE_LENGTH; $i++) {
        $sessionCode .= SESSION_CODE_ALPHABET[random_int(0, $lastAlphabetIndex)];
    }
    return $sessionCode;
}
