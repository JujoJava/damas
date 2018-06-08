<?php

include_once("../clases/includes_clases.php");

session_start();

$datos = array();

if(isset($_POST['modo'])){
    switch($_POST['modo']){
        case 'salas':
            if (isset($_SESSION['login'])) {
                if ($_SESSION['login'] instanceof Usuario) {
                    $datos = PartidaBD::getAllSalasOtros($_SESSION['login']->getCod());
                } else {
                    $datos = PartidaBD::getAllSalas();
                }
            } else {
                $datos = PartidaBD::getAllSalas();
            }
            $espec = PartidaBD::getNumEspectadores();
            foreach($datos as $index => $dato){
                foreach($espec as $e){
                    if($dato['codsala'] == $e['codsala']){
                        $datos[$index]['cantespec'] = $e['cantespec'];
                    }
                }
                if(!isset($datos[$index]['cantespec'])) $datos[$index]['cantespec'] = 0;
            }
            break;
        case 'redirect':
            $datos['correcto'] = false;
            $mismasala = false;
            if (isset($_SESSION['redirect'])) {
                $cod = $_SESSION['redirect']['cod'];
                $pass = $_SESSION['redirect']['pass'];
                if (PartidaBD::existeSalaJugandose($_SESSION['redirect']['cod'])) {
                    if (isset($_SESSION['login'])) {
                        if (isset($_SESSION['partida'])) {
                            if ($_SESSION['partida'] instanceof Sala && $_SESSION['login'] instanceof Usuario) {
                                if ($_SESSION['partida']->getCodSala() != $cod) {
                                    if (PartidaBD::salirSala(
                                        $_SESSION['partida']->getCodSala(),
                                        $_SESSION['partida']->getCodPartida(),
                                        $_SESSION['login']->getCod(),
                                        $_SESSION['partida']->getTipoUsuario($_SESSION['login']->getCod())
                                    )) {
                                        $_SESSION['partida'] = null;
                                    }
                                } else {
                                    $mismasala = true;
                                }
                            }
                        }
                        if ($_SESSION['login'] instanceof Usuario) {
                            if (!$mismasala) {
                                if ($datos = PartidaBD::entrarSalaRedirect(
                                    $cod,
                                    $pass, //contraseña directamente codificada con SHA
                                    $_SESSION['login']->getCod()
                                )) {
                                    if(isset($datos['codsala'])) {
                                        $espectadores = array();
                                        $arr_espectadores = PartidaBD::getEspectadoresSala($datos['codsala']);
                                        foreach ($arr_espectadores as $cod) {
                                            $espectadores[] = $cod;
                                        }
                                        PartidaBD::setColorNuevoVisitante($datos['codpartida']);
                                        $_SESSION['partida'] = new Sala(
                                            $datos['codpartida'],
                                            $datos['codsala'],
                                            $espectadores,
                                            $datos['anfitrion'],
                                            $datos['visitante'],
                                            $pass
                                        );
                                        $datos['correcto'] = true;
                                        $_SESSION['redirect'] = '';
                                    }
                                }
                            } else {
                                $datos['accion'] = 'redirigir';
                                $_SESSION['redirect'] = '';
                            }
                        } else {
                            $datos['accion'] = 'login';
                        }
                    } else {
                        $datos['accion'] = 'login';
                    }
                } else {
                    $datos['accion'] = 'redirigir';
                    $_SESSION['redirect'] = '';
                }

            } else {
                $datos['accion'] = 'redirigir';
                $_SESSION['redirect'] = '';
            }
            break;
        case 'pass-sala':
            $datos = array(
                'correcto' => false,
                'error' => ''
            );
            $pass = $_POST['pass'];
            $cod = $_SESSION['redirect']['cod'];
            if(PartidaBD::passCorrecta($cod, $pass)){
                $datos['correcto'] = true;
                $_SESSION['redirect']['pass'] = PartidaBD::obtienePass($cod);
            } else {
                $datos['error'] = 'La contraseña no es correcta.';
            }
            break;
        case 'repeticion':
            $datos = array('correcto' => false);
            $codpartida = $_POST['partida'];
            if(PartidaBD::existePartida($codpartida) && $_SESSION['login'] instanceof Jugador){
                $datos = PartidaBD::getPartida($codpartida);
                $_SESSION['partida'] = new Repeticion($codpartida, $datos[0]['codnegro'], $datos[0]['codblanco']);
                $datos['correcto'] = true;
            }
            break;
        case 'login':
            $datos = array(
                'correcto' => false,
                'error' => ''
            );
            $nick = $_POST['nick'];
            $pass = $_POST['pass'];
            $datos_usuario = UsuarioBD::loginJugador($nick, $pass);
            if($datos_usuario != null){
                $_SESSION['login'] = new Jugador($datos_usuario[0]['codusu'], $nick);
                $datos['correcto'] = true;
            } else {
                $datos['error'] = 'El nombre de usuario o la contraseña no son correctos.';
            }
            break;
        case 'logueado':
            $datos = array('correcto' => false);
            if(isset($_SESSION['login'])){
                $datos['correcto'] = true;
            }
            break;
    }
}
else{
    header('location:principal');
}

echo json_encode($datos);

?>