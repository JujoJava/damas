<?php
/**
 * Created by PhpStorm.
 * User: Juanjo
 * Date: 03/04/2018
 * Time: 20:27
 */

require_once "Usuario.php";

class Invitado extends Usuario
{

    public function __construct($cod,$nick){
        parent::__construct($cod,$nick);
    }

    public function getNick(){
        return $this->cod."_".$this->nick;
    }

    public function getNickPuro(){
        return $this->nick;
    }

}

?>