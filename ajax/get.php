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
                                    $_SESSION['login']->getCod(),
                                    $_POST['tipo'] //si es espectador o visitante
                                )) {
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
                                        $_SESSION['login']->getCod(),
                                        $pass
                                    );
                                    $datos['correcto'] = true;
                                }
                            } else {
                                $datos['accion'] = 'redirigir';
                            }
                        } else {
                            $datos['accion'] = 'login';
                        }
                    } else {
                        $datos['accion'] = 'login';
                    }
                } else {
                    $daots['accion'] = 'redirigir';
                }

            } else {
                $datos['accion'] = 'redirigir';
            }
            break;
    }
}
else{
    header('location:principal');
}

echo json_encode($datos);

?>