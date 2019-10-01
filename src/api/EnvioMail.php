<<?php


$mail = new PHPMailer(true);

  try {
      //Server settings
      $mail->CharSet = 'UTF-8';
      $mail->SMTPDebug = 0;                                       // Enable verbose debug output
      $mail->isSMTP();                                            // Set mailer to use SMTP
      $mail->Host       = 'smtp.gmail.com';  // Specify main and backup SMTP servers
      $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
      $mail->Username   = 'elvis.montezuma@gmail.com';                     // SMTP username
      $mail->Password   = 'ElVi$1974';                               // SMTP password
      $mail->SMTPSecure = 'tls';                                  // Enable TLS encryption, `ssl` also accepted
      $mail->Port       = 587;                                    // TCP port to connect to

      //Recipients
      $mail->setFrom('elvis.montezuma@gmail.com');
      $mail->addAddress('elvismontezuma@hotmail.com');     // Add a recipient
      $mail->addAddress('elvis.montezuma@gmail.com');
      //$mail->addAddress('ellen@example.com');               // Name is optional
      //$mail->addReplyTo('info@example.com', 'Information');
      //$mail->addCC('cc@example.com');
      //$mail->addBCC('bcc@example.com');

      // Attachments
      //$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
      //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name

      // Content
      $mail->isHTML(true);                                  // Set email format to HTML
      $mail->Subject = 'Prueba de sistenas';
      $mail->Body    = 'Prueba de sistemas <b>Hay que ver papa!</b>';
      $mail->AltBody = 'Pasamelo hermanazo';

      $mail->send();
      echo 'Message has been sent';
  } catch (Exception $e) {
      echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
  }


 ?>
