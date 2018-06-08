<div id='modal_registro' class='modal fade' role='dialog'>
    <div class='modal-dialog'>
        <div class='modal-content'>
            <div class='modal-header'>
                <h4 class='modal-title'>Registrarse</h4>
                <button type='button' class='close' data-dismiss='modal'>&times;</button>
            </div>
            <div class='modal-body'>

                <?php
                $nomUsu = '';
                if ($user instanceof Invitado) {
                    $nomUsu = $user->getNickPuro();
                }
                ?>

                <form>
                    <div class="form-group has-danger">
                        <input placeholder="Nombre de usuario" value="<?= $nomUsu ?>" class="form-control" type="text" name="nomUsu">
                        <div class="invalid-feedback"></div>
                    </div>
                    <div class="form-group has-danger">
                        <input placeholder="Constraseña" class="form-control" type="password" name="passUsu">
                        <div class="invalid-feedback"></div>
                    </div>
                </form>

            </div>
            <div class='modal-footer'>
                <button type='button' class='btn btn-lg btn-secondary' data-dismiss='modal'>Cerrar</button>
                <button type='button' disabled='disabled' name='registro-usuario' class='btn btn-lg btn-primary'>Registrar</button>
                <div class="invalid-feedback"></div>
            </div>
        </div>
    </div>
</div>

<div id='modal_login' class='modal fade' role='dialog'>
    <div class='modal-dialog'>
        <div class='modal-content'>
            <div class='modal-header'>
                <h4 class='modal-title'>Iniciar sesión</h4>
                <button type='button' class='close' data-dismiss='modal'>&times;</button>
            </div>
            <div class='modal-body'>

                <form>
                    <div class="form-group">
                        <input placeholder="Nombre de usuario" class="form-control" type="text" name="nomUsu">
                    </div>
                    <div class="form-group">
                        <input placeholder="Constraseña" class="form-control" type="password" name="passUsu">
                    </div>
                </form>

            </div>
            <div class='modal-footer'>
                <button type='button' class='btn btn-lg btn-secondary' data-dismiss='modal'>Cerrar</button>
                <button type='button' name='iniciar-sesion' class='btn btn-lg btn-primary'>Iniciar sesión</button>
                <div class="invalid-feedback"></div>
            </div>
        </div>
    </div>
</div>

<div id='modal_logout' class='modal fade' role='dialog'>
    <div class='modal-dialog'>
        <div class='modal-content'>
            <div class='modal-header'>
                <h4 class='modal-title'>Cerrando sesión...</h4>
            </div>
            <div class='modal-body'>
                <div class="info">

                </div>
            </div>
        </div>
    </div>
</div>

<?php

// menú superior //

$punto_activo = array(
    'perfil' => '',
    'juego' => ''
);

if(isset($_GET['page'])) {
    $punto_activo[$_GET['page']] = 'active';
    if(isset($_GET['cod'])){
        if(!empty($_GET['cod'])){
            if($_GET['page'] == 'perfil'){
                $punto_activo[$_GET['page']] = '';
            }
        }
    }
}

echo "<nav id='menu-superior' class='navbar navbar-expand-lg navbar-dark bg-dark'>";

echo "<a class='navbar-brand d-flex w-50 mr-auto' href='principal'><img width='30' height='30' src='img/logo.png' alt='Damas Online'/></a>"; //logo de la página
echo "<button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target='#opciones-menu' aria-controls='opciones-menu' aria-expanded=\"false\">
        <span class=\"navbar-toggler-icon\"></span>
    </button>";
echo "<div class='collapse navbar-collapse w-100' id='opciones-menu'><ul class='nav navbar-nav mr-auto w-100 justify-content-center'>";

if($partida instanceof Partida){
    echo "<li class='nav-item ".$punto_activo['juego']."'><a href='juego' class='nav-link' title='Partida'><i class='fas fa-chess-queen'></i><span id='mensaje_aviso'>!</span><span class='label-menu-icon'>Partida en curso</span></a></li>"; //icono de partida. Sale una señal si se realiza un movimiento
} else {
    echo "<li class='nav-item menu-movil'><a class='nav-link' data-toggle='modal' data-target='#modal_jugar_nueva'>¡Jugar ya!</a>";
}

echo "</ul>";
echo "<ul class='nav navbar-nav mr-auto w-100 justify-content-end'>";

if($user instanceof Jugador){
    $nick = $user->getNick();
    echo "<li class='nav-item nombre-usuario'>$nick</li>";
    echo "<li class='nav-item'".$punto_activo['perfil']."><a id='info-perfil' title='Perfil' href='perfil' class='nav-link'><i class='fas fa-user'></i><span class='label-menu-icon'>Perfil de usuario</span></a></li>"; //Solo registrados. Para acceder al menú de usuario
    echo "<li class='nav-item'><a title='Cerrar sesión' href='' class='nav-link' name='cerrar-sesion'><i class='fas fa-sign-out-alt'></i><span class='label-menu-icon'>Cerrar sesión</span></a>"; //Botón para cerrar sesión. Icono.
}
else if($user instanceof Invitado){
    $nick = $user->getNick();
    echo "<li class='nav-item nombre-usuario'>$nick</li>"; //Usuario invitado con nombre provisional. No enlaza a nada.
    echo "<li class='nav-item'><a href='' title='Iniciar sesión' class='nav-link' data-toggle='modal' data-target='#modal_login'>Iniciar sesión</a></li>"; //Botón de iniciar sesión
    echo "<li class='nav-item'><a href='' title='Registrarse' data-toggle='modal' data-target='#modal_registro' class='nav-link'>Registrarse</a></li>"; //Botón para registrarse
}
else{
    echo "<li class='nav-item mostrar-invitado nombre-usuario' style='display:none;'></li>";
    echo "<li class='nav-item'><a href='' title='Iniciar sesión' class='nav-link' data-toggle='modal' data-target='#modal_login'>Iniciar sesión</a></li>"; //Botón de iniciar sesión
    echo "<li class='nav-item'><a href='' title='Registrarse' data-toggle='modal' data-target='#modal_registro' class='nav-link'>Registrarse</a></li>"; //Botón para registrarse
}

echo "</ul></div>";
echo "</nav>";

?>