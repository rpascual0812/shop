<?php
require_once('../connect.php');
require_once('../../CLASSES/Orders.php');

$class = new Orders(
						NULL,
                        NULL,
                        NULL,
                        NULL,
                        NULL
					);



$data = $class->create($_POST);

header("HTTP/1.0 500 Internal Server Error");
if($data['status']==true){
	header("HTTP/1.0 200 OK");
}

header('Content-Type: application/json');
print(json_encode($data));
?>