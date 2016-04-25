<?php
require_once('../connect.php');
require_once('../../CLASSES/Items.php');

$class = new Items(
						NULL,
                        $_POST['categories_pk'],
                        NULL,
                        NULL,
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