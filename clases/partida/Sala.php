<?php
/**
 * Created by PhpStorm.
 * User: Juanjo
 * Date: 05/04/2018
 * Time: 19:56
 */

/*
 * La sala es una partida activa en la que entrarán 2 jugadores o invitados
 * Se comportará como una partida normal, pero la sala se borrará una vez termine
 */

define('MAIN_URI', 'localhost/damas');

class Sala extends Partida
{
    private $codSala;
    private $espectadores; //array de codigos de usuario (Base de datos)
    private $anfitrion; //objeto Usuario
    private $visitante; //objeto Usuario o NULL
    private $pass;

    public function __construct($codPartida, $codSala, $espectadores, $anfitrion, $visitante, $pass){
        parent::__construct($codPartida);
        $this->codSala = $codSala;
        $this->espectadores = $espectadores;
        // introducimos el anfitrion como objeto (jugador o invitado) //
        if ($datos = UsuarioBD::obtieneJugador($anfitrion)) {
            $this->anfitrion = new Jugador($anfitrion, $datos[0]['nick']);
        } else if ($datos = UsuarioBD::obtieneInvitado($anfitrion)) {
            $this->anfitrion = new Invitado($anfitrion, $datos[0]['nick']);
        }
        // introducimos el visitante como objeto (jugador o invitado) //
        if ($datos = UsuarioBD::obtieneJugador($visitante)) {
            $this->visitante = new Jugador($visitante, $datos[0]['nick']);
        } else if ($datos = UsuarioBD::obtieneInvitado($visitante)) {
            $this->visitante = new Invitado($visitante, $datos[0]['nick']);
        }
        $this->pass = $pass;
    }
    public function getCodSala(){
        return $this->codSala;
    }
    public function getEspectadores(){
        return $this->espectadores;
    }
    public function getAnfitrion(){
        return $this->anfitrion;
    }
    public function getVisitante(){
        return $this->visitante;
    }
    public function getEnlaceSala(){
        return MAIN_URI."/redirect/".$this->codSala."/".$this->pass;
    }
    public function getTipoUsuario($codusu){
        if($this->anfitrion instanceof Usuario){
            if($this->anfitrion->getCod() == $codusu){
                return "anfitrion";
            }
            else if($this->visitante instanceof Usuario){
                if($this->visitante->getCod() == $codusu){
                    return "visitante";
                }
                else{
                    foreach($this->espectadores as $espectador){
                        if($espectador instanceof Usuario){
                            if($espectador == $codusu){
                                return "espectador";
                            }
                        }
                    }
                }
            }
        }
        return "";
    }
    public function addMovimientos($movimientosBD){
        if($movimientosBD) {
            if (count($movimientosBD) > count($this->movimientos)) {
                $diferencia = count($movimientosBD) - (count($movimientosBD) - count($this->movimientos));
                $colores = PartidaBD::getColores($this->getCodPartida());
                for ($i = $diferencia; $i < count($movimientosBD); $i++) {
                    $color = 'blancas';
                    if ($colores['codnegro'] == $movimientosBD[$i]['codusu']) $color = 'negras';
                    $this->movimientos[] = new Movimiento(
                        $movimientosBD[$i]['codmov'],
                        $movimientosBD[$i]['numficha'],
                        $movimientosBD[$i]['mov_dest'],
                        $movimientosBD[$i]['mov_orig'],
                        $movimientosBD[$i]['codusu'],
                        $color,
                        self::generaComidas(PartidaBD::getComidasMovimiento($movimientosBD[$i]['codmov']))
                    );
                }
                return true;
            }
            return false;
        }
        return false;
    }
    public static function generaComidas($comidasBD){
        $comidas = array();
        foreach($comidasBD as $comida){
            $comidas[] = $comida['numficha'];
        }
        return $comidas;
    }
    public function addMovimiento($movimiento){
        $this->movimientos[] = $movimiento;
    }
    public function updateVisitante(){
        $datos = PartidaBD::getVisitante($this->codSala);
        if($datos) {
            if (UsuarioBD::obtieneJugador($datos[0]['codusu'])) {
                $this->visitante = new Jugador($datos[0]['codusu'], $datos[0]['nick']);
            } else {
                $this->visitante = new Invitado($datos[0]['codusu'], $datos[0]['nick']);
            }
        } else {
            $this->visitante = null;
            $this->movimientos = array();
        }
    }
    public function updateEspectadores(){
        $datos = PartidaBD::getEspectadoresSala($this->codSala);
        foreach($datos as $espectador){
            $this->espectadores[] = $espectador['codusu'];
        }
    }
    public function updateCodPartida(){
        if($codpartida = PartidaBD::getSalaJugandose($this->codSala)[0]['codpartida']){
            $this->codPartida = $codpartida;
            return true;
        }
        return false;
    }
}