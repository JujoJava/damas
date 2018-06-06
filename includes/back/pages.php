<?php
/**
 * Created by PhpStorm.
 * User: Juanjo
 * Date: 03/04/2018
 * Time: 20:05
 */

if(isset($_GET['page'])){
    include("pages/" . $_GET['page'] . ".html");
    if($_GET['page'] == 'redirect'){
        if(isset($_GET['cod']) && isset($_GET['pass'])){
            if(isset($_SESSION['redirect'])) {
                if ($_SESSION['redirect'] == null) {
                    $_SESSION['redirect'] = array('cod' => $_GET['cod'], 'pass' => $_GET['pass']);
                }
            } else {
                $_SESSION['redirect'] = array('cod' => $_GET['cod'], 'pass' => $_GET['pass']);
            }
        }
    }
    $pagina = $_GET['page'];
}
else if(isset($_POST['page'])){
    include("pages/".$_POST['page'].".html");
}

?>