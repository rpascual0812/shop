<?php

$data['message'] = "success";
$data['categories'] = array(
							array(
									"pk"=>1,
									"category"=>"Pinoy Classics",
									"description"=>""
								),
							array(
									"pk"=>2,
									"category"=>"Agahan",
									"description"=>""
								),
							array(
									"pk"=>3,
									"category"=>"Tanghalian",
									"description"=>""
								),
							array(
									"pk"=>4,
									"category"=>"Meryenda",
									"description"=>""
								),
							array(
									"pk"=>5,
									"category"=>"Hapunan",
									"description"=>""
								)
						);

header('Content-Type: application/json');
print(json_encode($data));
?>