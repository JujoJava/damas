<?php
/**
 * Created by PhpStorm.
 * User: Juanjo
 * Date: 03/04/2018
 * Time: 20:08
 */

// menú superior //

$punto_activo = array(
    'login' => '',
    'logout' => '',
    'registro' => '',
    'perfil' => '',
    'juego' => ''
);

if(isset($_GET['page']))
    $punto_activo[$_GET['page']] = 'active';

echo "<nav id='menu-superior' class='navbar navbar-expand-lg navbar-dark bg-dark'>";

echo "<a class='navbar-brand d-flex w-50 mr-auto' href='principal'><img width='30' height='30' src='img/logo.png' alt='Damas Online'/></a>"; //logo de la página
echo "<button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target='#opciones-menu' aria-controls='opciones-menu' aria-expanded=\"false\">
        <span class=\"navbar-toggler-icon\"></span>
    </button>";
echo "<div class='collapse navbar-collapse w-100' id='opciones-menu'><ul class='nav navbar-nav mr-auto w-100 justify-content-center'>";

if($partida instanceof Partida){
    echo "<li class='nav-item ".$punto_activo['juego']."'><a href='juego' class='nav-link' title='Partida'><i class='fas fa-chess-queen'></i><span id='mensaje_aviso'>!</span><span class='label-menu-icon'>Partida en curso</span></a></li>"; //icono de partida. Sale una señal si se realiza un movimiento
} else {
    echo "<li class='nav-item jugar-ya'><a class='nav-link' data-toggle='modal' data-target='#modal_jugar_nueva'>¡Jugar ya!</a>";
}

echo "</ul>";
echo "<ul class='nav navbar-nav mr-auto w-100 justify-content-end'>";

if($user instanceof Jugador){
    $nick = $user->getNick();
    echo "<li class='nav-item nombre-usuario'>$nick</li>";
    echo "<li class='nav-item ".$punto_activo['perfil']."'><a id='info-perfil' title='Perfil' href='perfil' class='nav-link'><i class='fas fa-user'></i></a></li>"; //Solo registrados. Para acceder al menú de usuario
    echo "<li class='nav-item ".$punto_activo['logout']."'><a title='Cerrar sesión' href='' class='nav-link'><i class='fas fa-sign-out-alt'></i></a>"; //Botón para cerrar sesión. Icono.
}
else if($user instanceof Invitado){
    $nick = $user->getNick();
    echo "<li class='nav-item nombre-usuario'>$nick</li>"; //Usuario invitado con nombre provisional. No enlaza a nada.
    echo "<li class='nav-item ".$punto_activo['login']."'><a href='' title='Iniciar sesión' class='nav-link'>Iniciar sesión</a></li>"; //Botón de iniciar sesión
    echo "<li class='nav-item ".$punto_activo['registro']."'><a href='' title='Registrarse' class='nav-link'>Registrarse</a></li>"; //Botón para registrarse
}
else{
    echo "<li class='nav-item mostrar-invitado nombre-usuario' style='display:none;'></li>";
    echo "<li class='nav-item'><a href='' title='Iniciar sesión' class='nav-link'>Iniciar sesión</a></li>"; //Botón de iniciar sesión
    echo "<li class='nav-item'><a href='' title='Registrarse' class='nav-link'>Registrarse</a></li>"; //Botón para registrarse
}

echo "</ul></div>";
echo "</nav>";

?>