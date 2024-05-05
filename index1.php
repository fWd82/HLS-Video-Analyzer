<?php
// Base URL for the content
// $base_url = "https://vod.fawadiqbal.me/asset/913fadd0be3c156283dd9611bedb0fff/play_video/";

// ini_set('display_errors', 1);
// error_reporting(E_ALL);

// header('Access-Control-Allow-Origin: *');

$full_url = $_GET['inputValue'];
// $full_url = "https://vod.fawadiqbal.me/asset/913fadd0be3c156283dd9611bedb0fff/play_video/index.m3u8";
// Find the last occurrence of '/'
$last_slash_position = strrpos($full_url, '/');
// Extract the URL up to the last '/'
$base_url = substr($full_url, 0, $last_slash_position + 1);

// Fetch the main m3u8 file
$main_m3u8_url = $base_url . "index.m3u8";
// $main_m3u8_url = $base_url;

$ch = curl_init($main_m3u8_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$main_m3u8_content = curl_exec($ch);
curl_close($ch);

// Find all sub-playlist .m3u8 files in the main m3u8 content
preg_match_all('/([^\s]+\.m3u8)/', $main_m3u8_content, $matches);
$sub_playlists = $matches[1];

$ts_files = [];
foreach ($sub_playlists as $sub_playlist) {
    // Fetch each sub-playlist
    $sub_playlist_url = $base_url . $sub_playlist;
    $ch = curl_init($sub_playlist_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $sub_playlist_content = curl_exec($ch);
    curl_close($ch);

    // Extract .ts file URLs from the sub-playlist content
    preg_match_all('/([^\s]+\.ts)/', $sub_playlist_content, $ts_matches);
    foreach ($ts_matches[1] as $ts_file) {
        $ts_files[] = $base_url . $ts_file; // Assuming .ts files are relative to the base URL
    }
}

header('Content-Type: application/json');
echo json_encode($ts_files);
?>
