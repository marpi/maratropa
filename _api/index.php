<?php
include 'connect.php';

$user = null;
$id = null;
if (isset($_GET['user']) && $_GET['user']!="") {
    $user = strtolower ( htmlspecialchars($_GET['user']));
    $user = preg_replace("/[^A-Za-z0-9_]/","",$user);
    if (strlen($user) > 30) $user = substr($user, 0, 30);
    $profile = $connection->get("users/lookup", array("screen_name" => $user));
}else if (isset($_GET['id']) && $_GET['id']!="") {
   $id=$_GET['id'];
   $id = preg_replace("/[^0-9]/","", $id);
   $profile = $connection->get("users/lookup", array("user_id" => $id));
}else{
    exit();
}

echo json_encode ($profile);

/*echo $profile[0]->name;
echo $profile[0]->location;
profile_image_url
profile_banner_url
profile_background_image_url
followers followers_count
following friends_count*/

?>