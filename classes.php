<?php

class RootFolder {
  private $childs = Array();

  function addChild($child) {
    $this->childs[] = $child;
    return $this;
  }

  function export() {
    	$res['id'] = "root";
    	$res['text'] = "Racine";
    	$res['state']['opened'] = true;
    	$res['state']['selected'] = true;
    	$res['state']['disabled'] = false;
    	$res['li_attr'] = new ArrayObject();
    	$res['a_attr'] = new ArrayObject();
      $childs = Array();
      foreach($this->childs as $c) {
        $childs[] = $c->export();
      }
      $res['children'] = $childs;
    	$res['type'] = "root";
    	return $res;
  }
}

class Folder {
  private static $NEXT_ID=0;
  private $id;
  private $name;
  private $childs = Array();

  function __construct($name) {
    $this->id = "folder-".Folder::$NEXT_ID++;
    $this->name = $name;
  }

  function addChild($child) {
    $this->childs[] = $child;
    return $this;
  }

  function export() {
    	$res['id'] = $this->id;
    	$res['text'] = $this->name;
    	$res['state']['opened'] = true;
    	$res['state']['selected'] = false;
    	$res['state']['disabled'] = false;
    	$res['li_attr'] = new ArrayObject();
    	$res['a_attr'] = new ArrayObject();
      $childs = Array();
      foreach($this->childs as $c) {
        $childs[] = $c->export();
      }
      $res['children'] = $childs;
    	$res['type'] = "default";
    	return $res;
  }
}

class File {
  private static $NEXT_ID=0;
  private $id;
  private $name;
  private $type;

  function __construct($name,$type) {
    $this->id = "file-".File::$NEXT_ID++;
    $this->name = $name;
    $this->type = $type;
  }

  function getIcon() {
    return ($this->type=='editor'?'fa fa-file-text-o':null);
  }

  function export() {
    	$res['id'] = $this->id;
    	$res['text'] = $this->name;
      $icon = $this->getIcon();
      if ($icon!=null)
        $res['icon'] = $icon;
    	$res['state']['opened'] = false;
    	$res['state']['selected'] = false;
    	$res['state']['disabled'] = false;
    	$res['li_attr'] = new ArrayObject();
    	$res['a_attr'] = new ArrayObject();
    	$res['children'] = Array();
      $res['data']['type'] = $this->type;
    	$res['type'] = "file";
    	return $res;
  }
}

function rscandir($dir) {
	$scan = scandir($dir);
	array_shift($scan);
	array_shift($scan);
  $r['dirs'] = Array();
	$r['files'] = Array();
	foreach ($scan as $e) {
		if (is_dir($dir.'/'.$e)) {
			$r['dirs'][$e]=rscandir($dir.'/'.$e);
		} else if (is_file($dir.'/'.$e)) {
			$r['files'][]=$e;
    }
	}
	return $r;
}

function exportDir($dir) {
  $elems = rscandir($dir);
  $root = new RootFolder();
  createFilesObjectWorker($elems,$root);
  return $root->export();
}

function createFilesObjectWorker($elems,$out) {
  foreach ($elems['files'] as $f) {
    $out->addChild(new File($f,'editor'));
  }
  foreach ($elems['dirs'] as $d => $e) {
    $f = new Folder($d);
    createFilesObjectWorker($e,$f);
    $out->addChild($f);
  }
}
?>
