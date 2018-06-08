<?php
/**
 * Created by PhpStorm.
 * User: Juanjo
 * Date: 05/04/2018
 * Time: 19:53
 */

/*
 * La repetición se guardará si alguno de los usuarios implicados está registrado (instanceof Jugador)
 * Se crea a partir de una sala, antes de ser borrada
 * Se comportará como una partida normal, pero no entra la interacción del jugador
 */

class Repeticion extends Partida
{

    private $negro;
    private $blanco;

    public function __construct($codPartida, $codnegro, $codblanco){
        parent::__construct($codPartida);
        $datos = UsuarioBD::obtieneUsuario($codnegro);
        $this->negro = new Jugador($codnegro, $datos[0]['nick']);
        $datos = UsuarioBD::obtieneUsuario($codblanco);
        $this->blanco = new Jugador($codblanco, $datos[0]['nick']);
        $datos = PartidaBD::getMovimientos($codPartida);
        foreach($datos as $mov){
            $color = 'blancas';
            if ($codnegro == $mov['codusu']) $color = 'negras';
            $this->movimientos[] = new Movimiento(
                $mov['codmov'],
                $mov['numficha'],
                $mov['mov_dest'],
                $mov['mov_orig'],
                $mov['codusu'],
                $color,
                self::generaComidas(PartidaBD::getComidasMovimiento($mov['codmov'], $codPartida))
            );
        }
    }

}