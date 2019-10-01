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
  else if ($accion=='actualizar_alerta') {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizar_alerta($data);
  }
  else if ($accion=='actualizar') {
    $sentencia = $_GET['sentencia'];
    $datos=$funciones->actualizar($sentencia);
  }
  else if ($accion=='eliminar_alerta') {
    $id = $_GET['id'];
    $datos=$funciones->eliminar_alerta($id);
  }
  else if ($accion=='eliminar_comodin') {
    $id = $_GET['id'];
    $datos=$funciones->eliminar_comodin($id);
  }

  else if ($accion=='actualizar_recipiente') {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizar_recipiente($data);
  }
  else if ($accion=='eliminar_recipiente') {
    $id = $_GET['id'];
    $datos=$funciones->eliminar_recipiente($id);
  }
  else if ($accion=='actualizar_reporte') {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizar_reporte($data);
  }
  else if ($accion=='actualizar_usuario') {
    $data = json_decode(file_get_contents('php://input'), true);
    $datos=$funciones->actualizar_usuario($data);
  }
  else if ($accion=='eliminar_canal') {
    $id = $_GET['id'];
    $datos=$funciones->eliminar_canal($id);
  }
  else if ($accion=='recuperar_imagenes') {
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
    else
    {
      $respuesta = ["vacio"];
      echo json_encode($respuesta);
    }
  }
?>
