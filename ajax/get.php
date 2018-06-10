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
                if(UsuarioBD::obtieneJugador($datos[$index]['codanfitrion'])){
                    $datos[$index]['anf_tipo'] = 'jugador';
                } else {
                    $datos[$index]['anf_tipo'] = 'invitado';
                }
                if($datos[$index]['visitante'] != null) {
                    if (UsuarioBD::obtieneJugador($datos[$index]['codvisitante'])) {
                        $datos[$index]['vis_tipo'] = 'jugador';
                    } else {
                        $datos[$index]['vis_tipo'] = 'invitado';
                    }
                } else {
                    $datos[$index]['vis_tipo'] = '';
                }
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
        case 'repeticiones':
            $datos = array(
                'repeticiones' => array(),
                'miperfil' => false
            );
            $usuario = $_SESSION['perfil'];
            if($usuario instanceof Jugador){
                if($_SESSION['login'] instanceof Jugador){
                    if($_SESSION['login']->getCod() == $usuario->getCod()){
                        $datos['repeticiones'] = PartidaBD::getPartidas($usuario->getCod());
                        $datos['miperfil'] = true;
                    } else {
                        $datos['repeticiones'] = PartidaBD::getPartidasRep($usuario->getCod());
                    }
                } else {
                    $datos['repeticiones'] = PartidaBD::getPartidasRep($usuario->getCod());
                }
            }
            foreach($datos['repeticiones'] as $index => $dato){
                $negro = UsuarioBD::obtieneJugador($dato['codnegro']);
                if ($negro) {
                    $datos['repeticiones'][$index]['neg_tipo'] = 'jugador';
                    $datos['repeticiones'][$index]['nicknegro'] = $negro[0]['nick'];
                } else {
                    $negro = UsuarioBD::obtieneInvitado($dato['codnegro']);
                    if ($negro) {
                        $datos['repeticiones'][$index]['neg_tipo'] = 'invitado';
                        $datos['repeticiones'][$index]['nicknegro'] = $negro[0]['nick'];
                    } else {
                        $datos['repeticiones'][$index]['neg_tipo'] = 'invitado';
                        $datos['repeticiones'][$index]['nicknegro'] = 'desconocido';
                    }
                }
                $blanco = UsuarioBD::obtieneJugador($dato['codblanco']);
                if ($blanco) {
                    $datos['repeticiones'][$index]['bla_tipo'] = 'jugador';
                    $datos['repeticiones'][$index]['nickblanco'] = $blanco[0]['nick'];
                } else {
                    $blanco = UsuarioBD::obtieneInvitado($dato['codblanco']);
                    if ($blanco) {
                        $datos['repeticiones'][$index]['bla_tipo'] = 'invitado';
                        $datos['repeticiones'][$index]['nickblanco'] = $blanco[0]['nick'];
                    } else {
                        $datos['repeticiones'][$index]['bla_tipo'] = 'invitado';
                        $datos['repeticiones'][$index]['nickblanco'] = 'desconocido';
                    }
                }
                if($datos['miperfil'] == true){
                    if($usuario instanceof Jugador){
                        if($usuario->getCod() == $dato['codblanco']){
                            $datos['repeticiones'][$index]['mi_privacidad'] = $dato['rep_publica_codblanco'];
                        } else if($usuario->getCod() == $dato['codnegro']){
                            $datos['repeticiones'][$index]['mi_privacidad'] = $dato['rep_publica_codnegro'];
                        }
                    }
                }

            }
            break;
        case 'perfil':
            $perfil = $_SESSION['perfil'];
            if($perfil instanceof Jugador){
                $datos = UsuarioBD::obtieneJugador($perfil->getCod())[0];
                $datos['conectado'] *= 1;
                if($datos){
                    if($datos['conectado'] == 1){
                        $datospartida = UsuarioBD::usuarioJugando($perfil->getCod());
                        if($datospartida){
                            $datos['conectado'] = 2; //jugando una partida
                            $datos['codsala'] = $datospartida[0]['codsala'];
                        } else {
                            $datospartida = UsuarioBD::usuarioEspectando($perfil->getCod());
                            if($datospartida) {
                                $datos['conectado'] = 3; //viendo una partida
                                $datos['codsala'] = $datospartida[0]['codsala'];
                            }
                        }
                    }
                    $datos['puntuaciones'] = PartidaBD::getPuntuaciones($perfil->getCod());
                    $ranking = PartidaBD::getRanking();
                    $datos['ranking'] = false;
                    foreach($ranking as $i => $jugador){
                        if($jugador['codusu'] == $perfil->getCod()){
                            $datos['ranking'] = array('puntuacion' => $jugador['puntos'], 'posicion' => $i+1);
                        }
                    }
                    $datos['miperfil'] = false;
                    $datos['amistad'] = false;
                    if(isset($_SESSION['login'])){
                        if($_SESSION['login'] instanceof Jugador){
                            if($_SESSION['login']->getCod() == $perfil->getCod()){
                                $datos['miperfil'] = true;
                            }
                            $amistad = UsuarioBD::obtenerAmigo($_SESSION['login']->getCod(), $perfil->getCod());
                            if($amistad == false){
                                $amistad = UsuarioBD::obtenerAmigo($perfil->getCod(), $_SESSION['login']->getCod());
                                if($amistad == false) {
                                    $datos['amistad'] = 'none'; //no somos amigos
                                } else {
                                    if($amistad[0]['estado'] == 'solicitud'){
                                        $datos['amistad'] = 'solicitud'; //solicitud de ese usuario a MI
                                    }
                                }
                            } else if($amistad[0]['estado'] == 'solicitud'){
                                $datos['amistad'] = 'solicitado'; //solicitud MIA a ese usuario
                            } else if($amistad[0]['estado'] == 'amigo'){
                                $datos['amistad'] = 'amigo'; //somos amigos
                            }
                        }
                    }
                }
            } else {
                $datos = false;
            }
            break;
        case 'ranking':
            $ranking = PartidaBD::getRanking();
            foreach($ranking as $i => $jugador){
                $ranking[$i]['nick'] = UsuarioBD::obtieneUsuario($jugador['codusu'])[0]['nick'];
                $ranking[$i]['conectado'] *= 1;
            }
            $datos['ranking'] = $ranking;
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