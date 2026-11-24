<?php
/**
 * Avis voyageurs — Agence de voyage ABDESALAM NADI
 *
 * GET  /api/reviews.php  -> {"reviews":[...]} (avis publiés, du plus récent au plus ancien)
 * POST /api/reviews.php  -> {"success":true,"review":{...}}
 *
 * Les avis sont stockés dans api/data/reviews.json (dossier protégé par .htaccess).
 * Pour supprimer un avis : retirer son entrée du fichier JSON.
 * Pour valider les avis avant publication : passer AUTO_PUBLISH à false, puis
 * changer "status": "pending" en "published" dans le fichier pour chaque avis accepté.
 */
declare(strict_types=1);

const AUTO_PUBLISH = true;
const MAX_PER_HOUR = 3;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$dir = __DIR__ . '/data';
$file = $dir . '/reviews.json';
$rateFile = $dir . '/rate.json';

function respond(int $code, array $data): void
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function read_json(string $path): array
{
    if (!is_file($path)) {
        return [];
    }
    $data = json_decode((string) file_get_contents($path), true);
    return is_array($data) ? $data : [];
}

function clean($value, int $max): string
{
    $text = trim(preg_replace('/\s+/u', ' ', strip_tags((string) $value)) ?? '');
    return mb_substr($text, 0, $max);
}

function public_review(array $review): array
{
    return [
        'id' => $review['id'],
        'name' => $review['name'],
        'city' => $review['city'] ?? '',
        'trip' => $review['trip'] ?? '',
        'travelDate' => $review['travelDate'] ?? '',
        'rating' => $review['rating'],
        'comment' => $review['comment'],
        'createdAt' => $review['createdAt'],
    ];
}

if (!is_dir($dir) && !mkdir($dir, 0750, true) && !is_dir($dir)) {
    respond(500, ['success' => false, 'error' => 'storage']);
}
if (!is_file($dir . '/.htaccess')) {
    file_put_contents($dir . '/.htaccess', "Require all denied\nDeny from all\n");
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $published = array_filter(
        read_json($file),
        fn($r) => ($r['status'] ?? 'published') === 'published'
    );
    usort($published, fn($a, $b) => strcmp($b['createdAt'], $a['createdAt']));
    respond(200, ['reviews' => array_map('public_review', array_values($published))]);
}

if ($method !== 'POST') {
    header('Allow: GET, POST');
    respond(405, ['success' => false]);
}

$input = json_decode((string) file_get_contents('php://input', false, null, 0, 20000), true);
if (!is_array($input)) {
    respond(400, ['success' => false, 'error' => 'invalid']);
}

$name = clean($input['name'] ?? '', 60);
$city = clean($input['city'] ?? '', 60);
$trip = clean($input['trip'] ?? '', 80);
$travelDate = clean($input['travelDate'] ?? '', 7);
$comment = clean($input['comment'] ?? '', 1000);
$rating = (int) ($input['rating'] ?? 0);

if (
    mb_strlen($name) < 2 ||
    mb_strlen($comment) < 3 ||
    $rating < 1 || $rating > 5 ||
    ($travelDate !== '' && !preg_match('/^\d{4}-(0[1-9]|1[0-2])$/', $travelDate)) ||
    !empty($input['website'])
) {
    respond(422, ['success' => false, 'error' => 'validation']);
}

$lock = fopen($dir . '/.lock', 'c');
if ($lock === false || !flock($lock, LOCK_EX)) {
    respond(500, ['success' => false, 'error' => 'storage']);
}

$ip = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . __FILE__);
$now = time();
$rates = array_filter(read_json($rateFile), fn($t) => is_array($t));
$recent = array_values(array_filter($rates[$ip] ?? [], fn($t) => $now - (int) $t < 3600));
if (count($recent) >= MAX_PER_HOUR) {
    flock($lock, LOCK_UN);
    respond(429, ['success' => false, 'error' => 'rate']);
}
$recent[] = $now;
$rates[$ip] = $recent;
foreach ($rates as $key => $times) {
    if (!array_filter($times, fn($t) => $now - (int) $t < 3600)) {
        unset($rates[$key]);
    }
}

$review = [
    'id' => bin2hex(random_bytes(8)),
    'name' => $name,
    'city' => $city,
    'trip' => $trip,
    'travelDate' => $travelDate,
    'rating' => $rating,
    'comment' => $comment,
    'createdAt' => gmdate('c'),
    'status' => AUTO_PUBLISH ? 'published' : 'pending',
];
$reviews = read_json($file);
$reviews[] = $review;

$ok = file_put_contents($file, json_encode($reviews, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)) !== false
    && file_put_contents($rateFile, json_encode($rates)) !== false;
flock($lock, LOCK_UN);

if (!$ok) {
    respond(500, ['success' => false, 'error' => 'storage']);
}
respond(201, ['success' => true, 'review' => public_review($review), 'status' => $review['status']]);
