
<?php
    /*
    *   Proyecto: Adittional Aplications by CRONOS
    *   Autor: Efrén Anastacio Simeón
    *   Fecha creación: Domingo, 01 de Julio de 2018
    *   Fecha última modifcación: Domingo, 08 de Julio de 2018
    */

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;


    require('Exception.php');
    require('PHPMailer.php');
    require('SMTP.php');

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
      $datos = $this->conexionFM->consultaRetornoFM($sentencia);
      $envio = array();
      while ($row = mysqli_fetch_assoc($datos))
      {
        $envio[] = $row;
      }
      echo json_encode($envio);
    }

    public function actualizar($datos){
      $sql = $datos['consulta'];
      try
      {
        $resultado = $this->conexionFM->agregarRegistrosFM($sql);
      }
      catch (\Exception $e)
      {
        echo ("[error]");
      }
      echo ("[]");
    }

    public function renombrar($nombre, $id) {
      $hallado = false;
      $consecutivo = 0;
      $cadAdicional = "";

      while (!$hallado)
      {
        if ($consecutivo>0)
        {
          $cadAdicional = " (".$consecutivo.")";
        }
        $miNombre = $nombre.$cadAdicional;
        $sentencia = "SELECT count(*) as cuenta FROM mmcall.requesters where name = '".$miNombre."' AND id <> $id";
        echo($sentencia);
        $resultado = $this->conexionFM->consultaRetornoFM($sentencia);
        while ($row = mysqli_fetch_assoc($resultado))
        {
          if ($row['cuenta'] > 0)
          {
            $consecutivo++;
          }
          else
          {
            $sql = "UPDATE mmcall.requesters SET name = '".$miNombre."' WHERE id = $id";
            $resultado2 = $this->conexionFM->agregarRegistrosFM($sql);
            $hallado = true;
          }
        }
      }
    }

    public function exportar($datos) {
      $desde = $datos['desde'];
      $hasta = $datos['hasta'];
      $idMail = $datos['id'];
      $cadena = $datos['cadena'];

      $sentencia= "SELECT * FROM z2_correos where id = $idMail";
      $resultado = $this->conexionFM->consultaRetornoFM($sentencia);
      while ($rowMail = mysqli_fetch_assoc($resultado))
      {
          $sentencia= "SELECT * FROM z2_configuracion";
          $resultado = $this->conexionFM->consultaRetornoFM($sentencia);
          while ($rowConfig = mysqli_fetch_assoc($resultado))
          {
            if ($rowConfig['cuenta'] && $rowConfig['contrasena'] && $rowConfig['host2'] && $rowConfig['puerto'])
            {


              $csv = fopen('llamadas.csv', 'w');
              if($csv)
              {
                fputcsv($csv,array ('Historico de llamadas'));
                $sentencia= "SELECT 'Llamada(ID)', 'Placas','Chofer','Transportista','Inicio de llamada','Mensaje','Fin de llamada','Duracion (seg)','ID del chofer','ID del transportista', 'ID del requester MMCall'";
                $resultado = $this->conexionFM->consultaRetornoFM($sentencia);
                $row = mysqli_fetch_assoc($resultado);
                fputcsv($csv, $row);
                $sentencia= "SELECT z2_mensajes.id, z2_mensajes.placas, z2_choferes.nombre, z2_transportistas.razonsocial, z2_mensajes.fecha, z2_mensajes.mensaje, IFNULL(z2_mensajes.termino, ''), IF(ISNULL(z2_mensajes.termino), 0, TIME_TO_SEC(TIMEDIFF(z2_mensajes.termino, z2_mensajes.fecha))), z2_mensajes.chofer, z2_mensajes.transportista, z2_mensajes.requester FROM z2_mensajes LEFT JOIN z2_choferes ON z2_mensajes.chofer = z2_choferes.id LEFT JOIN z2_transportistas ON z2_mensajes.transportista = z2_transportistas.id WHERE z2_mensajes.fecha >= '$desde' and z2_mensajes.fecha <= '$hasta' ORDER BY z2_mensajes.id DESC";
                $resultado = $this->conexionFM->consultaRetornoFM($sentencia);
                while ($row = mysqli_fetch_assoc($resultado))
                {
                  fputcsv($csv, $row);
                }
    //Se envía el mail

                $mail = new PHPMailer(true);

                try {
                    //Server settings
                    $mail->CharSet = 'UTF-8';
                    $mail->SMTPDebug = 0;                                       // Enable verbose debug output
                    $mail->isSMTP();                                            // Set mailer to use SMTP
                    $mail->Host       = $rowConfig['host2'];  // Specify main and backup SMTP servers
                    $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
                    $mail->Username   = $rowConfig['cuenta'];                     // SMTP username
                    $mail->Password   = $rowConfig['contrasena'];                      // SMTP password
                    $mail->SMTPSecure = 'tls';                                  // Enable TLS encryption, `ssl` also accepted
                    $mail->Port       = $rowConfig['puerto'];;                                    // TCP port to connect to
                    $mail->setFrom($rowConfig['cuenta'], 'Beepers - correo informativo');
                    //Recipients
                    $cuentas = explode(",", $rowMail['lista']);
                    foreach ($cuentas as $valor) {
                        $mail->addAddress($valor);
                    }
                    //$mail->addAddress('ellen@example.com');               // Name is optional
                    //$mail->addReplyTo('info@example.com', 'Information');
                    //$mail->addCC('cc@example.com');
                    //$mail->addBCC('bcc@example.com');

                    // Attachments
                    $mail->addAttachment('llamadas.csv');         // Add attachments
                    //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name

                    // Content
                    $mail->isHTML(true);                                  // Set email format to HTML
                    $mail->Subject = $rowMail['titulo'];
                    $mail->Body    = $rowMail['cuerpo'];
                    //$mail->AltBody = 'Pasamelo hermanazo';

                    $mail->send();
                } catch (Exception $e) {
                    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
                }
              }
            }
          }
        }
      }
  }
?>
