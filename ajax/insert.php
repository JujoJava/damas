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
        case 'movimiento':
            if(isset($_SESSION['login']) && isset($_SESSION['partida'])){
                $usuario = $_SESSION['login'];
                if($usuario instanceof Usuario){
                    $sala = $_SESSION['partida'];
                    if($sala instanceof Sala){
                        if(isset($_POST['comidas'])){
                            $comidas = $_POST['comidas'];
                        } else { $comidas = array(); }
                        $movimiento = $_POST['movimiento'];
                        $numficha = $_POST['ficha']['numFicha'];
                        $posicion = $_POST['ficha']['posicion'];
                        $color = $_POST['ficha']['color'];
                        $codmovimiento = PartidaBD::addMovimiento(
                            $sala->getCodPartida(),
                            $usuario->getCod(),
                            $numficha,
                            $posicion,
                            $movimiento,
                            $comidas
                        );
                        $sala->addMovimiento(new Movimiento(
                            $codmovimiento,
                            $numficha,
                            $movimiento,
                            $posicion,
                            $usuario->getCod(),
                            $color,
                            $comidas
                        ));
                    }
                }
            }
            break;
        case 'resultados':
            $datos = array('correcto' => false);
            if(isset($_SESSION['login']) && isset($_SESSION['partida'])){
                $usuario = $_SESSION['login'];
                if($usuario instanceof Usuario){
                    $sala = $_SESSION['partida'];
                    if($sala instanceof Sala){
                        if($_POST['ganador'] != 'rendicion') {
                            PartidaBD::setGanador($sala->getCodPartida(), $_POST['ganador']);
                            $datos['correcto'] = true;
                        } else {
                            if(!PartidaBD::existeGanador($sala->getCodPartida()) && !PartidaBD::existeTablas($sala->getCodPartida())) {
                                $colores = PartidaBD::getColores($sala->getCodPartida());
                                if ($colores['codnegro'] == $usuario->getCod()) {
                                    PartidaBD::setGanador($sala->getCodPartida(), 'blancas');
                                    $datos['correcto'] = true;
                                } else if ($colores['codblanco'] == $usuario->getCod()) {
                                    PartidaBD::setGanador($sala->getCodPartida(), 'negras');
                                    $datos['correcto'] = true;
                                }
                            }
                        }
                    }
                }
            }
            break;
        case 'tablas':
            $datos = array('correcto' => false);
            if(isset($_SESSION['login']) && isset($_SESSION['partida'])){
                $usuario = $_SESSION['login'];
                if($usuario instanceof Usuario){
                    $sala = $_SESSION['partida'];
                    if($sala instanceof Sala){
                        if($sala->getTipoUsuario($usuario->getCod()) != 'espectador'){
                            PartidaBD::proponerTablas($sala->getCodPartida(), $usuario->getCod());
                            $datos['correcto'] = true;
                        }
                    }
                }
            }
            break;
        case 'registro':
            $datos = array(
                'correcto' => false,
                'error' => array(
                    'error_nombre' => '',
                    'error_pass' => ''
                )
            );
            $nick = $_POST['nick'];
            $pass = $_POST['pass'];
            if(!empty($nick)){
                if(strlen($nick) > 16){
                    $datos['error']['error_nombre'] = '¡El nick es demasiado largo!';
                }
            } else {
                $datos['error']['error_nombre'] = '¡El nick está vacío!';
            }
            if(!empty($pass)){
                if(strlen($pass) > 250){
                    $datos['error']['error_pass'] = '¡La contraseña es demasiado larga!';
                }
            } else {
                $datos['error']['error_pass'] = '¡La contraseña está vacía!';
            }
            if(empty($datos['error']['error_nombre']) && empty($datos['error']['error_pass'])){
                if(isset($_SESSION['login'])) {
                    $usuario = $_SESSION['login'];
                    if ($usuario instanceof Invitado) {
                        if (!UsuarioBD::existeNickJugador($_POST['nick'])) {
                            UsuarioBD::transformaInvitadoEnJugador($usuario->getCod(), $_POST['nick'], $_POST['pass']);
                            $_SESSION['login'] = new Jugador($usuario->getCod(), $_POST['nick']);
                            $datos['correcto'] = true;
                        } else {
                            $datos['error']['error_nombre'] = '¡El nick ya existe!';
                        }
                    }
                } else {
                    if (!UsuarioBD::existeNickJugador($_POST['nick'])) {
                        $cod = UsuarioBD::registraJugador($_POST['nick'], $_POST['pass']);
                        if($cod != null) {
                            $_SESSION['login'] = new Jugador($cod, $_POST['nick']);
                            $datos['correcto'] = true;
                        }
                    } else {
                        $datos['error']['error_nombre'] = '¡El nick ya existe!';
                    }
                }
            }
            break;
        case 'amistad':
            $datos = array(
                'correcto' => false,
                'texto_boton' => 'Agregar amigo',
                'tipo_boton' => 'btn btn-primary btn-md'
            );
            $codusu = $_POST['codusu'];
            if(isset($_SESSION['login'])){
                $mi_usuario = $_SESSION['login'];
                if($mi_usuario instanceof Jugador){
                    if($mi_usuario->getCod() != $codusu){
                        $amistad = UsuarioBD::obtenerAmigo($mi_usuario->getCod(), $codusu);
                        if($amistad){
                            if($amistad[0]['estado'] == 'amigo'){ //quiere borrarlo
                                if(UsuarioBD::borraAmigos($mi_usuario->getCod(), $codusu)) {
                                    $datos['correcto'] = true;
                                }
                            }
                        } else {
                            $amistad = UsuarioBD::obtenerAmigo($codusu, $mi_usuario->getCod());
                            if($amistad){
                                if($amistad[0]['estado'] == 'solicitud'){ //acepta solicitud de amistad
                                    if(UsuarioBD::aceptarSolicitud($mi_usuario->getCod(), $codusu)) {
                                        $datos['correcto'] = true;
                                        $datos['texto_boton'] = 'Borrar amigo';
                                        $datos['tipo_boton'] = 'btn btn-danger btn-md';
                                    }
                                }
                            } else { //quiere enviar solicitud
                                if(UsuarioBD::enviarSolicitud($mi_usuario->getCod(), $codusu)) {
                                    $datos['correcto'] = true;
                                    $datos['texto_boton'] = 'Solicitud de amistad enviada';
                                    $datos['tipo_boton'] = 'btn btn-info btn-md';
                                }
                            }
                        }
                    }
                }
            }
            break;
        case 'privacidad':
            $privacidad = $_POST['privacidad'];
            $codpartida = $_POST['codpartida'];
            if(isset($_SESSION['login'])) {
                if($_SESSION['login'] instanceof Jugador) {
                    $codusu = $_SESSION['login']->getCod();
                    PartidaBD::cambiaPrivacidad($codpartida, $codusu, $privacidad);
                }
            }
            break;
    }
}
else{
    header('location:principal');
}

echo json_encode($datos);

?>