<?php

define("MYSQL_CONN_ERROR", "Unable to connect to database.");
mysqli_report(MYSQLI_REPORT_STRICT);

/*
 *   Proyecto: Adittional Aplications by CRONOS
 *   Autor: Efrén Anastacio Simeón
 *   Fecha creación: Martes, 26 de Junio de 2018
 *   Fecha última modifcación: Domingo, 01 de Julio de 2018
*/

class Conexion{
/*
    private $datos = array(
        "host" => "localhost",
        "user" => "root",
        "pass" => "usbw",
        "db" => "mmcall"
    );
*/
    private $datos = array(
        "host" => "localhost",
        "user" => "root",
        "pass" => "usbw",
        "db" => "mmcall"

    );


    private $connection;
    private $validateConnection;

    public function __construct(){
      try {
        $this->abrirBD();
      }catch (Exception $e) {
        echo('error en  conexion');
      }
    }

      public function abrirBD() {
      try {
          $this->connection = new \mysqli($this->datos['host'],
              $this->datos['user'],
              $this->datos['pass'],
              $this->datos['db']
          );
          $this->connection->set_charset("utf8");
        } catch (mysqli_sql_exception $e) {
           throw $e;
        }
      }

    public function consultaSimple($sql){
        $this->connection->query($sql);
    }

    public function consultaRetorno($sql){
        $datos = $this->connection->query($sql);
        return $datos;
    }

    public function agregarRegistros($sql){
        $datos = $this->connection->query($sql);
        $id = mysqli_insert_id($this->connection);
        return $id;
    }

    public function validar(){
        if($this->connection){
            $this->validadeConnection = true;
        }
        return $this->validateConnection;
    }


}
