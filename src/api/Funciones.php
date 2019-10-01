
<?php
    /*
    *   Proyecto: SIGMA
    *   Autor: Elvis Montezuma
    *   Fecha creación: Junio de 2019
    */

    class Funciones{

    private $username;
    private $password;
    private $nombre;
    private $perfil;
    private $estatus;
    private $preguntaSecreta;
    private $respuestaSecreta;
    private $userModifies;
    private $conexion;
    private $conexionFM;
    private $userCreate;
    private $userModify;
    private $divisiones;

    public function __construct(){
      require_once('Conexion.php');
      require_once('ConexionFM.php');
      $this->conexion = new Conexion();
      $this->conexionFM = new ConexionFM();
      date_default_timezone_set ("America/Mexico_City");
    }

    public function set($atributo, $contenido){
      $this->$atributo = $contenido;
    }

    public function get($atributo){
      return $this->$atributo;
    }

    public function consulta($sentencia){
      $datos = $this->conexionFM->BDCConsultaM($sentencia);
      $envio = array();
      while ($row = mysqli_fetch_assoc($datos))
      {
        $envio[] = $row;
      }
      echo json_encode($envio);
    }

    public function actualizar($sentencia){
      try
      {
        $resultado = $this->conexionFM->BDCActualiza($sentencia);
      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($resultado);
    }

    public function eliminar_alerta($id){
      echo($id);
      try
      {
        $resultado = $this->conexionFM->BDCActualiza("DELETE FROM sigma.vw_alertas WHERE id = $id;");
        $resultado = $this->conexionFM->BDCActualiza("DELETE FROM sigma.vw_alerta_fallas WHERE alerta = $id;");
      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($resultado);
    }

    public function eliminar_comodin($id){
      echo($id);
      try
      {
        $resultado = $this->conexionFM->BDCActualiza("DELETE FROM sigma.vw_alerta_fallas WHERE alerta = $id;");
      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($resultado);
    }


    public function actualizar_alerta($datos){
      $id = $datos['id'];
      $referencia = "'".$datos['referencia']."'";
      $nombre = "'".$datos['nombre']."'";
      $usuario = $datos['usuario'];
      $notas = "'".$datos['notas']."'";
      $tipo = $datos['tipo'];
      $estatus = "'".$datos['estatus']."'";
      $solapar = "'".$datos['solapar']."'";
      $informar = "'".$datos['informar']."'";
      $miPrioridad = $datos['miPrioridad'];
      $miAcumular = "'".$datos['miAcumular']."'";
      $veces = $datos['veces'];
      $tiempo = $datos['tiempo'];
      $reiniciar = "'".$datos['reiniciar']."'";
      $miMensaje = "'".$datos['miMensaje']."'";
      $personalizado = "'".$datos['personalizado']."'";
      $log1 = "'".$datos['log1']."'";
      $sms1 = "'".$datos['sms1']."'";
      $llamada1 = "'".$datos['llamada1']."'";
      $correo1 = "'".$datos['correo1']."'";
      $mmcall1 = "'".$datos['mmcall1']."'";
      $miLista0 = $datos['miLista0'];
      $miRepetir = "'".$datos['miRepetir']."'";
      $tiemporep = $datos['tiemporep'];
      $log1rep = "'".$datos['log1rep']."'";
      $sms1rep = "'".$datos['sms1rep']."'";
      $correo1rep = "'".$datos['correo1rep']."'";
      $llamada1rep = "'".$datos['llamada1rep']."'";
      $mmcall1rep = "'".$datos['mmcall1rep']."'";
      $miRepetirEs1 = "'".$datos['miRepetirEs1']."'";
      $tiempoesc1 = $datos['tiempoesc1'];
      $logesc1 = "'".$datos['logesc1']."'";
      $smsesc1 = "'".$datos['smsesc1']."'";
      $correoesc1 = "'".$datos['correoesc1']."'";
      $llamadaesc1 = "'".$datos['llamadaesc1']."'";
      $mmcallesc1 = "'".$datos['mmcallesc1']."'";
      $repetir1 = "'".$datos['repetir1']."'";

      $miLista1 = $datos['miLista1'];
      $miRepetirEs2 = "'".$datos['miRepetirEs2']."'";
      $tiempoesc2 = $datos['tiempoesc2'];
      $logesc2 = "'".$datos['logesc2']."'";
      $smsesc2 = "'".$datos['smsesc2']."'";
      $correoesc2 = "'".$datos['correoesc2']."'";
      $llamadaesc2 = "'".$datos['llamadaesc2']."'";
      $mmcallesc2 = "'".$datos['mmcallesc2']."'";
      $repetir2 = "'".$datos['repetir2']."'";
      $miLista2 = $datos['miLista2'];
      $miRepetirEs3 = "'".$datos['miRepetirEs3']."'";
      $tiempoesc3 = $datos['tiempoesc3'];
      $logesc3 = "'".$datos['logesc3']."'";
      $smsesc3 = "'".$datos['smsesc3']."'";
      $correoesc3 = "'".$datos['correoesc3']."'";
      $llamadaesc3 = "'".$datos['llamadaesc3']."'";
      $mmcallesc3 = "'".$datos['mmcallesc3']."'";
      $repetir3 = "'".$datos['repetir3']."'";
      $miLista3 = $datos['miLista3'];
      $miRepetirEs4 = "'".$datos['miRepetirEs4']."'";
      $tiempoesc4 = $datos['tiempoesc4'];
      $logesc4 = "'".$datos['logesc4']."'";
      $smsesc4 = "'".$datos['smsesc4']."'";
      $correoesc4 = "'".$datos['correoesc4']."'";
      $llamadaesc4 = "'".$datos['llamadaesc4']."'";
      $mmcallesc4 = "'".$datos['mmcallesc4']."'";
      $repetir4 = "'".$datos['repetir4']."'";
      $miLista4 = $datos['miLista4'];
      $miRepetirEs5 = "'".$datos['miRepetirEs5']."'";
      $tiempoesc5 = $datos['tiempoesc5'];
      $logesc5 = "'".$datos['logesc5']."'";
      $smsesc5 = "'".$datos['smsesc5']."'";
      $correoesc5 = "'".$datos['correoesc5']."'";
      $llamadaesc5 = "'".$datos['llamadaesc5']."'";
      $mmcallesc5 = "'".$datos['mmcallesc5']."'";
      $repetir5 = "'".$datos['repetir5']."'";
      $miLista5 = $datos['miLista5'];
      $escape_estacion = "'".$datos['escape_estacion']."'";
      $escape_llamadas = $datos['escape_llamadas'];
      $miEscape = "'".$datos['miEscape']."'";
      $mensajeEsc = "'".$datos['mensajeEsc']."'";
      $miListaE = $datos['miListaE'];

      if ($id == 0)
      {
        $sql =
        "INSERT INTO sigma.vw_alertas
          (referencia, nombre, tipo, prioridad, notas, acumular, acumular_veces, acumular_tiempo, acumular_inicializar, acumular_tipo_mensaje,
            acumular_mensaje, log, sms, correo, llamada, mmcall, lista,
            escalar1, tiempo1, lista1, log1, sms1, correo1, llamada1, mmcall1, repetir1,
            escalar2, tiempo2, lista2, log2, sms2, correo2, llamada2, mmcall2, repetir2,
            escalar3, tiempo3, lista3, log3, sms3, correo3, llamada3, mmcall3, repetir3,
            escalar4, tiempo4, lista4, log4, sms4, correo4, llamada4, mmcall4, repetir4,
            escalar5, tiempo5, lista5, log5, sms5, correo5, llamada5, mmcall5, repetir5,
            repetir, repetir_tiempo, repetir_log, repetir_sms, repetir_correo, repetir_llamada, repetir_mmcall,
            escape_veces, escape_accion, escape_mensaje, escape_lista, escape_estacion,
            informar_resolucion, solapar, estatus, creado, modificado, creacion, modificacion)
          VALUES
            ($referencia, $nombre, $tipo, $miPrioridad, $notas, $miAcumular, $veces, $tiempo, $reiniciar, $miMensaje,
            $personalizado, $log1, $sms1, $correo1, $llamada1, $mmcall1, $miLista0,
            $miRepetirEs1, $tiempoesc1, $miLista1, $logesc1, $smsesc1, $correoesc1, $llamadaesc1, $mmcallesc1, $mmcallesc1,
            $miRepetirEs2, $tiempoesc2, $miLista2, $logesc2, $smsesc2, $correoesc2, $llamadaesc2, $mmcallesc2, $mmcallesc2,
            $miRepetirEs3, $tiempoesc3, $miLista3, $logesc3, $smsesc3, $correoesc3, $llamadaesc3, $mmcallesc3, $mmcallesc3,
            $miRepetirEs4, $tiempoesc4, $miLista4, $logesc4, $smsesc4, $correoesc4, $llamadaesc4, $mmcallesc4, $mmcallesc4,
            $miRepetirEs5, $tiempoesc5, $miLista5, $logesc5, $smsesc5, $correoesc5, $llamadaesc5, $mmcallesc5, $mmcallesc5,
            $miRepetir, $tiemporep, $log1rep, $sms1rep, $correo1rep, $llamada1rep, $mmcall1rep,
            $escape_llamadas, $miEscape, $mensajeEsc, $miListaE, $escape_estacion, $informar, $solapar, 'A',
             $usuario,  $usuario, NOW(), NOW());";
      }
      else
      {

        $sql =
        "UPDATE sigma.vw_alertas
          SET referencia = $referencia, nombre = $nombre, tipo = $tipo, prioridad = $miPrioridad,
          notas = $notas, acumular = $miAcumular, acumular_veces = $veces, acumular_tiempo = $tiempo,
          acumular_inicializar = $reiniciar, acumular_tipo_mensaje = $miMensaje, acumular_mensaje = $personalizado,
          log = $log1, sms = $sms1, correo = $correo1, llamada = $llamada1, mmcall = $mmcall1, lista = $miLista0,
          escalar1 = $miRepetirEs1, tiempo1 = $tiempoesc1, lista1 = $miLista1, log1 = $logesc1, sms1 = $smsesc1, correo1 = $correoesc1, llamada1 = $llamadaesc1, mmcall1 = $mmcallesc1, repetir1 = $repetir1,
          escalar2 = $miRepetirEs2, tiempo2 = $tiempoesc2, lista2 = $miLista2, log2 = $logesc2, sms2 = $smsesc2, correo2 = $correoesc2, llamada2 = $llamadaesc2, mmcall2 = $mmcallesc2, repetir2 = $repetir2,
          escalar3 = $miRepetirEs3, tiempo3 = $tiempoesc3, lista3 = $miLista3, log3 = $logesc3, sms3 = $smsesc3, correo3 = $correoesc3, llamada3 = $llamadaesc3, mmcall3 = $mmcallesc3, repetir3 = $repetir3,
          escalar4 = $miRepetirEs4, tiempo4 = $tiempoesc4, lista4 = $miLista4, log4 = $logesc4, sms4 = $smsesc4, correo4 = $correoesc4, llamada4 = $llamadaesc4, mmcall4 = $mmcallesc4, repetir4 = $repetir4,
          escalar5 = $miRepetirEs5, tiempo5 = $tiempoesc5, lista5 = $miLista5, log5 = $logesc5, sms5 = $smsesc5, correo5 = $correoesc5, llamada5 = $llamadaesc5, mmcall5 = $mmcallesc5, repetir5 = $repetir5,
          repetir = $miRepetir, repetir_tiempo = $tiemporep, repetir_log = $log1rep, repetir_sms = $sms1rep, repetir_correo = $correo1rep, repetir_llamada = $llamada1rep, repetir_mmcall = $mmcall1rep,
          escape_veces = $escape_llamadas, escape_estacion = $escape_estacion, escape_accion = $miEscape, escape_mensaje = $mensajeEsc, escape_lista = $miListaE,
          solapar = $solapar, informar_resolucion = $informar, estatus = $estatus, modificacion = NOW(), modificado = $usuario
          WHERE id = $id;";
      }
      $accion="A";
      try
      {
        if ($id == 0)
        {

          $resultado = $this->conexionFM->BDCAgrega($sql);
        }
        else
        {
          $accion="U";
          $resultado = $this->conexionFM->BDCActualiza($sql);
        }
      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($accion. $resultado);
    }


    public function eliminar_recipiente($id){
      echo($id);
      try
      {
        $resultado = $this->conexionFM->BDCActualiza("DELETE FROM sigma.cat_distribucion WHERE id = $id;");
        $resultado = $this->conexionFM->BDCActualiza("DELETE FROM sigma.det_distribucion WHERE distribucion = $id;");
      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($resultado);
    }

    public function eliminar_canal($id){
      try
      {
        $resultado = $this->conexionFM->BDCActualiza("DELETE FROM sigma.det_distribucion WHERE distribucion = $id;");
      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($resultado);
    }


    public function actualizar_recipiente($datos){
      $id = $datos['id'];
      $referencia = "'".$datos['referencia']."'";
      $nombre = "'".$datos['nombre']."'";
      $telefonos = "'".$datos['telefonos']."'";
      $correos = "'".$datos['correos']."'";
      $mmcall = "'".$datos['mmcall']."'";
      $usuario = $datos['usuario'];
      $estatus ="'".$datos['estatus']."'";

      if ($id == 0)
      {
        $sql =
        "INSERT INTO sigma.cat_distribucion
          (referencia, nombre, telefonos, correos, mmcall, estatus, creado, modificado, creacion, modificacion)
          VALUES
            ($referencia, $nombre, $telefonos, $correos, $mmcall, 'A', $usuario,  $usuario, NOW(), NOW());";
      }
      else
      {

        $sql =
        "UPDATE sigma.cat_distribucion
          SET referencia = $referencia, nombre = $nombre, telefonos = $telefonos, correos = $correos, mmcall = $mmcall, estatus = $estatus, modificacion = NOW(), modificado = $usuario
          WHERE id = $id;";
      }
      $accion="A";
      try
      {
        if ($id == 0)
        {

          $resultado = $this->conexionFM->BDCAgrega($sql);
        }
        else
        {
          $accion="U";
          $resultado = $this->conexionFM->BDCActualiza($sql);
        }
      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($accion. $resultado);
    }

    public function actualizar_reporte($datos){
      $id = $datos['id'];
      $nombre = "'".$datos['nombre']."'";
      $para = "'".$datos['para']."'";
      $copia = "'".$datos['copia']."'";
      $oculta = "'".$datos['oculta']."'";
      $titulo = "'".$datos['titulo']."'";
      $cuerpo = "'".$datos['cuerpo']."'";
      $reportes = "'".$datos['reportes']."'";
      $periodos = "'".$datos['periodos']."'";
      $frecuencia = "'".$datos['frecuencia']."'";
      $nperiodos = "'".$datos['nperiodos']."'";
      $usuario = $datos['usuario'];
      $estatus ="'".$datos['estatus']."'";

      if ($id == 0)
      {
$sql =
        "INSERT INTO sigma.cat_correos
          (frecuencia, nombre, para, copia, oculta, titulo, cuerpo, reportes, periodos, nperiodos, estatus, creado, modificado, creacion, modificacion)
          VALUES
            ($frecuencia, $nombre, $para, $copia, $oculta, $titulo, $cuerpo, $reportes, $periodos, $nperiodos, 'A', $usuario,  $usuario, NOW(), NOW());";
      }
      else
      {

        $sql =
        "UPDATE sigma.cat_correos
          SET frecuencia = $frecuencia, nombre = $nombre, para = $para, copia = $copia, oculta = $oculta, titulo = $titulo, cuerpo = $cuerpo, reportes = $reportes, periodos = $periodos, nperiodos = $nperiodos, estatus = $estatus, modificacion = NOW(), modificado = $usuario
          WHERE id = $id;";
      }
      $accion="A";
      try
      {
        if ($id == 0)
        {

          $resultado = $this->conexionFM->BDCAgrega($sql);
        }
        else
        {
          $accion="U";
          $resultado = $this->conexionFM->BDCActualiza($sql);
        }
      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($accion. $resultado);
    }

    public function actualizar_usuario($datos){
      $id = $datos['id'];
      $nombre = "'".$datos['nombre']."'";
      $referencia = "'".$datos['referencia']."'";
      $rol = "'".$datos['rol']."'";
      $cerrar_al_ejecutar = "'".$datos['cerrar_al_ejecutar']."'";
      $vista_resumida_fallas = "'".$datos['vista_resumida_fallas']."'";
      $usuario = $datos['usuario'];
      $estatus ="'".$datos['estatus']."'";

      if ($id == 0)
      {
$sql =
        "INSERT INTO sigma.cat_usuarios
          (referencia, nombre, rol, cerrar_al_ejecutar, vista_resumida_fallas, inicializada, estatus, creado, modificado, creacion, modificacion)
          VALUES
            ($referencia, $nombre, $rol, $cerrar_al_ejecutar, $vista_resumida_fallas, 'S', 'A', $usuario,  $usuario, NOW(), NOW());";
      }
      else
      {

        $sql =
        "UPDATE sigma.cat_usuarios
          SET referencia = $referencia, nombre = $nombre, rol = $rol, cerrar_al_ejecutar = $cerrar_al_ejecutar, vista_resumida_fallas = $vista_resumida_fallas, estatus = $estatus, modificacion = NOW(), modificado = $usuario
          WHERE id = $id;";
      }
      $accion="A";
      try
      {
        if ($id == 0)
        {

          $resultado = $this->conexionFM->BDCAgrega($sql);
        }
        else
        {
          $accion="U";
          $resultado = $this->conexionFM->BDCActualiza($sql);
        }
      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo json_encode($accion. $resultado);
    }

  }
?>
