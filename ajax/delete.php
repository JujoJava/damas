<?php

include_once("../clases/includes_clases.php");

session_start();

$datos = array();

if(isset($_POST['modo'])){
    switch($_POST['modo']){
        case 'partida':
            $datos['correcto'] = false;
            if(isset($_SESSION['login']) && isset($_SESSION['partida'])){
                if($_SESSION['login'] instanceof Usuario && $_SESSION['partida'] instanceof Sala){
                    $usuario = $_SESSION['login'];
                    $partida = $_SESSION['partida'];
                    $tipo = '';
                    if($usuario->getCod() == $partida->getAnfitrion()->getCod()){
                        $tipo = 'anfitrion';
                    } else if ($usuario->getCod() == $partida->getVisitante()->getCod()){
                        $tipo = 'visitante';
                    } else {
                        $tipo = 'espectador';
                    }
                    if(PartidaBD::salirSala(
                        $partida->getCodSala(),
                        $partida->getCodPartida(),
                        $usuario->getCod(),
                        $tipo
                    )) {
                        $datos['correcto'] = true;
                        $_SESSION['partida'] = null;
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