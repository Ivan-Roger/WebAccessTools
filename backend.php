<?php
define("APP_VERSION","0.1.0");

header("X-Application:"."WebAccessTools");
header("X-Version:".APP_VERSION);
header("Content-type:"."application/json");

function newRoot() {
	$res = newFolder('root','Racine');
	$res['type'] = "root";
	return $res;
}
function newFolder($id,$nom) {
	$res['id'] = $id;
	$res['text'] = $nom;
	$res['state']['opened'] = true;
	$res['state']['selected'] = false;
	$res['state']['disabled'] = false;
	$res['li_attr'] = new ArrayObject();
	$res['a_attr'] = new ArrayObject();
	$res['children'] = Array();
	$res['type'] = "default";
	return $res;
}
function newFile($id,$nom) {
	$res['id'] = $id;
	$res['text'] = $nom;
	$res['state']['opened'] = false;
	$res['state']['selected'] = false;
	$res['state']['disabled'] = false;
	$res['li_attr'] = new ArrayObject();
	$res['a_attr'] = new ArrayObject();
	$res['children'] = Array();
	$res['type'] = "file";
	return $res;
}
function addChild($parent,$child) {
	$parent['children'][] = $child;
	return $parent;
}

if (isset($_GET['op'])) {
	if ($_GET['op']=="recup") {
		$res['operation']=$_GET['op']; // Action performed
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
	} elseif ($_GET['op']=="files") {
		$root = addChild(newRoot(),addChild(newFolder('docs','Mes Documents'),newFile('file1','test.txt')));
		$res[] = $root;
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
