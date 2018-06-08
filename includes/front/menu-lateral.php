<div id='modal_entrar_sala' class='modal fade' role='dialog'>
    <div class='modal-dialog'>
        <div class='modal-content'>
            <div class='modal-header'>
                <h4 class='modal-title'>Entrar a sala</h4>
                <button type='button' class='close' data-dismiss='modal'>&times;</button>
            </div>
            <div class='modal-body'>
                <?php

                if (!$user instanceof Usuario) {

                    echo "<div class='conf-invitado'>";
                    echo "<p>No tienes un nombre que te identifique.<br>";
                    echo "Por favor, introduce un nombre.</p>";
                    echo "<form><div class='form-group has-danger'>";
                    echo "<input placeholder='Nombre' class='form-control' type='text' name='nomUsuInvi'>";
                    echo "<div class='invalid-feedback'></div>";
                    echo "</div></form></div>";
                }

                ?>

            </div>
            <div class='modal-footer'>
                <button type='button' class='btn btn-lg btn-secondary' data-dismiss='modal'>Cerrar</button>
                <button type='button' disabled='disabled' name='entrar-sala' class='btn btn-lg btn-primary'>Crear</button>
                <div class="invalid-feedback"></div>
            </div>
        </div>
    </div>
</div>

<div id='modal_jugar_nueva' class='modal fade' role='dialog'>
    <div class='modal-dialog'>
        <div class='modal-content'>
            <div class='modal-header'>
                <h4 class='modal-title'>Crear sala</h4>
                <button type='button' class='close' data-dismiss='modal'>&times;</button>
            </div>
            <div class='modal-body'>
                <?php

                $conf_partida_hide = '';

                if (!$user instanceof Usuario) {
                    $conf_partida_hide = "style='display:none'";

                    echo "<div class='conf-invitado'>";
                    echo "<p>No tienes un nombre que te identifique.<br>";
                    echo "Por favor, introduce un nombre.</p>";
                    echo "<form><div class='form-group has-danger'>";
                    echo "<input placeholder='Nombre' class='form-control' type='text' name='nomUsuInvi'>";
                    echo "<div class='invalid-feedback'></div>";
                    echo "</div></form></div>";
                }

                ?>

                <div class='conf-partida' <?= $conf_partida_hide ?> >
                    <form>
                        <div class='form-group has-danger'>
                            <label for='descripcion'>Descripción</label>
                            <input type='text' class='form-control' id='descripcion' name='descripcion'>
                            <div class='invalid-feedback'></div>
                        </div>
                        <div class="flotante">
                            <div class='form-group color-fichas'>
                                <span>Tu color</span><br>
                                <input type='radio' id='negras' name='color-fichas'>
                                <label for='negras' title='Negras'><img width="32px" height="32px" class="ficha" src='img/ficha_negra.png' alt='Negras'></label>
                                <input type='radio' id='blancas' name='color-fichas'>
                                <label for='blancas' title='Blancas'><img width="32px" height="32px" class="ficha" src='img/ficha_blanca.png' alt='Blancas'></label>
                                <input checked="checked" type='radio' id='aleatorio' name='color-fichas'>
                                <label for='aleatorio' title='Aleatorio'><img width="32px" height="32px" class="ficha" src='img/ficha_aleatoria.png' alt='Aleatorio'></label>
                            </div>
                            <div class='espectadores'>
                                <span>Espectadores</span><br>
                                <label class='switch'>
                                    <input type='checkbox' checked name='puede_espectar'>
                                    <span class='slider'></span>
                                </label>
                            </div>
                        </div>
                        <div class='form-group has-danger pass'>
                            <label for='pass_sala'>Contraseña</label>
                            <input type='password' id='pass_sala' placeholder="Opcional" name='pass_sala' class="form-control">
                            <div class='invalid-feedback'></div>
                        </div>

                    </form>
                </div>

            </div>
            <div class='modal-footer'>
                <button type='button' class='btn btn-lg btn-secondary' data-dismiss='modal'>Cerrar</button>
                <button type='button' disabled='disabled' name='crear-partida' class='btn btn-lg btn-primary'>Crear</button>
                <div class="invalid-feedback"></div>
            </div>
        </div>
    </div>
</div>

<div id='modal_invitar_partida' class='modal fade' role='dialog'>
    <div class='modal-dialog'>
        <div class='modal-content'>
            <div class='modal-header'>
                <h4 class='modal-title'>Invitar a partida</h4>
                <button type='button' class='close' data-dismiss='modal'>&times;</button>
            </div>
            <div class='modal-body'>
                <form>
                    <div class='form-group por-enlace'>
                        <label for="invitar_por_enlace">Invitar por enlace</label><br>
                        <div class="row input-boton">
                            <input type="text" id="invitar_por_enlace" class="form-control col-md-10" readonly value="<?php if($partida instanceof Sala) echo $partida->getEnlaceSala(); ?>">
                            <button type="button" class="btn btn-info col-md-2" name="copiar">Copiar</button>
                        </div>
                        <small class="form-text text-muted">Copia este enlace para que tu amigo lo pegue en su navegador</small>
                    </div>
                    <?php
                    if ($user instanceof Jugador) {
                        echo "<div class='form-group por-amigos'>";
                        echo "<label for='invitar_por_amigos'>Invitar por la lista de amigos</label>";
                        echo "<div class='lista-amigos-invitar'>";
                        // mostrar lista de amigos con botones para invitar
                        echo "</div></div>";
                    }
                    ?>
                </form>
            </div>
            <div class='modal-footer'>
                <button type='button' class='btn btn-lg btn-secondary' data-dismiss='modal'>Cerrar</button>            </div>
        </div>
    </div>
