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
    private $numFicha;
    private $movDest;
    private $jugador;
    private $color;
    private $comidas;

    public function __construct($cod,$numFicha,$movDest,$jugador,$color,$comidas){
        $this->cod = $cod;
        $this->jugador = $jugador;
        $this->numFicha = $numFicha;
        $this->movDest = $movDest;
        $this->color = $color;
        $this->comidas = $comidas;
    }
}