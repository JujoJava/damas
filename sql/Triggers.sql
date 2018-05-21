delimiter |

CREATE TRIGGER borra_usu_sala BEFORE DELETE ON usuario
FOR EACH ROW
BEGIN
	UPDATE sala SET sala.anfitrion = NULL WHERE usuario.codusu = sala.anfitrion;
	UPDATE sala SET sala.visitante = NULL WHERE usuario.codusu = sala.visitante;
END;

CREATE TRIGGER desactiva_usu_sala BEFORE UPDATE ON jugador
FOR EACH ROW
BEGIN
	UPDATE sala SET sala.anfitrion = NULL WHERE jugador.conectado = 0 AND jugador.codusu = sala.anfitrion;
	UPDATE sala SET sala.visitante = NULL WHERE jugador.conectado = 0 AND jugador.codusu = sala.visitante;
END;

|

delimiter ;