<?php
/**
 * Created by PhpStorm.
 * User: Juanjo
 * Date: 03/04/2018
 * Time: 20:05
 */

if(isset($_GET['page'])){
    if($_GET['page'] == 'juego' && (!isset($_SESSION['partida']) || !isset($_SESSION['login']))){
        header('location: principal');
    } else {
        include("pages/" . $_GET['page'] . ".html");
        if($_GET['page'] == 'redirect'){
            if(isset($_GET['cod']) && isset($_GET['pass'])){
                $_SESSION['redirect'] = array('cod' => $_GET['cod'], 'pass' => $_GET['pass']);
            } else {
                header('location: principal');
            }
        }
    }
    $pagina = $_GET['page'];
}
else if(isset($_POST['page'])){
    include("pages/".$_POST['page'].".html");
}

?>