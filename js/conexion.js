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
                        if(window.location !== 'principal')
                            window.location = 'principal';
                        else
                            location.reload();
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
                            // se ha actualizado la página o se ha entrado desde otro sitio //
                            if(respuesta.partida.movimientos.length > 0 && movimientos.length === 0) {
                                var ultimo_mov = respuesta.partida.movimientos[respuesta.partida.movimientos.length-1];
                                hayNuevoMovimiento(respuesta.partida.movimientos);
                                inicializaJuego();
                                actualizaJuego();
                                if(ultimo_mov.color === 'blancas') {
                                    if(ultimo_mov.numficha !== -1) {
                                        turno = 'negras';
                                    } else {
                                        turno = 'blancas';
                                    }
                                } else if(ultimo_mov.color === 'negras'){
                                    if(ultimo_mov.numficha !== -1) {
                                        turno = 'blancas';
                                    } else {
                                        turno = 'negras';
                                    }
                                }
                            }
                            else if(respuesta.partida.nuevos_movimientos) {
                                hayNuevoMovimiento(respuesta.partida.movimientos);
                                inicializaJuego();
                                actualizaJuego();
                                if(respuesta.partida.movimientos[respuesta.partida.movimientos.length-1].numficha !== -1){
                                    cambiaTurno();
                                }
                                console.log(fichas);
                            }
                        }
                        else { //no está en la sala de juego. Mensaje de aviso si hay nuevos movimientos.
                            if (respuesta.partida.nuevos_movimientos) {
                                $('#mensaje_aviso').show();
                            }
                        }
                    }
                    setTimeout(estaConectado, 5000); //cada 5 segundos
                }
            }
        }
    });
}