</div>

<div id='menu-lateral' class="menu">
    <?php

    if($partida instanceof Sala && $user instanceof Usuario && $pagina == 'juego') {
        $anfitrionPartida = $partida->getAnfitrion();
        if($anfitrionPartida instanceof Usuario) {
            if($anfitrionPartida->getCod() == $user->getCod()) {
                echo "<div><button type='button' class='btn btn-primary btn-lg' name='invitar_partida' data-toggle='modal' data-target='#modal_invitar_partida'>Invitar a partida</button></div>";
            }
        }
    } else if(!$partida instanceof Partida) {
        echo "<div><button type='button' class='btn btn-primary btn-lg' data-toggle='modal' data-target='#modal_jugar_nueva'>¡Jugar ya!</button>"; //botón que abrirá el modal de creación rápida
        echo "<span><i>Pulsa este botón para empezar a jugar una partida con otro amigo</i></span></div>";
    }

    if($user instanceof Jugador){ //sólamente usuarios registrados podrán ver esto
        echo "<div><button type='button' class='btn btn-info btn-lg' name='ver-repeticiones'>Ver repeticiones</button>"; //lista de repeticiones
        echo "<div id='lista-repeticiones'>";
        $repeticiones = PartidaBD::getPartidas($user->getCod());
        foreach($repeticiones as $repeticion){
            if($repeticion['ganador'] != '') {
                $oponente = $repeticion['codnegro'];
                $micolor = 'negras';

                if ($oponente == $user->getCod()) {
                    $oponente = $repeticion['codblanco'];
                } else {
                    $micolor = 'blancas';
                }

                $nombre_oponente = UsuarioBD::obtieneJugador($oponente)[0]['nick'];
                if(empty($nombre_oponente)){
                    $nombre_oponente = $oponente."_".UsuarioBD::obtieneInvitado($oponente)[0]['nick'];
                } else {
                    $nombre_oponente = "<a href='perfil/".$oponente."'>".$nombre_oponente."</a>";
                }
                if(!empty($nombre_oponente)) {
                    $resultado = '';
                    if ($repeticion['ganador'] == 'blancas') {
                        if ($micolor == 'blancas') {
                            $resultado = 'Victoria';
                        } else {
                            $resultado = 'Derrota';
                        }
                    } else if ($repeticion['ganador'] == 'negras') {
                        if ($micolor == 'blancas') {
                            $resultado = 'Derrota';
                        } else {
                            $resultado = 'Victoria';
                        }
                    } else {
                        $resultado = 'Tablas';
                    }
                    echo "<div>";
                    echo "<span>Contra " . $nombre_oponente . "</span>";
                    echo "<span class='$resultado'>$resultado</span>";
                    echo "<a class='ver_repeticion' id='" . $repeticion['codpartida'] . "'>Ver</a>";
                    echo "</div>";
                }
            }
        }
        echo "</div></div>";
        echo "<div><button type='button' class='btn btn-info btn-lg' name='ver-lista-amigos'>Ver amigos</button>"; //lista de amigos
        echo "<div id='lista-amigos'>";
        //lista de amigos
        echo "</div></div>";
        echo "<div id='info-usuario'>";
        $partidas = PartidaBD::getPartidas($user->getCod());
        $partidas_totales = 0;
        $partidas_ganadas = 0;
        $partidas_perdidas = 0;
        foreach($partidas as $p){
            if($p['ganador'] != '') {
                $partidas_totales++;
                if ($p['codnegro'] == $user->getCod()) {
                    $micolor = 'negras';
                } else {
                    $micolor = 'blancas';
                }
                if ($p['ganador'] == $micolor) {
                    $partidas_ganadas++;
                } else {
                    $partidas_perdidas++;
                }
            }
        }
        echo "<div><span>Partidas totales</span><span>".$partidas_totales."</span></div>";
        echo "<div><span>Partidas ganadas</span><span>".$partidas_ganadas."</span></div>";
        echo "<div><span>Partidas perdidas</span><span>".$partidas_perdidas."</span></div>";
        echo "</div>";
    }
    else{
        echo "<div><span><i>Regístrate para guardar repeticiones, agregar amigos, y participar en los ránkings</i></span></div>";
    }

    if($partida instanceof Partida && $user instanceof Usuario && $pagina == 'juego'){
        echo "<div>";
        if($partida instanceof Sala) {
            $tipousu = $partida->getTipoUsuario($user->getCod());
            if (($tipousu == 'anfitrion' || $tipousu == 'visitante')) {
                echo "<button type='button' class='btn btn-default btn-lg' disabled='disabled' name='proponer-tablas'>Proponer tablas</button>";
                echo "<button type='button' class='btn btn-warning btn-lg' disabled='disabled' name='rendirse'>Rendirse</button>";
            }
        } else if ($partida instanceof Repeticion) {
            echo "<div id='repeticion'><div><button type='button' class='btn btn-default btn-md' name='atras'>< Anterior</button>";
            echo "</div><div><span class='num-mov'></span>";
            echo "</div><div><button type='button' class='btn btn-default btn-md' name='adelante'>Siguiente ></button>";
            echo "</div></div>";
        }
        echo "<button type='button' class='btn btn-danger btn-lg' name='salir-partida'>Salir de partida</button></div>";
        if($partida instanceof Sala) {
            if(PartidaBD::getSalaJugandose($partida->getCodSala())[0]['puede_espectar'] == 1) {
                echo "<div id='espectadores-partida'>";
                echo "<h2>Espectadores</h2><ul>";
                echo "</ul>";
                echo "</div>";
            }
        }
    }
    ?>
</div>
