<?php
require_once("classes.php");

define("APP_VERSION","0.1.0");

header("X-Application:"."WebAccessTools");
header("X-Version:".APP_VERSION);
header("Content-type:"."application/json");

if (isset($_GET['op'])) {
	if ($_GET['op']=="recup") {
		$res['operation']=$_GET['op']; // Action performed
		if (isset($_GET['file']) && $_GET['file']!="") {
			if (is_file("files".$_GET['file'])) {
				$res['data'] = file_get_contents(str_replace("..","","files".$_GET['file']));
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
	} elseif ($_GET['op']=="list") {
		$res[] = exportDir('files');
	} elseif ($_GET['op']=="save") {
		$res['operation']=$_GET['op']; // Action performed
		if (isset($_GET['file']) && $_GET['file']!="") {
			if (isset($_POST['data'])) {
				file_put_contents(str_replace("..","","files".$_GET['file']),$_POST['data']);
				$res['status']="200"; // Status code
				$res['message']="Success !"; // Displayable message
			} else {
				$res['status']="403"; // Status code
				$res['message']="Missing data."; // Displayable message
			}
		} else {
			$res['status']="402"; // Status code
			$res['message']="Missing file parameter."; // Displayable message
		}
	} elseif ($_GET['op']=="mkdir") {
		$res['operation']=$_GET['op']; // Action performed
		if (isset($_GET['path']) && $_GET['path']!="") {
			if (isset($_GET['dir']) && $_GET['dir']!="") {
				if (mkdir($_GET['path'].'/'.$_GET['dir'])) {
					$res['status']="200"; // Status code
					$res['message']="Success !"; // Displayable message
				} else {
					$res['status']="404"; // Status code
					$res['message']="Unable to create directory."; // Displayable message
				}
			} else {
				$res['status']="403"; // Status code
				$res['message']="Missing directory name."; // Displayable message
			}
		} else {
			$res['status']="402"; // Status code
			$res['message']="Missing path."; // Displayable message
		}
	} elseif ($_GET['op']=="rmfile") {
		$res['operation']=$_GET['op']; // Action performed
		if (isset($_GET['path']) && $_GET['path']!="") {
			if (isset($_GET['dir']) && $_GET['dir']!="") {
				if (mkdir($_GET['path'].'/'.$_GET['dir'])) {
					$res['status']="200"; // Status code
					$res['message']="Success !"; // Displayable message
				} else {
					$res['status']="404"; // Status code
					$res['message']="Unable to create directory."; // Displayable message
				}
			} else {
				$res['status']="403"; // Status code
				$res['message']="Missing directory name."; // Displayable message
			}
		} else {
			$res['status']="402"; // Status code
			$res['message']="Missing path."; // Displayable message
		}
	} elseif ($_GET['op']=="rename") {
		$res['operation']=$_GET['op']; // Action performed
		if (isset($_GET['path']) && $_GET['path']!="") {
			if (isset($_GET['dir']) && $_GET['dir']!="") {
				if (mkdir($_GET['path'].'/'.$_GET['dir'])) {
					$res['status']="200"; // Status code
					$res['message']="Success !"; // Displayable message
				} else {
					$res['status']="404"; // Status code
					$res['message']="Unable to create directory."; // Displayable message
				}
			} else {
				$res['status']="403"; // Status code
				$res['message']="Missing directory name."; // Displayable message
			}
		} else {
			$res['status']="402"; // Status code
			$res['message']="Missing path."; // Displayable message
		}
	} else {
		$res['status']="401"; // Status code
		$res['message']="Unknown operation."; // Displayable message
	}
} else {
	$res['operation']="none"; // Action performed
	$res['status']="400"; // Status code
	$res['message']="No operation to perform."; // Displayable message
}
//http_response_code($res['status']);
echo(json_encode($res, JSON_PRETTY_PRINT));
?>
