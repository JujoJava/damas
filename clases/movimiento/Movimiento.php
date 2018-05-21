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
    private $movOrig;
    private $movDest;
    private $jugador;
    private $color;
    private $comidas;

    public function __construct($cod,$numFicha,$movDest,$movOrig,$jugador,$color,$comidas){
        $this->cod = $cod;
        $this->jugador = $jugador;
        $this->numFicha = $numFicha;
        $this->movOrig = $movOrig;
        $this->movDest = $movDest;
        $this->color = $color;
        $this->comidas = $comidas;
    }
    public function getCod(){
        return $this->cod;
    }
    public function getJugador(){
        return $this->jugador;
    }
    public function getMovOrig(){
        return $this->movOrig;
    }
    public function getMovDest(){
        return $this->movDest;
    }
    public function getNumFicha(){
        return $this->numFicha;
    }
    public function getColor(){
        return $this->color;
    }
    public function getComidas(){
        return $this->comidas;
    }
}