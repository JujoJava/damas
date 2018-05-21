<?php
/**
 * Created by PhpStorm.
 * User: Juanjo
 * Date: 09/05/2018
 * Time: 23:35
 */

include_once("../clases/includes_clases.php");

session_start();

$datos = array();

if(isset($_POST['modo'])){
    switch($_POST['modo']){
        case 'usuario_invitado':
            $datos = array(
                'correcto' => false,
                'error' => 'Ha ocurrido un error inesperado',
                'codusu' => 0
            );
            $nick = $_POST['nick'];
            if (!UsuarioBD::existeNickJugador($nick)) {
                $codusu = UsuarioBD::insertaInvitado($nick);
                if($codusu != null) {
                    $datos['correcto'] = true;
                    $datos['codusu'] = $codusu;
                    $_SESSION['login'] = new Invitado($codusu, $nick);
                }
            } else {
                $datos['error'] = '¡Ese nombre ya existe!';
            }
            break;
        case 'crea_sala':
            $datos = array(
                'correcto' => false,
                'error' => 'Ha ocurrido un error inesperado'
            );
            if(isset($_SESSION['login'])){
                if($_SESSION['login'] instanceof Usuario){
                    $anfitrion = $_SESSION['login'];
                    if($datos_sala = PartidaBD::creaSala(
                        $anfitrion,
                        $_POST['pass'],
                        $_POST['descripcion'],
                        $_POST['puede_espectar'],
                        $_POST['color_anfit']
                    )) {
                        $datos['correcto'] = true;
                        $_SESSION['partida'] = new Sala(
                            $datos_sala['codpartida'],
                            $datos_sala['codsala'],
                            array(),
                            $anfitrion->getCod(),
                            null,
                            PartidaBD::obtienePass($datos_sala['codsala'])
                        );
                    }
                } else {
                    $datos['error'] = 'No puedes crear una partida sin tener un nombre';
                }
            } else {
                $datos['error'] = 'No puedes crear una partida sin tener un nombre';
            }
            break;
    }
}
else{
    header('location:principal');
}

echo json_encode($datos);

?>