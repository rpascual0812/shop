<?php
require_once('../../FUNCTIONS/connect.php');
require_once('../../CLASSES/Items.php');

$class = new Items(
						NULL,
                        $_GET['categories_pk'],
                        NULL,
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