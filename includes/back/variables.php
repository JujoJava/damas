<?php
/**
 * Created by PhpStorm.
 * User: Juanjo
 * Date: 03/04/2018
 * Time: 20:05
 */

include('clases/includes_clases.php');

session_start();

$user = null; //usuario que ha iniciado sesión
$partida = null; //partida visualizando (puede ser una sala o una repetición)
$pagina = 'principal';

if(isset($_GET['page'])){
    if($_GET['page'] == 'juego' && (!isset($_SESSION['partida']) || !isset($_SESSION['login']))){
        header('location:principal');
    } else {
        if($_GET['page'] == 'redirect'){
            if(!isset($_GET['cod']) || !isset($_GET['pass'])) {
                header('location:principal');
            }
        }
    }
}

if (isset($_SESSION['login'])) {
    if ($_SESSION['login'] instanceof Usuario) {
        $user = $_SESSION['login']; //instancia de Usuario
        if (!UsuarioBD::existeUsuario($user->getCod())) {
            $user = null;
            $_SESSION['login'] = null;
        }
    }
}

if(isset($_SESSION['partida'])) {
    if ($_SESSION['partida'] instanceof Partida) {
        $partida = $_SESSION['partida']; //instancia de Partida
        if (!PartidaBD::existePartida($partida->getCodPartida())) {
            $partida = null;
            $_SESSION['partida'] = null;
        }
        if ($partida instanceof Sala) {
            if (!PartidaBD::existeSalaJugandose($partida->getCodSala())) {
                $partida = null;
                $_SESSION['partida'] = null;
            }
        }
        if (!isset($_SESSION['login'])) {
            $partida = null;
            $_SESSION['partida'] = null;
        }
    }
}

?>