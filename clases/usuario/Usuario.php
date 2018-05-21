<?php
/**
 * Created by PhpStorm.
 * User: Juanjo
 * Date: 03/04/2018
 * Time: 20:23
 */

abstract class Usuario
{
    protected $nick;
    protected $cod;
    protected $color_ficha;

    public function __construct($cod,$nick){
        $this->cod = $cod;
        $this->nick = $nick;
        $this->color_ficha = null; //esta variable nos será útil cuando esté en una partida
    }
    public function getCod(){
        return $this->cod;
    }
    public function getNick(){
        return $this->nick;
    }
    public function getColorFicha(){
        return $this->color_ficha;
    }
    public function setColorFicha($color){
        $this->color_ficha = $color;
    }
}

?>