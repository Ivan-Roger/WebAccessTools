<?php
require_once("classes.php");
$res[] = exportDir('files');
var_dump(json_encode($res[0],JSON_PRETTY_PRINT));
switch(json_last_error()) {
  case JSON_ERROR_NONE:
    echo("Pas d'erreur");
    break;
  case JSON_ERROR_DEPTH:
    echo("Erreur profondeur");
    break;
  case JSON_ERROR_STATE_MISMATCH:
    echo("Erreur STATE_MISMATCH");
    break;
  case JSON_ERROR_CTRL_CHAR:
    echo("Erreur charactère de contrôle");
    break;
  case JSON_ERROR_SYNTAX:
    echo("Erreur de syntaxe");
    break;
  case JSON_ERROR_UTF8:
    echo("Erreur d'encodage");
    break;
  case JSON_ERROR_RECURSION:
    echo("Erreur de recursivité");
    break;
  case JSON_ERROR_INF_OR_NAN:
    echo("Erreur INF ou NAN");
    break;
  case JSON_ERROR_UNSUPPORTED_TYPE:
    echo("Erreur type non supporté");
    break;
}
?>
