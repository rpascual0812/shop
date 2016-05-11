<?php
require_once('../../FUNCTIONS/connect.php');
require_once('../../CLASSES/Users.php');

$class = new Users(
						NULL,
						$_GET['mobile_number'],
						$_GET['email_address'],
						$_GET['name'],
						$_GET['location'],
						$_GET['password'],
						NULL
					);

$data = $class->create();

header("HTTP/1.0 404 User Not Found");
if($data['status']){
	// $pk = md5('pk'); 
	// setcookie($pk, md5($data['result'][0]['pk']), time()+7200000, '/');
	header("HTTP/1.0 200 OK");
}

header('Content-Type: application/json');
print(json_encode($data));
?>