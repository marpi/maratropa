<?php

if (isset($_POST['screen'])) {
   //echo base64_decode($_POST['screen']);
   // requires php5
	define('UPLOAD_DIR', 'user/');
	$data = base64_decode($_POST['screen']);
	$file = UPLOAD_DIR . $_POST['user'] . '.jpg';
        //$file = UPLOAD_DIR . 'marpi_' . '.png';
	
	$success = file_put_contents($file, $data);
	print $success ? $file : 'Unable to save the file.';
}
?>