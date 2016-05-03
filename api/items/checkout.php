<?php
require_once('../../FUNCTIONS/connect.php');
require_once('../../CLASSES/Items.php');

$class = new Items(
						NULL,
                        $_GET['mobile_number'],
                        NULL,
                        NULL,
                        NULL,
                        NULL
					);

$items = $_GET['items'];

$data = $class->fetch();

header("HTTP/1.0 500 Internal Server Error");
if($data['status']==true){
	header("HTTP/1.0 200 OK");
}

header('Content-Type: application/json');
print(json_encode($data));
?>
