<?php
declare(strict_types=1);

final class HttpError extends Exception
{
    public function __construct(public readonly int $status, public readonly string $errorCode, public readonly array $details = [])
    {
        parent::__construct($errorCode);
    }
}

function loadConfig(): array
{
    // The local Docker backend mounts its config outside of the read-only api folder.
    $configPath = getenv('DUNE_API_CONFIG_PATH') ?: __DIR__ . '/../config.php';
    if (!is_file($configPath)) {
        throw new HttpError(500, 'missing-config');
    }
    return require $configPath;
}

/** Answers CORS preflight requests and rejects requests with another HTTP method than the expected one. */
function prepareRequest(array $config, string $expectedMethod): void
{
    sendCorsHeaders($config['allowedOrigins'] ?? []);

    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if ($method === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
    if ($method !== $expectedMethod) {
        throw new HttpError(405, 'method-not-allowed');
    }
}

/**
 * Objects are decoded as stdClass (not as arrays), so empty JSON objects stay objects when they are encoded again.
 */
function readJsonRequestBody(): stdClass
{
    $body = json_decode(file_get_contents('php://input') ?: '', false);
    if (!($body instanceof stdClass)) {
        throw new HttpError(400, 'invalid-json-body');
    }
    return $body;
}

function sendJson(int $status, array $data): void
{
    sendRawJson($status, encodeJson($data));
}

function sendRawJson(int $status, string $json): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo $json;
}

function encodeJson(mixed $value): string
{
    return json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRESERVE_ZERO_FRACTION | JSON_THROW_ON_ERROR);
}

/** Runs an endpoint and turns thrown errors into JSON error responses. */
function handleRequest(string $expectedMethod, callable $handleEndpoint): void
{
    $config = [];
    try {
        $config = loadConfig();
        prepareRequest($config, $expectedMethod);
        $handleEndpoint($config);
    } catch (HttpError $error) {
        sendJson($error->status, ['error' => $error->errorCode] + $error->details);
    } catch (Throwable $error) {
        error_log('Dune session API: ' . $error);
        sendInternalError($error, $config['showInternalErrorDetails'] ?? false);
    }
}

function sendInternalError(Throwable $error, bool $shouldShowDetails): void
{
    $response = ['error' => 'internal-error'];
    if ($shouldShowDetails) {
        $response['details'] = get_class($error) . ': ' . $error->getMessage();
    }
    sendJson(500, $response);
}

function sendCorsHeaders(array $allowedOrigins): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '' || !in_array($origin, $allowedOrigins, true)) {
        return;
    }
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Vary: Origin');
}
