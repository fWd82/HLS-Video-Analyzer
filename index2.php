<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');

// URLs for m3u8 and TS files will be dynamically fetched from the m3u8 content
// $main_m3u8_url = "https://vod.fawadiqbal.me/asset/913fadd0be3c156283dd9611bedb0fff/play_video/index.m3u8";

if (isset($_GET['inputValue'])) {
    $full_url = $_GET['inputValue'];
    // $full_url = "https://vod.fawadiqbal.me/asset/913fadd0be3c156283dd9611bedb0fff/play_video/index.m3u8";
    // Find the last occurrence of '/'
    $last_slash_position = strrpos($full_url, '/');
    // Extract the URL up to the last '/'
    $base_url = substr($full_url, 0, $last_slash_position + 1);
} 

// Fetch the main m3u8 file
$main_m3u8_url = $full_url;
// $main_m3u8_url = $base_url . "index.m3u8";

// Initialize cURL session for m3u8
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $main_m3u8_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, false);

// // Execute cURL, fetch m3u8 response, and close cURL session
$m3u8_response = curl_exec($ch);
curl_close($ch);
 
 
    // Return m3u8 headers for the .m3u8 request
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $main_m3u8_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true); // We want headers
    curl_setopt($ch, CURLOPT_NOBODY, true); // We do not need body
    $response = curl_exec($ch);
    curl_close($ch);

    // Extract headers from response
    $headers = [];
    $output = rtrim($response);
    $data = explode("\n", $output);
    foreach ($data as $part) {
        $middle = explode(":", $part, 2);
        if (isset($middle[1])) {
            $headers[trim($middle[0])] = trim($middle[1]);
        }
    }

    header('Content-Type: application/json');
    echo json_encode($headers);
// }
?>
