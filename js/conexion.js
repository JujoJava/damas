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
                    if(respuesta.alljug){
                        if($('#ranking').length > 0){
                            var elm;
                            for(i = 0 ; i < respuesta.alljug.length ; i++){
                                elm = $('#ranking table tr#usuario-'+respuesta.alljug[i].codusu).children('td.estado');
                                elm.attr("class", "estado conexion-"+respuesta.alljug[i].conectado);
                                switch(respuesta.alljug[i].conectado){
                                    case 0:
                                        elm.html("<span>Desconectado</span>");
                                        break;
                                    case 1:
                                        elm.html("<span>Conectado</span>");
                                        break;
                                    case 2:
                                        elm.html("<a class='"+respuesta.alljug[i].codsala+"' name='jugar-sala' title='Entrar'>Jugando</a>");
                                        break;
                                    case 3:
                                        elm.html("<a class='"+respuesta.alljug[i].codsala+"' name='jugar-sala' title='Entrar'>Viendo una partida</a>");
                                        break;
                                }
                            }
                            //botón para jugar partida
                            $('#ranking table .estado a[name=jugar-sala]').on('click', function(){
                                var boton = $(this);
                                if(!boton.hasClass('desactivado')) {
                                    var codsala = boton.attr('class');
                                    $('#ranking table a[name=jugar-sala]').addClass('desactivado');
                                    var textoBoton = boton.html();
                                    $.ajax({
                                        data: {
                                            modo: 'logueado'
                                        },
                                        type: 'POST',
                                        dataType: 'json',
                                        url: 'ajax/get.php',
                                        success: function (response) {
                                            if (response.correcto) {
                                                window.location = 'redirect/' + codsala + '/';
                                            } else {
                                                botonNormal(boton, textoBoton);
                                                $('#modal_entrar_sala').modal();
                                                $('#modal_entrar_sala button[name=entrar-sala]').attr('id', codsala);
                                                $('#ranking table a[name=jugar-sala]').removeClass('desactivado');
                                            }
                                        },
                                        beforeSend: function () {
                                            botonRueda(boton);
                                        }
                                    });
                                }
                            });
                        }
                    }
                    if(respuesta.amigos || respuesta.mis_solicitudes || respuesta.solicitudes_a_mi){
                        var cadena = '';
                        var k;
                        if(respuesta.amigos) {
                            for (k = 0; k < respuesta.amigos.length; k++) {
                                if (respuesta.amigos[k].conectado === 1) {
                                    cadena += "<div>";
                                    cadena += "<span><a href='perfil/" + respuesta.amigos[k].codusu + "'>" + respuesta.amigos[k].nick + "</a></span>";
                                    cadena += "<span class='estado conexion-1'>Conectado</span>";
                                    cadena += "</div>";
                                }
                            }
                            for (k = 0; k < respuesta.amigos.length; k++) {
                                if (respuesta.amigos[k].conectado === 2) {
                                    cadena += "<div>";
                                    cadena += "<span><a href='perfil/" + respuesta.amigos[k].codusu + "'>" + respuesta.amigos[k].nick + "</a></span>";
                                    cadena += "<span class='estado conexion-2'><a class='" + respuesta.amigos[k].codsala + "' name='jugar-sala' title='Entrar'>Jugando</a></span>";
                                    cadena += "</div>";
                                }
                            }
                            for (k = 0; k < respuesta.amigos.length; k++) {
                                if (respuesta.amigos[k].conectado === 3) {
                                    cadena += "<div>";
                                    cadena += "<span><a href='perfil/" + respuesta.amigos[k].codusu + "'>" + respuesta.amigos[k].nick + "</a></span>";
                                    cadena += "<span class='estado conexion-3'><a class='" + respuesta.amigos[k].codsala + "' name='jugar-sala' title='Entrar'>Viendo una partida</a></span>";
                                    cadena += "</div>";
                                }
                            }
                            for (k = 0; k < respuesta.amigos.length; k++) {
                                if (respuesta.amigos[k].conectado === 0) {
                                    cadena += "<div>";
                                    cadena += "<span><a href='perfil/" + respuesta.amigos[k].codusu + "'>" + respuesta.amigos[k].nick + "</a></span>";
                                    cadena += "<span class='estado conexion-0'>Desconectado</span>";
                                    cadena += "</div>";
                                }
                            }
                        }
                        if(respuesta.mis_solicitudes) {
                            for (k = 0; k < respuesta.mis_solicitudes.length; k++) {
                                cadena += "<div>";
                                cadena += "<span><a href='perfil/" + respuesta.mis_solicitudes[k].codusu + "'>" + respuesta.mis_solicitudes[k].nick + "</a></span>";
                                cadena += "<span class='enviada_sol'>Solicitud enviada</span>";
                                cadena += "</div>";
                            }
                        }
                        if(respuesta.solicitudes_a_mi) {
                            for (k = 0; k < respuesta.solicitudes_a_mi.length; k++) {
                                cadena += "<div>";
                                cadena += "<span><a href='perfil/" + respuesta.solicitudes_a_mi[k].codusu + "'>" + respuesta.solicitudes_a_mi[k].nick + "</a></span>";
                                cadena += "<span class='recibida_sol'>Te ha enviado una solicitud</span>";
                                cadena += "</div>";
                            }
                        }
                        $('#menu-lateral #lista-amigos').html(cadena);
                        if ($('#perfil .seccion-amistad .lista-amigos').length > 0){
                            $('#perfil .seccion-amistad .lista-amigos').html(cadena);
                        }

                        //botón para jugar partida
                        $('#menu-lateral #lista-amigos .estado a[name=jugar-sala]').on('click', function(){
                            var boton = $(this);
                            if(!boton.hasClass('desactivado')) {
                                var codsala = boton.attr('class');
                                boton.addClass('desactivado');
                                $('#menu-lateral .lista-amigos .estado a[name=jugar-sala]').addClass('desactivado');
                                var textoBoton = boton.html();
                                $.ajax({
                                    data: {
                                        modo: 'logueado'
                                    },
                                    type: 'POST',
                                    dataType: 'json',
                                    url: 'ajax/get.php',
                                    success: function (response) {
                                        if (response.correcto) {
                                            window.location = 'redirect/' + codsala + '/';
                                        } else {
                                            botonNormal(boton, textoBoton);
                                            $('#modal_entrar_sala').modal();
                                            $('#modal_entrar_sala button[name=entrar-sala]').attr('id', codsala);
                                            boton.removeClass('desactivado');
                                            $('#menu-lateral .lista-amigos .estado a[name=jugar-sala]').removeClass('desactivado');
                                        }
                                    },
                                    beforeSend: function () {
                                        botonRueda(boton);
                                    }
                                });
                            }
                        });

                    }

                    if(respuesta.conexion_perfil){
                        $('#perfil > .zona-izq > .estado').attr("class", "estado conexion-"+respuesta.conexion_perfil.conectado);
                        switch(respuesta.conexion_perfil.conectado){
                            case 0:
                                $('#perfil > .zona-izq > .estado').html("<span>Desconectado</span>");
                                break;
                            case 1:
                                $('#perfil > .zona-izq > .estado').html("<span>Conectado</span>");
                                break;
                            case 2:
                                $('#perfil > .zona-izq > .estado').html("<a class='"+respuesta.conexion_perfil.codsala+"' name='jugar-sala' title='Entrar'>Jugando</a>");
                                break;
                            case 3:
                                $('#perfil > .zona-izq > .estado').html("<a class='"+respuesta.conexion_perfil.codsala+"' name='jugar-sala' title='Entrar'>Viendo una partida</a>");
                                break;
                        }
                    }

                    //botón para jugar partida
                    $('#perfil .estado a[name=jugar-sala]').on('click', function(){
                        var boton = $(this);
                        if(!boton.hasClass('desactivado')) {
                            var codsala = boton.attr('class');
                            boton.addClass('desactivado');
                            $('#perfil .estado a[name=jugar-sala]').addClass('desactivado');
                            var textoBoton = boton.html();
                            $.ajax({
                                data: {
                                    modo: 'logueado'
                                },
                                type: 'POST',
                                dataType: 'json',
                                url: 'ajax/get.php',
                                success: function (response) {
                                    if (response.correcto) {
                                        window.location = 'redirect/' + codsala + '/';
                                    } else {
                                        botonNormal(boton, textoBoton);
                                        $('#modal_entrar_sala').modal();
                                        $('#modal_entrar_sala button[name=entrar-sala]').attr('id', codsala);
                                        boton.removeClass('desactivado');
                                        $('#perfil .estado a[name=jugar-sala]').removeClass('desactivado');
                                    }
                                },
                                beforeSend: function () {
                                    botonRueda(boton);
                                }
                            });
                        }
                    });

                    if (respuesta.partida) { //hay una partida activa
                        if ($('#juego').length > 0) { //esta en la sala de juego. Se actualizará el tablero
                            if(respuesta.partida.tipo === 'sala') {
                                $('#juego .anfitrion').html("Sala de " + respuesta.partida.anfitrion.nick);
                                if (respuesta.partida.anfitrion.cod == respuesta.partida.colores.codblanco) {
                                    if(respuesta.partida.anfitrion.tipo === 'jugador') {
                                        $('#juego .color .blancas').html("<a href='perfil/" + respuesta.partida.colores.codblanco + "'>" + respuesta.partida.anfitrion.nick + "</a>");
                                    } else if(respuesta.partida.anfitrion.tipo === 'invitado'){
                                        $('#juego .color .blancas').html(respuesta.partida.anfitrion.nick);
                                    }
                                    if (respuesta.partida.visitante) {
                                        if(respuesta.partida.visitante.tipo === 'jugador') {
                                            $('#juego .color .negras').html("<a href='perfil/" + respuesta.partida.colores.codnegro + "'>" + respuesta.partida.visitante.nick + "</a>");
                                        } else if(respuesta.partida.visitante.tipo === 'invitado'){
                                            $('#juego .color .negras').html(respuesta.partida.visitante.nick);
                                        }
                                    }
                                    else {
                                        $('#juego .color .negras').html('');
                                    }
                                } else {
                                    if(respuesta.partida.anfitrion.tipo === 'jugador') {
                                        $('#juego .color .negras').html("<a href='perfil/" + respuesta.partida.colores.codnegro + "'>" + respuesta.partida.anfitrion.nick + "</a>");
                                    } else if(respuesta.partida.anfitrion.tipo === 'invitado'){
                                        $('#juego .color .negras').html(respuesta.partida.anfitrion.nick);
                                    }
                                    if (respuesta.partida.visitante) {
                                        if(respuesta.partida.visitante.tipo === 'jugador') {
                                            $('#juego .color .blancas').html("<a href='perfil/" + respuesta.partida.colores.codblanco + "'>" + respuesta.partida.visitante.nick + "</a>");
                                        } else if(respuesta.partida.visitante.tipo === 'invitado') {
                                            $('#juego .color .blancas').html(respuesta.partida.visitante.nick);
                                        }
                                    }
                                    else {
                                        $('#juego .color .blancas').html('');
                                    }
                                }
                                //muestra los espectadores//
                                if ($('#menu-lateral').is(':visible')) {
                                    $('#espectadores-partida ul').html('');
                                    for (var i = 0; i < respuesta.partida.espectadores.length; i++) {
                                        $('#espectadores-partida ul').append('<li><a href="perfil/' + respuesta.partida.espectadores[i].cod + '">' + respuesta.partida.espectadores[i].nick + '</a></li>');
                                    }
                                }

                                if (respuesta.partida.tablas === 'tablas') {
                                    estado = 'tablas';
                                    turno = '';
                                    $('.menu button[name=proponer-tablas]').html('<span>Proponer tablas</span>');
                                    $('#menu-lateral button[name=proponer-tablas]').attr('class', 'btn btn-default btn-lg');
                                    $('#menu-inferior button[name=proponer-tablas]').attr('class', 'btn btn-info btn-lg');
                                    if (!$('#menu-lateral').is(':visible')) {
                                        if ($('#juego').length > 0) {
                                            $('#juego .aviso').html('');
                                        }
                                    }
                                    $('[name=proponer-tablas]').attr('disabled', true);
                                } else if (respuesta.partida.tablas === 'propuesta') {
                                    $('.menu button[name=proponer-tablas]').html('<span>El oponente propone tablas</span>');
                                    $('.menu button[name=proponer-tablas]').attr('class', 'btn btn-warning btn-lg');
                                    if (!$('#menu-lateral').is(':visible')) {
                                        if ($('#juego').length > 0) {
                                            $('#juego .aviso').html('<span>El oponente propone tablas. Pulsa \'Proponer tablas\' abajo o sigue jugando.</span>');
                                        }
                                    }
                                    $('[name=proponer-tablas]').attr('disabled', false);
                                } else {
                                    if (respuesta.partida.tablas !== 'proponiendo') {
                                        $('.menu button[name=proponer-tablas]').html('Proponer tablas');
                                        $('#menu-lateral button[name=proponer-tablas]').attr('class', 'btn btn-default btn-lg');
                                        $('#menu-inferior button[name=proponer-tablas]').attr('class', 'btn btn-info btn-lg');
                                        if (!$('#menu-lateral').is(':visible')) {
                                            if ($('#juego').length > 0) {
                                                $('#juego .aviso').html('');
                                            }
                                        }
                                        $('[name=proponer-tablas]').attr('disabled', false);
                                    }
                                }

                                if (respuesta.partida.ganador) {
                                    estado = 'resultados';
                                    turno = '';
                                    rendicion = respuesta.partida.ganador;
                                }

                                mis_datos = respuesta.partida.mis_datos;
                                anfitrion = respuesta.partida.anfitrion;
                                visitante = respuesta.partida.visitante;
                                if (mis_datos.rol !== 'espectador') {
                                    if (mis_datos.cod == respuesta.partida.colores.codblanco) {
                                        mis_datos.color = 'blancas';
                                    } else {
                                        mis_datos.color = 'negras';
                                    }
                                } else {
                                    mis_datos.color = 'none';
                                }
                                if (anfitrion && visitante) {
                                    if (estado === 'no_jugando') {
                                        inicializaJuego();
                                        actualizaJuego();
                                        estado = 'jugando';
                                        turno = 'blancas';
                                        rendicion = '';
                                        $('[name=proponer-tablas]').attr('disabled', false);
                                        $('[name=rendirse]').attr('disabled', false);
                                    } else if (estado === 'tablas' || estado === 'resultados') {
                                        inicializaJuego();
                                        actualizaJuego();
                                        $('[name=proponer-tablas]').attr('disabled', true);
                                        $('[name=rendirse]').attr('disabled', true);
                                    }
                                }
                                else {
                                    estado = 'no_jugando';
                                    turno = '';
                                    $('[name=proponer-tablas]').attr('disabled', true);
                                    $('[name=rendirse]').attr('disabled', true);
                                }
                                // se ha actualizado la página o se ha entrado desde otro sitio //
                                if (respuesta.partida.movimientos.length > 0 && movimientos.length === 0) {
                                    var ultimo_mov = respuesta.partida.movimientos[respuesta.partida.movimientos.length - 1];
                                    hayNuevoMovimiento(respuesta.partida.movimientos);
                                    inicializaJuego();
                                    actualizaJuego();
                                    if (ultimo_mov.color === 'blancas') {
                                        if (ultimo_mov.numficha !== -1) {
                                            turno = 'negras';
                                        } else {
                                            turno = 'blancas';
                                        }
                                    } else if (ultimo_mov.color === 'negras') {
                                        if (ultimo_mov.numficha !== -1) {
                                            turno = 'blancas';
                                        } else {
                                            turno = 'negras';
                                        }
                                    }
                                }
                                else if (respuesta.partida.nuevos_movimientos) {
                                    hayNuevoMovimiento(respuesta.partida.movimientos);
                                    inicializaJuego();
                                    actualizaJuego();
                                    if (respuesta.partida.movimientos[respuesta.partida.movimientos.length - 1].numficha !== -1) {
                                        cambiaTurno();
                                    }
                                }
                            } else if(respuesta.partida.tipo === 'repeticion' && repeticion === false) {
                                $('#juego .color .blancas').html("<a href='perfil/"+respuesta.partida.colores.codblanco+"'>"+respuesta.partida.blanco+"</a>");
                                $('#juego .color .negras').html("<a href='perfil/"+respuesta.partida.colores.codnegro+"'>"+respuesta.partida.negro+"</a>");

                                mis_datos = respuesta.partida.mis_datos;
                                mis_datos.color = 'none';
                                repeticion = true;
                                rep_mov = 0;
                                rep_mov_totales = respuesta.partida.movimientos;
                                movimientos = [];

                                $('.menu button[name=atras]').attr('disabled', true);
                                $('.menu button[name=adelante]').attr('disabled', false);

                                inicializaJuego();
                                actualizaJuego();

                                estado = 'jugando';

                                $('.menu button[name=atras]').click(function(){
                                    cambioMovimiento(-1);
                                    actualizaJuego();
                                });
                                $('.menu button[name=adelante]').click(function(){
                                    cambioMovimiento(+1);
                                    actualizaJuego();
                                });
                            }
                        }
                        else { //no está en la sala de juego. Mensaje de aviso si hay nuevos movimientos.
                            if(respuesta.partida.tipo === 'sala') {
                                if (respuesta.partida.nuevos_movimientos) {
                                    $('#mensaje_aviso').show();
                                }
                            }
                        }
                    }
                    setTimeout(estaConectado, 5000); //cada 5 segundos
                }
            }
        }
    });
}