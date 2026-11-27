<?php
declare(strict_types=1);

/** @param array<string, string> $changedValues value key => encoded JSON value */
function buildSessionChangesJson(int $revision, array $seats, array $changedValues): string
{
    return '{'
        . '"revision":' . $revision
        . ',"seats":' . encodeJson($seats)
        . ',"changedValues":' . buildJsonObjectFromEncodedValues($changedValues)
        . '}';
}

/**
 * Builds a JSON object from already encoded values without decoding them again.
 *
 * @param array<string, string> $encodedValues
 */
function buildJsonObjectFromEncodedValues(array $encodedValues): string
{
    if (count($encodedValues) === 0) {
        return '{}';
    }

    $properties = [];
    foreach ($encodedValues as $valueKey => $encodedValue) {
        $properties[] = encodeJson((string) $valueKey) . ':' . $encodedValue;
    }
    return '{' . implode(',', $properties) . '}';
}
