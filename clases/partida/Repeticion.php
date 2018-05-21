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

    private $codRep;
    private $movActual; //código del movimiento

    public function __construct($codPartida,$codRep,$movimientos){
        parent::__construct($codPartida);
        $this->codRep = $codRep;
        $this->movimientos = $movimientos;
        $this->movActual = 0;
    }
    public function nextMov(){
        $this->movActual++;
        return $this->movimientos[$this->movActual];
    }

}