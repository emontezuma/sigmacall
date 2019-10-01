<?php


  header("Access-Control-Allow-Origin: *");
  header('Content-type: text/html; charset=utf-8');

  $accion = $_GET['accion'];
  require_once('Funciones.php');



  $funciones = new Funciones();

  if ($accion=='consulta') {
    $sentencia = $_GET['sentencia'];
    $datos=$funciones->consulta($sentencia);
  }
  else if ($accion=='actualizar') {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizar($data);
  }
  else if ($accion=='renombrar') {
    $sentencia = $_GET['consulta'];
    $id = $_GET['id'];
    $datos=$funciones->renombrar($sentencia, $id);
  }
  else if ($accion=='ver_carpetas') {
    $dir = "./imagenes/";
    $return_array = array();
    if(is_dir($dir)){
        if($dh = opendir($dir)){
            while(($file = readdir($dh)) != false){
                if($file == "." or $file == ".."){
                } else {
                    $return_array[] = $file;
                }
            }
        }
    echo json_encode($return_array);
    }
  }
  else if ($accion=='exportar') {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->exportar($data);
  }

?>
