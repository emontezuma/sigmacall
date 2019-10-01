<?php

mysqli_report(MYSQLI_REPORT_STRICT);

/*
 *   Proyecto: Reportes de manteniiento Federal Mogul
 *   Autor: Elvis Montezuma
 *   Fecha: Diciembre de 2018
*/

class ConexionFM{
/*
*/
    private $datos = array(
        "host" => "localhost",
        "user" => "root",
        "pass" => "usbw",
        "db" => "sigma"
    );


    private $connectionFM;
    private $validateConnectionFM;

    public function __construct(){
      try {
        $this->abrirBDFM();
      }catch (Exception $e) {
        echo('error en  conexion');
      }
    }

      public function abrirBDFM() {
      try {
          $this->connectionFM = new \mysqli($this->datos['host'],
              $this->datos['user'],
              $this->datos['pass'],
              $this->datos['db']
          );
          $this->connectionFM->set_charset("utf8");
        } catch (mysqli_sql_exception $e) {
           throw $e;
        }
      }

    public function BDCConsultaS($sql){
        $this->connectionFM->query($sql);
    }

    public function BDCConsultaM($sql){
        $datos = $this->connectionFM->query($sql);
        return $datos;
    }

    public function BDCActualiza($sql){
        $datos = $this->connectionFM->query($sql);
        return $this->connectionFM->affected_rows;
    }

    public function BDCAgrega($sql){
        $datos = $this->connectionFM->query($sql);
        return $this->connectionFM->insert_id;
    }
}
