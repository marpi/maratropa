<?php
require "twitteroauth/autoload.php";

use Abraham\TwitterOAuth\TwitterOAuth;

$access_token=[];
$access_token_secret=[];
$consumer_key=[];
$consumer_secret=[];

$consumer_key[0] = 'jTefsC6utbtnZSqh3EuKCZPTl';
$consumer_secret[0] = 'TI35TGKjqsUThxMZADG4nI4wb7VKUfVfRa3vzFIH5XbsgsuBmg';
$access_token[0] = '130622344-JHd6lOropbprd0AHJDsw8MW8pJxzqlQijw5Q8GG2';
$access_token_secret[0] = '1GuXEM8PYoGbF33GchrfnZXgBfiq1x5BAX4bCs3OTGsyG';

$random = rand(0,count($access_token)-1);
$connection = new TwitterOAuth($consumer_key[$random], $consumer_secret[$random], $access_token[$random], $access_token_secret[$random]);

?>