<?php
// Configuration for the local Docker backend (see docker-compose.yml). Contains no real credentials.
return [
    'database' => [
        'host' => 'database',
        'port' => 3306,
        'name' => 'dune',
        'user' => 'dune',
        'password' => 'dune-local',
    ],
    'allowedOrigins' => ['http://localhost:4200'],
    'deleteSessionsInactiveForDays' => 14,
    'showInternalErrorDetails' => true,
];
