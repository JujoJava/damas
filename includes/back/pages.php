<?php
/**
 * Created by PhpStorm.
 * User: Juanjo
 * Date: 03/04/2018
 * Time: 20:05
 */
if(isset($_GET['page'])){
    if($_GET['page'] == 'redirect'){
        if(isset($_GET['cod']) && isset($_GET['pass'])){
            if(isset($_SESSION['redirect'])) {
                if ($_SESSION['redirect'] == '') {
                    $_SESSION['redirect'] = array('cod' => $_GET['cod'], 'pass' => $_GET['pass']);
                }
            } else {
                $_SESSION['redirect'] = array('cod' => $_GET['cod'], 'pass' => $_GET['pass']);
            }
        }
    }
    if($_GET['page'] == 'perfil') {
        if(isset($_GET['cod'])){
            $p = UsuarioBD::obtieneJugador($_GET['cod']);
            if($p){
                $_SESSION['perfil'] = new Jugador($_GET['cod'], $p[0]['nick']);
            }
        } else {
            if($user instanceof Jugador) {
                $_SESSION['perfil'] = $user;
            }
        }
    }
    include("pages/" . $_GET['page'] . ".html");
    $pagina = $_GET['page'];
}
else if(isset($_POST['page'])){
    include("pages/".$_POST['page'].".html");
}

?>