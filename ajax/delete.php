<?php

include_once("../clases/includes_clases.php");

session_start();

$datos = array();

if(isset($_POST['modo'])){
    switch($_POST['modo']){
        case 'partida':
            $datos['correcto'] = false;
            if(isset($_SESSION['login']) && isset($_SESSION['partida'])){
                if($_SESSION['login'] instanceof Usuario && $_SESSION['partida'] instanceof Partida){
                    $usuario = $_SESSION['login'];
                    $partida = $_SESSION['partida'];
                    $tipo = '';
                    if($partida instanceof Sala) {
                        if ($usuario->getCod() == $partida->getAnfitrion()->getCod()) {
                            $tipo = 'anfitrion';
                        } else if ($partida->getVisitante() != null) {
                            if ($usuario->getCod() == $partida->getVisitante()->getCod()) {
                                $tipo = 'visitante';
                            } else {
                                $tipo = 'espectador';
                            }
                        } else {
                            $tipo = 'espectador';
                        }
                        if (PartidaBD::salirSala(
                            $partida->getCodSala(),
                            $partida->getCodPartida(),
                            $usuario->getCod(),
                            $tipo
                        )) {
                            $datos['correcto'] = true;
                            $_SESSION['partida'] = null;
                        }
                    } else {
                        $datos['correcto'] = true;
                        $_SESSION['partida'] = null;
                    }
                }
            }
            break;
        case 'logout':
            if(isset($_SESSION['login'])){
                $usuario = $_SESSION['login'];
                if(isset($_SESSION['partida'])){
                    $partida = $_SESSION['partida'];
                    $tipo = '';
                    if($partida instanceof Sala) {
                        if ($usuario->getCod() == $partida->getAnfitrion()->getCod()) {
                            $tipo = 'anfitrion';
                        } else if ($partida->getVisitante() != null) {
                            if ($usuario->getCod() == $partida->getVisitante()->getCod()) {
                                $tipo = 'visitante';
                            } else {
                                $tipo = 'espectador';
                            }
                        } else {
                            $tipo = 'espectador';
                        }
                        if (PartidaBD::salirSala(
                            $partida->getCodSala(),
                            $partida->getCodPartida(),
                            $usuario->getCod(),
                            $tipo
                        )) {
                            $_SESSION['partida'] = null;
                            $_SESSION['login'] = null;
                        }
                    } else {
                        $_SESSION['partida'] = null;
                        $_SESSION['login'] = null;
                    }
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