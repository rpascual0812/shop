<?php
require_once('../connect.php');
require_once('../../CLASSES/Categories.php');

$class = new Categories(
							$_POST['pk'],
							NULL,
							NULL,
							NULL							
						);

$data = $class->fetch();

header("HTTP/1.0 500 Internal Server Error");
if($data['status']==true){
	header("HTTP/1.0 200 OK");
}

header('Content-Type: application/json');
print(json_encode($data));
?>