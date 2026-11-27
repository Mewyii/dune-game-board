<?php
// Copy this file to config.php (not committed) and fill in the IONOS database credentials.
return [
    'database' => [
        'host' => 'db000000000.hosting-data.io',
        'port' => 3306,
        'name' => 'dbs000000',
        'user' => 'dbu000000',
        'password' => 'change-me',
    ],
    // Origins that may call the API from another domain, e.g. the Angular dev server.
    // Requests from the same domain as the API don't need an entry.
    'allowedOrigins' => ['http://localhost:4200'],
    'deleteSessionsInactiveForDays' => 14,
    // Only enable temporarily: adds the internal error message (may contain database details) to 500 responses.
    'showInternalErrorDetails' => false,
];
