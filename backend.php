<?php
define("APP_VERSION","0.1.0");

header("X-Application:"."WebAccessTools");
header("X-Version:".APP_VERSION);
header("Content-type:"."application/json");

if (isset($_GET['op'])) {
	$res['operation']=$_GET['op']; // Action performed
	if ($_GET['op']=="recup") {
		if (isset($_GET['file']) && $_GET['file']!="") {
			if (is_file("files/".$_GET['file'])) {
				sleep(2);
				$res['data'] = file_get_contents(str_replace("..","","files/".$_GET['file']));
				$res['status']="200"; // Status code
				$res['message']="Success !"; // Displayable message
			} else {
				$res['status']="404"; // Status code
				$res['message']="No such file !"; // Displayable message
			}
		} else {
			$res['status']="402"; // Status code
			$res['message']="Missing file parameter."; // Displayable message
		}
	} else {
		$res['status']="401"; // Status code
		$res['message']="Unknown operation."; // Displayable message
	}
} else {
	$res['operation']="none"; // Action performed
	$res['status']="401"; // Status code
	$res['message']="No operation to perform."; // Displayable message
}
//http_response_code($res['status']);
echo(json_encode($res, JSON_PRETTY_PRINT));
?>
