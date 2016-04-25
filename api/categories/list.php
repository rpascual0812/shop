<?php
require_once('../../FUNCTIONS/connect.php');
require_once('../../CLASSES/Categories.php');

$class = new Categories(
							NULL,
							NULL,
							$_GET['archived']
						);

$data = $class->fetch();

header("HTTP/1.0 500 Internal Server Error");
if($data['status']==true){
	header("HTTP/1.0 200 OK");
}

header('Content-Type: application/json');
print(json_encode($data));
?>