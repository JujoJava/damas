<?php
/**
 * Created by PhpStorm.
 * User: Juanjo
 * Date: 07/02/2018
 * Time: 11:57
 */

define("DBNAME","damas");
define("HOST","localhost");
define("USERNAME_ROOT","root");
define("PASSWORD_ROOT","");
define("USERNAME_LIMITADO","limitado");
define("PASSWORD_LIMITADO","limitado");
define("USERNAME_CLIENTE","cliente");
define("PASSWORD_CLIENTE","cliente");
define("USERNAME_GESTOR","gestor");
define("PASSWORD_GESTOR","gestor");

class ManejoBBDD
{

    private static $conexion = null;
    private static $preparada = null;

    /* CONEXIONES */

    public static function conectar(){
        try {
            self::$conexion = new PDO('mysql:host='.HOST.';dbname='.DBNAME,
                USERNAME_ROOT, PASSWORD_ROOT,
                array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES \'UTF8\''));
        }
        catch (PDOException $e) {
            die("Ha habido un error al conectar: ".$e->getMessage());
        }
        return true;
    }
    public static function desconectar(){
        self::$conexion = null;
    }
    /* TRANSACCIONES */
    public static function iniTransaction(){
        if(self::$conexion instanceof PDO) {
            self::$conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            self::$conexion->beginTransaction();
        }
    }
    public static function commit(){
        if(self::$conexion instanceof PDO)
            self::$conexion->commit();
    }
    public static function rollback(){
        if(self::$conexion instanceof PDO)
            self::$conexion->rollBack();
    }
    /* CONSULTAS PREPARADAS */
    public static function preparar($query){
        if(self::$conexion instanceof PDO)
            self::$preparada = self::$conexion->prepare($query);
    }
    public static function ejecutar($array){
        if(self::$preparada instanceof PDOStatement){
            self::$preparada->execute($array);
        }
    }
    public static function ejecutar_param($array,$parametro){
        if(self::$preparada instanceof PDOStatement){
            self::$preparada->execute($array,$parametro);
        }
    }
    public static function getDatos(){
        $datos = array();
        if(self::$preparada instanceof PDOStatement){
            while($linea = self::$preparada->fetch()){
                $datos[] = $linea;
            }
        }
        return $datos;
    }
    public static function filasAfectadas(){
        if(self::$preparada instanceof PDOStatement){
            return self::$preparada->rowCount();
        }
        return -1;
    }
    public static function quitarPreparada(){
        self::$preparada = null;
    }
}

?>