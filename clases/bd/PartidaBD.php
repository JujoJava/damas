<?php

class PartidaBD
{

    /*
     * Obtiene todas las salas de la base de datos (distintas)
     * Buscará además los usuarios anfitrión y visitante para mostrar su nick
     */
    public static function getAllSalas(){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT s.codsala, anf.nick as anfitrion, vis.nick as visitante, s.pass, s.puede_espectar, s.descripcion
                              FROM sala s 
                              INNER JOIN usuario anf ON (anf.codusu = s.anfitrion) 
                              LEFT JOIN usuario vis ON (vis.codusu = s.visitante) 
                              WHERE s.jugandose = 1");
        ManejoBBDD::ejecutar(array());
        ManejoBBDD::desconectar();
        return ManejoBBDD::getDatos();
    }

    public static function getAllSalasOtros($codusu){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT s.codsala, anf.nick as anfitrion, vis.nick as visitante, s.pass, s.puede_espectar, s.descripcion
                              FROM sala s 
                              INNER JOIN usuario anf ON (anf.codusu = s.anfitrion) 
                              LEFT JOIN usuario vis ON (vis.codusu = s.visitante) 
                              WHERE anf.codusu != ? and s.jugandose = 1");
        ManejoBBDD::ejecutar(array($codusu));
        ManejoBBDD::desconectar();
        return ManejoBBDD::getDatos();
    }

    public static function getNumEspectadores(){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT s.codsala, count(e.codusu) AS cantespec
                              FROM sala s
                              INNER JOIN espectador e ON (s.codsala = e.codsala and e.codusu IN (SELECT codusu FROM usuario))
                              GROUP BY s.codsala;");
        ManejoBBDD::ejecutar(array());
        ManejoBBDD::desconectar();
        return ManejoBBDD::getDatos();
    }

