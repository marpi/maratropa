<?php
if(!preg_match("#https?://#", $_GET['path'])) {
        header("HTTP/1.1 404 Not found");
        echo "Content not found, bad URL!";
        exit();
}

header('Access-Control-Allow-Origin: *');
header('Content-Type: image/jpeg');

echo file_get_contents($_GET['path']);
?>