<?php

if($partida instanceof Partida && $user instanceof Usuario && $pagina == 'juego'){
    echo "<div id='menu-inferior' class='menu'>";
    if($partida instanceof Sala) {
        $anfitrionPartida = $partida->getAnfitrion();
        if($anfitrionPartida instanceof Usuario) {
            if($anfitrionPartida->getCod() == $user->getCod()) {
                echo "<button type='button' class='btn btn-primary btn-lg' name='invitar_partida' data-toggle='modal' data-target='#modal_invitar_partida'>Invitar a partida</button>";
            }
        }
        $tipousu = $partida->getTipoUsuario($user->getCod());
        if (($tipousu == 'anfitrion' || $tipousu == 'visitante')) {
            echo "<button type='button' class='btn btn-info btn-lg' disabled='disabled' name='proponer-tablas'>Proponer tablas</button>";
            echo "<button type='button' class='btn btn-warning btn-lg' disabled='disabled' name='rendirse'>Rendirse</button>";
        }
    }
    echo "<button type='button' class='btn btn-danger btn-lg' name='salir-partida'>Salir de partida</button>";
    echo "</div>";
}

?>