    public static function existeSalaJugandose($codsala){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT * FROM sala WHERE codsala = ? and jugandose = 1");
        ManejoBBDD::ejecutar(array($codsala));
        if(ManejoBBDD::filasAfectadas() > 0){
            ManejoBBDD::desconectar();
            return true;
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function existePartida($codpartida){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT * FROM partida WHERE codpartida = ?");
        ManejoBBDD::ejecutar(array($codpartida));
        if(ManejoBBDD::filasAfectadas() > 0){
            ManejoBBDD::desconectar();
            return true;
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function existeAnfitrionSala($codusu, $codsala){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT * FROM sala WHERE anfitrion = ? and codsala = ? and jugandose = 1");
        ManejoBBDD::ejecutar(array($codusu, $codsala));
        if(ManejoBBDD::filasAfectadas() > 0){
            ManejoBBDD::desconectar();
            return true;
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function existeVisitanteSala($codusu, $codsala){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT * FROM sala WHERE visitante = ? and codsala = ? and jugandose = 1");
        ManejoBBDD::ejecutar(array($codusu, $codsala));
        if(ManejoBBDD::filasAfectadas() > 0){
            ManejoBBDD::desconectar();
            return true;
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function existeEspectadorSala($codusu, $codsala){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT * FROM espectador e
                              INNER JOIN sala s ON (e.codsala = s.codsala)
                              WHERE e.codusu = ? and s.codsala = ? and s.jugandose = 1");
        ManejoBBDD::ejecutar(array($codusu, $codsala));
        if(ManejoBBDD::filasAfectadas() > 0){
            ManejoBBDD::desconectar();
            return true;
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function creaPartida($codnegro,$codblanco){
        $codpartida = self::obtieneIdDisponiblePartida();
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("INSERT INTO partida VALUES(?,?,?)");
        ManejoBBDD::ejecutar(array($codpartida, $codnegro, $codblanco));
        if (ManejoBBDD::filasAfectadas() > 0) {
            ManejoBBDD::desconectar();
            return $codpartida;
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function creaSala($anfitrion,$pass,$descripcion,$puede_espectar,$color_anfit){
        $codpartida = '';
        if($color_anfit == 'blanco')
            $codpartida = self::creaPartida(null, $anfitrion->getCod());
        else if($color_anfit == 'negro')
            $codpartida = self::creaPartida($anfitrion->getCod(), null);
        else {
            switch(rand(0,1)) {
                case 0:
                    $codpartida = self::creaPartida($anfitrion->getCod(), null);
                    break;
                case 1:
                    $codpartida = self::creaPartida(null, $anfitrion->getCod());
                    break;
            }
        }
        if($codpartida) {
            if($puede_espectar) $puede_espectar = 1;
            else $puede_espectar = 0;
            $codsala = self::obtieneIdDisponibleSala();
            ManejoBBDD::conectar();
            if($pass == '') {
                ManejoBBDD::preparar("INSERT INTO sala VALUES(?,?,?,NULL,?,?,?,1)");
                $pass = null;
            } else
                ManejoBBDD::preparar("INSERT INTO sala VALUES(?,?,?,NULL,SHA(?),?,?,1)");
            ManejoBBDD::ejecutar(array($codsala, $codpartida, $anfitrion->getCod(), $pass, $descripcion, $puede_espectar));
            if(ManejoBBDD::filasAfectadas() > 0){
                ManejoBBDD::desconectar();
                return array('codsala' => $codsala, 'codpartida' => $codpartida);
            }
        }
        return false;
    }

    public static function setColorNuevoVisitante($codpartida){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT codnegro, codblanco FROM partida WHERE codpartida = ?");
        ManejoBBDD::ejecutar(array($codpartida));
        if(ManejoBBDD::filasAfectadas() > 0){
            $datos = ManejoBBDD::getDatos();
            $codnegro = $datos[0]['codnegro'];
            $codblanco = $datos[0]['codblanco'];
            ManejoBBDD::preparar("SELECT visitante FROM sala WHERE codpartida = ?");
            ManejoBBDD::ejecutar(array($codpartida));
            if(ManejoBBDD::filasAfectadas() > 0) {
                $visitante = ManejoBBDD::getDatos()[0]['visitante'];
                if ($codnegro == NULL) $codnegro = $visitante;
                else if ($codblanco == NULL) $codblanco = $visitante;
                ManejoBBDD::preparar("UPDATE partida SET codblanco = ?, codnegro = ? WHERE codpartida = ?");
                ManejoBBDD::ejecutar(array($codblanco, $codnegro, $codpartida));
                if(ManejoBBDD::filasAfectadas() > 0){
                    ManejoBBDD::desconectar();
                    return true;
                }
            }
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function getColores($codpartida){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT codnegro, codblanco FROM partida WHERE codpartida = ?");
        ManejoBBDD::ejecutar(array($codpartida));
        if(ManejoBBDD::filasAfectadas() > 0){
            $datos = ManejoBBDD::getDatos();
            ManejoBBDD::desconectar();
            return $datos[0];
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function getMovimientos($codpartida){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT * FROM movimiento WHERE codpartida = ?");
        ManejoBBDD::ejecutar(array($codpartida));
        if(ManejoBBDD::filasAfectadas() > 0){
            $datos = ManejoBBDD::getDatos();
            ManejoBBDD::desconectar();
            return $datos;
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function getComidasMovimiento($codmovimiento){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT * FROM comida WHERE codmov = ?");
        ManejoBBDD::ejecutar(array($codmovimiento));
        if(ManejoBBDD::filasAfectadas() > 0){
            $datos = ManejoBBDD::getDatos();
            ManejoBBDD::desconectar();
            return $datos;
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function addComidas($codmov, $comidas){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("INSERT INTO comida VALUES(?,?)");
        ManejoBBDD::iniTransaction();
        try{
            foreach($comidas as $comida){
                ManejoBBDD::ejecutar(array($comida['numFicha'], $codmov));
            }
            ManejoBBDD::commit();
            return true;
        } catch(PDOException $e) {
            ManejoBBDD::rollback();
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function addMovimiento($codpartida, $codusu, $numficha, $mov_dest, $comidas){
        $codmov = self::obtieneIdDisponibleMovimiento();
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("INSERT INTO movimiento VALUES(?,?,?,?,?)");
        ManejoBBDD::ejecutar(array($codmov, $codpartida, $codusu, $numficha, $mov_dest));
        if(ManejoBBDD::filasAfectadas() > 0){
            ManejoBBDD::desconectar();
            if(self::addComidas($codmov, $comidas)) {
                return $codmov;
            }
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function entrarSalaRedirect($codsala, $pass, $codusu, $tipo) {
        if(self::obtienePass($codsala) == $pass) { //uso directamente la variable sin SHA, porque ya está codificada
            ManejoBBDD::conectar();
            if ($tipo == 'visitante') {
                ManejoBBDD::preparar("SELECT visitante FROM sala WHERE codsala = ? and jugandose = 1");
                ManejoBBDD::ejecutar(array($codsala));
                if (ManejoBBDD::getDatos()[0]['visitante'] == NULL) {
                    ManejoBBDD::preparar("UPDATE sala SET visitante = ? WHERE codsala = ? and jugandose = 1");
                    ManejoBBDD::ejecutar(array($codusu, $codsala));
                    if(ManejoBBDD::filasAfectadas() > 0){
                        ManejoBBDD::preparar("SELECT codpartida, anfitrion FROM sala WHERE codsala = ? and jugandose = 1");
                        ManejoBBDD::ejecutar(array($codsala));
                        $datos = ManejoBBDD::getDatos();
                        $codpartida = $datos[0]['codpartida'];
                        $anfitrion = $datos[0]['anfitrion'];
                        if(ManejoBBDD::filasAfectadas() > 0) {
                            ManejoBBDD::desconectar();
                            return array('codsala' => $codsala, 'codpartida' => $codpartida, 'anfitrion' => $anfitrion);
                        }
                    }
                }
            }
            else if($tipo == 'espectador'){
                //LO DEJO PARA OTRO MOMENTO
            }
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function borraAnfitrionesSalas(){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT s.anfitrion, s.codsala, s.codpartida FROM sala s
                              INNER JOIN usuario u ON (s.anfitrion = u.codusu)
                              WHERE u.pulsacion < (NOW() - INTERVAL 1 MINUTE) and s.jugandose = 1");
        ManejoBBDD::ejecutar(array());
        if(ManejoBBDD::filasAfectadas() > 0){
            $datos = ManejoBBDD::getDatos();
            foreach ($datos as $anfitrion) {
                ManejoBBDD::desconectar();
                self::salirSala($anfitrion['codsala'], $anfitrion['codpartida'], $anfitrion['anfitrion'], 'anfitrion');
                ManejoBBDD::conectar();
                ManejoBBDD::preparar("SELECT codusu FROM invitado  WHERE codusu = ?");
                ManejoBBDD::ejecutar(array($anfitrion['anfitrion']));
                if (ManejoBBDD::filasAfectadas() > 0) { //es un invitado
                    ManejoBBDD::preparar("UPDATE sala SET anfitrion = null WHERE anfitrion = ? and codsala = ?");
                    ManejoBBDD::ejecutar(array($anfitrion['anfitrion'], $anfitrion['codsala']));
                }
            }
            return true;
        }
        return false;
    }

    public static function borraVisitantesSalas(){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT s.visitante, s.codsala, s.codpartida FROM sala s
                              INNER JOIN usuario u ON (s.visitante = u.codusu)
                              WHERE u.pulsacion < (NOW() - INTERVAL 1 MINUTE) and s.jugandose = 1");
        ManejoBBDD::ejecutar(array());
        if(ManejoBBDD::filasAfectadas() > 0){
            $datos = ManejoBBDD::getDatos();
            foreach ($datos as $visitante) {
                ManejoBBDD::desconectar();
                self::salirSala($visitante['codsala'], $visitante['codpartida'], $visitante['visitante'], 'visitante');
                ManejoBBDD::conectar();
                ManejoBBDD::preparar("SELECT codusu FROM invitado WHERE codusu = ?");
                ManejoBBDD::ejecutar(array($visitante['visitante']));
                if (ManejoBBDD::filasAfectadas() > 0) { //es un invitado
                    ManejoBBDD::preparar("UPDATE sala SET visitante = null WHERE visitante = ? and codsala = ?");
                    ManejoBBDD::ejecutar(array($visitante['visitante'], $visitante['codsala']));
                }
            }
            return true;
        }
        return false;
    }

    public static function salirSala($codsala, $codpartida, $codusu, $tipo) {
        ManejoBBDD::conectar();
        switch ($tipo) {
            case "anfitrion":
                ManejoBBDD::preparar("UPDATE sala SET jugandose = 0 WHERE codsala = ? and jugandose = 1");
                ManejoBBDD::ejecutar(array($codsala));
                break;
            case "visitante":
                $codnewpartida = self::obtieneIdDisponiblePartida();
                ManejoBBDD::preparar("SELECT * FROM partida WHERE codpartida = ?");
                ManejoBBDD::ejecutar(array($codpartida));
                $datospartida = ManejoBBDD::getDatos();
                if($datospartida[0]['codnegro'] == $codusu) {
                    ManejoBBDD::preparar("INSERT INTO partida VALUES(?,NULL,?)");
                    ManejoBBDD::ejecutar(array($codnewpartida, $datospartida[0]['codblanco']));
                } else {
                    ManejoBBDD::preparar("INSERT INTO partida VALUES(?,?,NULL)");
                    ManejoBBDD::ejecutar(array($codnewpartida, $datospartida[0]['codnegro']));
                }
                ManejoBBDD::preparar("SELECT * FROM sala WHERE codsala = ? and jugandose = 1");
                ManejoBBDD::ejecutar(array($codsala));
                $datossala = ManejoBBDD::getDatos()[0];
                ManejoBBDD::preparar("INSERT INTO sala VALUES(?,?,?,NULL,?,?,?,1)");
                ManejoBBDD::ejecutar(array(
                    $datossala['codsala'],
                    $codnewpartida,
                    $datossala['anfitrion'],
                    $datossala['pass'],
                    $datossala['descripcion'],
                    $datossala['puede_espectar']
                ));
                if(ManejoBBDD::filasAfectadas() > 0){
                    ManejoBBDD::preparar("UPDATE sala SET jugandose = 0 WHERE codsala = ? and codpartida = ?");
                    ManejoBBDD::ejecutar(array($codsala, $codpartida));
                }
                break;
            case "espectador":
                ManejoBBDD::preparar("DELETE FROM espectador WHERE codsala = ? and codusu = ?");
                ManejoBBDD::ejecutar(array($codsala, $codusu));
                break;
        }
        if(ManejoBBDD::filasAfectadas() > 0){
            ManejoBBDD::desconectar();
            return true;
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function getEspectadoresSala($codsala){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT codusu FROM espectador WHERE codsala = ? and jugandose = 1");
        ManejoBBDD::ejecutar(array($codsala));
        $datos = ManejoBBDD::getDatos();
        ManejoBBDD::desconectar();
        return $datos;
    }

    public static function getVisitante($codsala){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT u.codusu, u.nick FROM usuario u
                              INNER JOIN sala s ON (u.codusu = s.visitante)
                              WHERE s.codsala = ? and jugandose = 1");
        ManejoBBDD::ejecutar(array($codsala));
        if(ManejoBBDD::filasAfectadas() > 0){
            $datos = ManejoBBDD::getDatos();
            ManejoBBDD::desconectar();
            return $datos;
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function getSalaJugandose($codsala){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT * FROM sala WHERE codsala = ? and jugandose = 1");
        ManejoBBDD::ejecutar(array($codsala));
        if(ManejoBBDD::filasAfectadas() > 0){
            $datos = ManejoBBDD::getDatos();
            ManejoBBDD::desconectar();
            return $datos;
        }
        ManejoBBDD::desconectar();
        return false;
    }

    public static function obtienePass($codsala){
        $pass = "";
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT DISTINCT pass FROM sala WHERE codsala = ?");
        ManejoBBDD::ejecutar(array($codsala));
        if(ManejoBBDD::filasAfectadas() > 0) {
            $pass = ManejoBBDD::getDatos()[0]['pass'];
        }
        ManejoBBDD::desconectar();
        return $pass;
    }

    public static function obtieneIdDisponibleSala(){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT codsala FROM sala");
        ManejoBBDD::ejecutar(array());
        $datos = ManejoBBDD::getDatos();
        $contador = 1;
        $e = true;
        while($e == true){
            $e = false;
            for($i = 0 ; $i < count($datos) ; $i++){
                if($datos[$i]['codsala']*1 == $contador)
                    $e = true;
            }
            if($e == false)
                return $contador;
            $contador++;
        }
        ManejoBBDD::desconectar();
        return $contador;
    }

    public static function obtieneIdDisponiblePartida(){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT codpartida FROM partida");
        ManejoBBDD::ejecutar(array());
        $datos = ManejoBBDD::getDatos();
        $contador = 1;
        $e = true;
        while($e == true){
            $e = false;
            for($i = 0 ; $i < count($datos) ; $i++){
                if($datos[$i]['codpartida']*1 == $contador)
                    $e = true;
            }
            if($e == false)
                return $contador;
            $contador++;
        }
        ManejoBBDD::desconectar();
        return $contador;
    }
    public static function obtieneIdDisponibleMovimiento(){
        ManejoBBDD::conectar();
        ManejoBBDD::preparar("SELECT codmov FROM movimiento");
        ManejoBBDD::ejecutar(array());
        $datos = ManejoBBDD::getDatos();
        $contador = 1;
        $e = true;
        while($e == true){
            $e = false;
            for($i = 0 ; $i < count($datos) ; $i++){
                if($datos[$i]['codmov']*1 == $contador)
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

?>