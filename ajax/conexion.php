<?php

include_once("../clases/includes_clases.php");

session_start();

$datos = array(
    'conectado' => false,
    'accion' => '',
    'alerta' => '',
    'partida' => false
);

if (isset($_SESSION['login'])) {
    $usuario = $_SESSION['login'];
    if ($usuario instanceof Usuario) {
        if (UsuarioBD::existeUsuario($usuario->getCod())) {
            $datos['conectado'] = true;
            UsuarioBD::pulsacionUsuario($usuario->getCod());
            // Borra los usuarios que no hayan mandado una pulsación en el último  minuto //
            // Borra las salas que no tengan un anfitrión //
            PartidaBD::borraAnfitrionesSalas();
            PartidaBD::borraVisitantesSalas();
            PartidaBD::borraEspectadores();
            UsuarioBD::borraInvitadosNoConectados();
            UsuarioBD::desconectaJugadoresNoConectados();
            if (isset($_SESSION['partida'])) {
                $sala = $_SESSION['partida'];
                if ($sala instanceof Sala) {
                    if (PartidaBD::existeSalaJugandose($sala->getCodSala())) {
                        $tipo = $sala->getTipoUsuario($usuario->getCod());

                        $existe = PartidaBD::existeAnfitrionSala($sala->getAnfitrion()->getCod(), $sala->getCodSala());

                        if ($existe && $tipo == 'visitante') $existe = PartidaBD::existeVisitanteSala($usuario->getCod(), $sala->getCodSala());
                        else if ($existe && $tipo == 'espectador') $existe = PartidaBD::existeEspectadorSala($usuario->getCod(), $sala->getCodSala());

                        if (!$existe) {
                            $_SESSION['partida'] = null;
                            $datos['accion'] = 'salpartida';
                            $datos['alerta'] = 'Has sido expulsado de la sala';
                        }

                        //datos de la partida//
                        $movimientos = false;
                        $anfit = false;
                        $visit = false;
                        $espectadores = array();
                        $nuevos_usus = false;
                        $tablas = false;

                        $sala->updateVisitante();
                        $sala->updateEspectadores();
                        if (!$sala->updateCodPartida()) {
                            $_SESSION['partida'] = null;
                            $datos['accion'] = 'salpartida';
                            $datos['alerta'] = 'Has sido expulsado de la sala';
                        }
                        else {
                            $nuevos_movimientos = $sala->addMovimientos(PartidaBD::getMovimientos($sala->getCodPartida()));
                            $movimientos = $sala->getMovimientosArray();
                            foreach ($sala->getEspectadores() as $espectador) {
                                if ($espectador instanceof Usuario) {
                                    $espectadores[] = array('cod' => $espectador->getCod(), 'nick' => $espectador->getNick());
                                }
                            }
                            if ($sala->getAnfitrion() instanceof Usuario) $anfit = array('cod' => $sala->getAnfitrion()->getCod(), 'nick' => $sala->getAnfitrion()->getNick());
                            if ($sala->getVisitante() instanceof Usuario) $visit = array('cod' => $sala->getVisitante()->getCod(), 'nick' => $sala->getVisitante()->getNick());
                            if(!PartidaBD::existeGanador($sala->getCodPartida())){
                                $tablas = PartidaBD::obtieneTablas($sala->getCodPartida(), $usuario->getCod());
                            }
                            $datos['partida'] = array(
                                'anfitrion' => $anfit,
                                'visitante' => $visit,
                                'espectadores' => $espectadores,
                                'mis_datos' => array('cod' => $usuario->getCod(), 'rol' => $sala->getTipoUsuario($usuario->getCod())),
                                'colores' => PartidaBD::getColores($sala->getCodPartida()),
                                'movimientos' => $movimientos,
                                'nuevos_movimientos' => $nuevos_movimientos,
                                'tablas' => $tablas
                            );
                        }
                    } else {
                        $_SESSION['partida'] = null;
                        $datos['accion'] = 'salpartida';
                        $datos['alerta'] = 'La sala se ha cerrado';
                    }
                }
            }
        } else {
            $_SESSION['login'] = null;
            $datos['accion'] = 'actualiza';
            $datos['alerta'] = 'Te has desconectado';
        }
    }
}

if(isset($_SESSION['partida']) && !$datos['conectado']){
    $_SESSION['partida'] = null;
    $datos['accion'] = 'salpartida';
}

echo json_encode($datos);

?>