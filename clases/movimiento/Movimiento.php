<?php
/**
 * Created by PhpStorm.
 * User: Juanjo
 * Date: 05/04/2018
 * Time: 20:08
 */

class Movimiento
{
    private $cod;
    private $movOrig;
    private $movDest;
    private $jugador;
    private $color;

    public function __construct($cod,$movOrig,$movDest,$jugador,$color){
        $this->cod = $cod;
        $this->jugador = $jugador;
        $this->movOrig = $movOrig;
        $this->movDest = $movDest;
        $this->color = $color;
    }
}