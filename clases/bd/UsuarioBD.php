<?php
/**
 * Created by PhpStorm.
 * User: Juanjo
 * Date: 10/05/2018
 * Time: 18:10
 */

class UsuarioBD
{

    public static function pulsacionUsuario($codusu){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("UPDATE usuario SET pulsacion = NOW() WHERE codusu = ?");
        ManejoBBDD::ejecutar(array($codusu));
        if(ManejoBBDD::filasAfectadas() > 0){
            ManejoBBDD::desconectar();
            return true;
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function loginJugador($nick, $pass){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT * FROM jugador j 
                              INNER JOIN usuario u ON u.codusu = j.codusu
                              WHERE u.nick = ? AND j.pass = SHA(?)");
        ManejoBBDD::ejecutar(array($nick, $pass));
        $datos = ManejoBBDD::getDatos();
        if(count($datos) > 0){
            ManejoBBDD::desconectar();
            return $datos;
        }
        ManejoBBDD::desconectar();
        return null;
    }

    public static function borraInvitadosNoConectados(){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("DELETE u.* FROM usuario u 
                              INNER JOIN invitado i ON (i.codusu = u.codusu)
                              WHERE u.pulsacion < (NOW() - INTERVAL 1 MINUTE)");
        ManejoBBDD::ejecutar(array());
        $cantidad = ManejoBBDD::filasAfectadas();
        ManejoBBDD::desconectar();
        return $cantidad;
    }

    public static function desconectaJugadoresNoConectados(){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("UPDATE jugador j
                              INNER JOIN usuario u ON (j.codusu = u.codusu)
                              SET j.conectado = 0
                              WHERE u.pulsacion < (NOW() - INTERVAL 1 MINUTE)");
        ManejoBBDD::ejecutar(array());
        $cantidad = ManejoBBDD::filasAfectadas();
        ManejoBBDD::desconectar();
        return $cantidad;
    }

    public static function existeUsuario($codusu){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT * FROM usuario WHERE codusu = ?");
        ManejoBBDD::ejecutar(array($codusu));
        if(ManejoBBDD::filasAfectadas() > 0){
            ManejoBBDD::desconectar();
            return true;
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function transformaInvitadoEnJugador($cod, $nick, $pass){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("DELETE FROM invitado WHERE codusu = ?");
        ManejoBBDD::ejecutar(array($cod));
        if(ManejoBBDD::filasAfectadas() > 0){
            ManejoBBDD::preparar("UPDATE usuario SET nick = ? WHERE codusu = ?");
            ManejoBBDD::ejecutar(array($nick, $cod));
            if(ManejoBBDD::filasAfectadas() > 0) {
                ManejoBBDD::preparar("INSERT INTO jugador VALUES(?,?,1)");
                ManejoBBDD::ejecutar(array($cod, $pass));
                if(ManejoBBDD::filasAfectadas() > 0){
                    ManejoBBDD::desconectar();
                    return true;
                }
            }
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function registraJugador($nick, $pass){
        $codusu = self::obtieneIdDisponibleUsuario();
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("INSERT INTO usuario VALUES(?,?,NOW())");
        ManejoBBDD::ejecutar(array($codusu, $nick));
        if(ManejoBBDD::filasAfectadas() > 0){
            ManejoBBDD::preparar("INSERT INTO jugador VALUES(?,SHA(?),1)");
            ManejoBBDD::ejecutar(array($codusu, $pass));
            if(ManejoBBDD::filasAfectadas() > 0){
                ManejoBBDD::desconectar();
                return $codusu;
            }
            ManejoBBDD::desconectar();
            return null;
        }
        ManejoBBDD::desconectar();
        return null;
    }
    public static function obtieneUsuario($codusu){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT nick FROM usuario WHERE codusu = ?");
        ManejoBBDD::ejecutar(array($codusu));
        if(ManejoBBDD::filasAfectadas() > 0){
            $datos = ManejoBBDD::getDatos();
            ManejoBBDD::desconectar();
            return $datos;
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function obtieneJugador($codusu) {
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT usuario.nick FROM jugador 
                              INNER JOIN usuario ON (jugador.codusu = usuario.codusu)
                              WHERE usuario.codusu = ?");
        ManejoBBDD::ejecutar(array($codusu));
        if(ManejoBBDD::filasAfectadas() > 0){
            $datos = ManejoBBDD::getDatos();
            ManejoBBDD::desconectar();
            return $datos;
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function obtieneInvitado($codusu) {
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT usuario.nick FROM invitado 
                              INNER JOIN usuario ON (invitado.codusu = usuario.codusu)
                              WHERE usuario.codusu = ?");
        ManejoBBDD::ejecutar(array($codusu));
        if(ManejoBBDD::filasAfectadas() > 0){
            $datos = ManejoBBDD::getDatos();
            ManejoBBDD::desconectar();
            return $datos;
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function existeNickUsuario($nick) {
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT * FROM usuario WHERE nick = ?");
        ManejoBBDD::ejecutar(array($nick));
        if(ManejoBBDD::filasAfectadas() > 0){
            ManejoBBDD::desconectar();
            return true;
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function existeNickJugador($nick) {
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT * FROM jugador 
                              INNER JOIN usuario ON (jugador.codusu = usuario.codusu)
                              WHERE usuario.nick = ?");
        ManejoBBDD::ejecutar(array($nick));
        if(ManejoBBDD::filasAfectadas() > 0){
            ManejoBBDD::desconectar();
            return true;
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function insertaInvitado($nick) {
        $codusu = self::obtieneIdDisponibleUsuario();
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("INSERT INTO usuario VALUES(?,?,NOW())");
        ManejoBBDD::ejecutar(array($codusu, $nick));
        if(ManejoBBDD::filasAfectadas() > 0){
            ManejoBBDD::preparar("INSERT INTO invitado VALUES(?)");
            ManejoBBDD::ejecutar(array($codusu));
            if(ManejoBBDD::filasAfectadas() > 0){
                ManejoBBDD::desconectar();
                return $codusu;
            }
            ManejoBBDD::desconectar();
            return null;
        }
        ManejoBBDD::desconectar();
        return null;
    }

    public static function obtieneIdDisponibleUsuario(){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT codusu FROM usuario");
        ManejoBBDD::ejecutar(array());
        $datos = ManejoBBDD::getDatos();
        $contador = 1;
        $e = true;
        while($e == true){
            $e = false;
            for($i = 0 ; $i < count($datos) ; $i++){
                if($datos[$i]['codusu']*1 == $contador)
                    $e = true;
            }
            if($e == false)
                return $contador;
            $contador++;
        }
        ManejoBBDD::desconectar();
        return $contador;
    }

}