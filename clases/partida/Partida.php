<?php
/**
 * Created by PhpStorm.
 * User: Juanjo
 * Date: 05/04/2018
 * Time: 19:51
 */

/*
 * Una partida constará de una serie de movimientos
 * Los movimientos representarán el momento en que se encuentra la partida
 */

abstract class Partida
{
    protected $codPartida;
    protected $movimientos;

    public function __construct($cod){
        $this->codPartida = $cod;
    }
    public function getCodPartida(){
        return $this->codPartida;
    }
    public function getMovimientos(){
        return $this->movimientos;
    }
    public function getMovimientosArray(){
        $array = array();
        foreach($this->movimientos as $movimiento){
            if($movimiento instanceof Movimiento){
                $array[] = array(
                    'codusu' => $movimiento->getJugador(),
                    'numficha' => $movimiento->getNumFicha(),
                    'posicion' => $movimiento->getMovDest(),
                    'comidas' => $movimiento->getComidas(),
                    'color' => $movimiento->getColor()
                );
            }
        }
        return $array;
    }
}