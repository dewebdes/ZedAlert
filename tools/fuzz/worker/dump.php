<?php
print_r($_REQUEST);
echo '<hr>';
print_r(apache_request_headers());
echo '<hr>';
print_r($_SERVER['HTTP_COOKIE']);
echo '<hr>';
print_r($_SERVER);
echo '<hr>';
$entityBody = file_get_contents('php://input');
print_r($entityBody);
?>