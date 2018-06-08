<?php
/**
 * Created by PhpStorm.
 * User: Juanjo
 * Date: 05/04/2018
 * Time: 19:46
 */

class Jugador extends Usuario
{

    public function __construct($cod,$nick){
        parent::__construct($cod,$nick);
    }
}