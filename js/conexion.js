$(window).ready(function(){
    estaConectado();
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
                                if(respuesta.partida.visitante) {
                                    $('#juego .color .negras').html(respuesta.partida.visitante.nick);
                                }
                                else {
                                    $('#juego .color .negras').html('');
                                }
                            } else {
                                $('#juego .color .negras').html(respuesta.partida.anfitrion.nick);
                                if(respuesta.partida.visitante) {
                                    $('#juego .color .blancas').html(respuesta.partida.visitante.nick);
                                }
                                else {
                                    $('#juego .color .blancas').html('');
                                }
                            }
                            mis_datos = respuesta.partida.mis_datos;
                            anfitrion = respuesta.partida.anfitrion;
                            visitante = respuesta.partida.visitante;
                            if(anfitrion && visitante){
                                if(estado === 'no_jugando') {
                                    inicializaJuego();
                                    actualizaJuego();
                                    estado = 'jugando';
                                    turno = 'blancas';
                                }
                            }
                            else {
                                estado = 'no_jugando';
                                turno = '';
                            }
                            if (mis_datos.rol !== 'espectador') {
                                if (mis_datos.cod == respuesta.partida.colores.codblanco) {
                                    mis_datos['color'] = 'blancas';
                                } else {
                                    mis_datos['color'] = 'negras';
                                }
                            }
                            console.log(respuesta.partida.movimientos);
                            if (respuesta.partida.movimientos) {
                                console.log(respuesta.partida.movimientos);
                                //hayNuevosMovimientos(respuesta.partida.movimientos);
                            }
                            inicializaJuego();
                            actualizaJuego();
                        }
                        else { //no está en la sala de juego. Mensaje de aviso si hay nuevos movimientos.
                            if (respuesta.partida.movimientos) {
                                //mensaje de aviso
                            }
                        }
                    }
                    setTimeout(estaConectado, 5000); //cada 5 segundos
                }
            }
        }
    });
}