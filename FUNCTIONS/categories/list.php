<?php
require_once('../connect.php');
require_once('../../CLASSES/Categories.php');

$class = new Categories(
							NULL,
							$_POST['classifications_pk'],
							NULL,
							$_POST['archived']
						);

$data = $class->fetch();

header("HTTP/1.0 500 Internal Server Error");
if($data['status']==true){
	header("HTTP/1.0 200 OK");
}

header('Content-Type: application/json');
print(json_encode($data));
?>