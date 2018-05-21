<?php
/**
 * Created by PhpStorm.
 * User: Juanjo
 * Date: 05/04/2018
 * Time: 19:46
 */

class Jugador extends Usuario
{
    private $repeticiones;

    public function __construct($cod,$nick){
        parent::__construct($cod,$nick);
        $this->repeticiones = array();
    }
    public function getPartidas(){
        return $this->repeticiones;
    }
    public function addPartida($partida){
        if($partida instanceof Partida){
            $this->repeticiones[] = $partida;
        }
    }
}