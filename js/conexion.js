$(window).ready(function(){
    estaConectado(true);
});

function estaConectado(){
    $.ajax({
        data: {},
        type: 'POST',
        dataType: 'json',
        url: 'ajax/conexion.php',
        success: function(respuesta){
            if($('#redirect').length === 0) {
                if (respuesta.alerta !== '') {
                    window.alert(respuesta.alerta);
                }

                if (respuesta.accion === 'salpartida') {
                    if ($('#juego').length > 0) {
                        window.location = 'principal';
                    }
                } else if (respuesta.accion === 'actualiza') {
                    location.reload();
                }

                if (respuesta.conectado) {
                    if (respuesta.partida) { //hay una partida activa
                        if ($('#juego').length > 0) { //esta en la sala de juego. Se actualizará el tablero
                            $('#juego .anfitrion').html("Sala de " + respuesta.partida.anfitrion.nick);
                            if (respuesta.partida.anfitrion.cod == respuesta.partida.colores.codblanco) {
                                $('#juego .color .blancas').html(respuesta.partida.anfitrion.nick);
                                if(respuesta.partida.visitante)
                                    $('#juego .color .negras').html(respuesta.partida.visitante.nick);
                                else
                                    $('#juego .color .negras').html('');
                            } else {
                                $('#juego .color .negras').html(respuesta.partida.anfitrion.nick);
                                if(respuesta.partida.visitante)
                                    $('#juego .color .blancas').html(respuesta.partida.visitante.nick);
                                else
                                    $('#juego .color .blanas').html('');
                            }
                            mis_datos = respuesta.partida.mis_datos;
                            anfitrion = respuesta.partida.anfitrion;
                            visitante = respuesta.partida.visitante;
                            inicializaJuego();
                            actualizaJuego();
                            if(anfitrion && visitante && estado === 'no_jugando'){
                                estado = 'jugando';
                                turno = 'blancas';
                            }
                            if (mis_datos.rol !== 'espectador') {
                                if (mis_datos.cod == respuesta.partida.colores.codblanco) {
                                    mis_datos['color'] = 'blancas';
                                } else {
                                    mis_datos['color'] = 'negras';
                                }
                            }
                            if (respuesta.partida.movimientos) {
                                hayNuevosMovimientos(respuesta.partida.movimientos);
                            }
                        }
                        else { //no está en la sala de juego. Mensaje de aviso si hay nuevos movimientos.
                            if (respuesta.partida.movimientos) {
                                //mensaje de aviso
                            }
                        }
                    }
                    setTimeout(estaConectado, 30000);
                }
            }
        }
    });
}