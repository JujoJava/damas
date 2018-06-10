"use strict";

$(document).ready(function(){

    function cargaSalas(data){
        $("#lista_salas table tbody").html("");
        var cadena = "";
        if(data.length > 0){
            for(var i = 0 ; i < data.length ; i++){
                cadena += "<tr id='"+data[i].codsala+"'>";
                cadena += "<td class='numsala'>"+data[i].codsala+"</td>"; //código de la sala
                if(data[i].anf_tipo === 'jugador') {
                    cadena += "<td><a href='perfil/" + data[i].codanfitrion + "'>" + data[i].anfitrion + "</a></td>"; //usuario anfitrión
                } else {
                    cadena += "<td>" + data[i].codanfitrion+"_"+data[i].anfitrion + "</td>"; //usuario anfitrión
                }
                if(data[i].visitante !== null) { //usuario visitante
                    if(data[i].vis_tipo === 'jugador') {
                        cadena += "<td><a href='perfil/" + data[i].codvisitante + "'>" + data[i].visitante + "</a></td>";
                    } else{
                        cadena += "<td>" + data[i].codvisitante+"_"+data[i].visitante + "</td>";
                    }
                } else {
                    cadena += "<td></td>";
                }
                cadena += "<td title='"+data[i].descripcion+"' class='descripcion'><div>"+data[i].descripcion+"</div></td>"; //descripción
                if(data[i].pass !== null) //tiene contraseña o no
                    cadena += "<td class='pass' title='Con contraseña'><i class='fas fa-lock'></i></td>";
                else
                    cadena += "<td class='pass' title='Sin contraseña'><i class='fas fa-lock-open'></i></td>";
                cadena += "<td class='espectadores'>"+data[i].cantespec+"</td>"; //espectadores (totales)
                // campo acciones //
                cadena += "<td class='acciones'>";
                if(data[i].visitante === null){ //si no hay un visitante, botón para jugar
                    cadena += "<button type='button' name='jugar-sala' class='btn btn-primary'>Jugar</button>";
                }
                else if(Number(data[i].puede_espectar) === 1){ //si se puede espectar, botón para ello
                    cadena += "<button type='button' name='jugar-sala' class='btn btn-info'>Ver</button>";
                }
                cadena += "</td></tr>";
            }
            $("#lista_salas table tbody").html(cadena);

            // EVENTOS //

            var elm;
            $('#lista_salas tr').click(function(e){
                if(!$(this).children('td.acciones').is(':visible')){
                    elm = $(this).children('td.acciones');
                    if (!$(e.target).is(elm.children('button'))) {
                        elm.children('button').trigger('click');
                    }
                }
            });

            //botón para jugar partida
            $('#lista_salas button[name=jugar-sala]').on('click', function(){
                var boton = $(this);
                var textoBoton = boton.html();
                var codsala = boton.parents('tr').attr('id');
                $.ajax({
                    data: {
                        modo: 'logueado'
                    },
                    type: 'POST',
                    dataType: 'json',
                    url: 'ajax/get.php',
                    success: function(response){
                        if(response.correcto){
                            window.location = 'redirect/'+codsala+'/';
                        } else {
                            botonNormal(boton, textoBoton);
                            $('#modal_entrar_sala').modal();
                            $('#modal_entrar_sala button[name=entrar-sala]').attr('id', codsala);
                        }
                    },
                    beforeSend: function(){
                        botonRueda(boton);
                    }
                });

            });

            // animación al pasar por la línea para ver la descripción completa //

            var interval_descripcion = '';
            var animacionCompletada = true;
            $('#lista_salas tbody tr').hover(
                function(){ //mousein
                    var linea = '#lista_salas tr#' + $(this).attr('id') + ' td.descripcion > div';
                    if($(linea).length > 0 && $(window).width() > 768) {
                        if ($(linea).get(0).scrollWidth - $(linea).get(0).clientWidth > 0) {
                            setTimeout(function() {
                                interval_descripcion = setInterval(function () {
                                    if (animacionCompletada === true) {
                                        animacionCompletada = false;
                                        if ($(linea).get(0).scrollLeft < $(linea).get(0).scrollLeftMax) {
                                            $(linea).animate({
                                                    'scrollLeft': '+=1px'
                                                }, 40, 'swing',
                                                function () {
                                                    animacionCompletada = true;
                                                }
                                            );
                                        }
                                        else {
                                            setTimeout(function () {
                                                $(linea).animate({
                                                        'scrollLeft': '0px'
                                                    }, 2000, 'swing',
                                                    function () {
                                                        setTimeout(function(){ animacionCompletada = true; }, 1000);
                                                    }
                                                );
                                            }, 1000);
                                        }
                                    }
                                }, 40);
                            }, 1000);
                        }
                    }
                },
                function(){ //mouseout
                    var linea = '#lista_salas tr#' + $(this).attr('id') + ' td.descripcion > div';
                    clearInterval(interval_descripcion);
                    animacionCompletada = true;
                    $(linea).animate({
                        'scrollLeft': '0px'
                    }, 1);
                }
            );

        }
        else{
            $("#lista_salas table tbody").html("<tr><td colspan='7'>No hay ninguna sala actualmente</td></tr>");
        }
    }

    if($("#lista_salas").length > 0){

        // carga de la lista de salas al abrirse la página //
        $.ajax({
            data: {
                modo : 'salas'
            },
            type: 'POST',
            dataType: 'json',
            url: 'ajax/get.php',
            success: cargaSalas,
            beforeSend: function(){
                $("#lista_salas table tbody").html("<tr><td colspan='7'><i class='fas fa-spinner fa-spin'></i></td></tr>");
            }
        });

        $("#principal button[name=actualizar-lista]").click(function(){
            var boton = $(this);
            $.ajax({
                data: {
                    modo: 'salas'
                },
                type: 'POST',
                dataType: 'json',
                url: 'ajax/get.php',
                success: function(data){
                    boton.attr('disabled', false);
                    $('#principal button[name=actualizar-lista] i').removeClass('fa-spin');
                    cargaSalas(data);
                },
                beforeSend: function(){
                    boton.attr('disabled', true);
                    $("#principal button[name=actualizar-lista] i").addClass('fa-spin');
                }
            })
        });

    }

    if ($('#redirect').length > 0) {
        $('#menu-lateral').hide();
        $('#modal_inv_red').modal({backdrop: 'static', keyboard: false});
        $.ajax({
            data: {
                modo: 'redirect'
            },
            type: 'POST',
            dataType: 'json',
            url: 'ajax/get.php',
            success: function(data){
                if(data.correcto) {
                    window.location = 'juego';
                } else {
                    if(data.accion === 'login') {
                        $('#modal_inv_red .modal-body i.fa-spinner').hide(300, function () {
                            $('#modal_inv_red .conf-invitado').show(300);
                            $('#modal_inv_red .modal-footer').show(300);
                        });
                    } else if(data.accion === 'mismasala') {
                        window.location = 'juego';
                    } else if(data.accion === 'solicita_pass') {
                        $('#modal_inv_red .modal-body i.fa-spinner').hide(300, function() {
                            $('#modal_inv_red .pass-sala').show(300);
                            $('#modal_inv_red .modal-footer').show(300);
                        });
                    } else {
                        window.location = 'principal';
                    }
                }
            },
            beforeSend: function(){
                $('#modal_inv_red .modal-body').append("<i class='fas fa-spinner fa-spin'></i>");
            }
        });
    }

    if($('#ranking').length > 0){
        $.ajax({
            data: {modo:'ranking'},
            type: 'POST',
            dataType: 'json',
            url: 'ajax/get.php',
            success: function(response){
                if(response.ranking.length > 0) {
                    var cadena = '';
                    for (var i = 0; i < response.ranking.length; i++) {
                        cadena += "<tr id='usuario-"+response.ranking[i].codusu+"'>";
                        cadena += "<td class='posicion'><span>#"+(i+1)+"</span></td>";
                        cadena += "<td class='jugador'><a href='perfil/"+response.ranking[i].codusu+"'>"+response.ranking[i].nick+"</a></td>";
                        cadena += "<td class='puntos'><span>"+response.ranking[i].puntos+"</span></td>";
                        cadena += "<td class='totales'><span>"+response.ranking[i].puntuaciones.total+"</span></td>";
                        cadena += "<td class='victorias'><span>"+response.ranking[i].puntuaciones.victorias+"</span></td>";
                        cadena += "<td class='derrotas'><span>"+response.ranking[i].puntuaciones.derrotas+"</span></td>";
                        cadena += "<td class='tablas'><span>"+response.ranking[i].puntuaciones.tablas+"</span></td>";
                        cadena += "<td class='estado conexion-"+response.ranking[i].conectado+"'>";
                        switch(response.ranking[i].conectado){
                            case 0:
                                cadena += "<span>Desconectado</span>";
                                break;
                            case 1:
                                cadena += "<span>Conectado</span>";
                                break;
                            case 2:
                                cadena += "<a class='"+response.ranking[i].codsala+"' name='jugar-sala' title='Entrar'>Jugando</a>";
                                break;
                            case 3:
                                cadena += "<a class='"+response.ranking[i].codsala+"' name='jugar-sala' title='Entrar'>Viendo una partida</a>";
                                break;
                        }
                        cadena += "</td></tr>";
                    }
                    $('#ranking table tbody').html(cadena);
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
                } else {
                    $('#ranking table tbody').html('<tr><td colspan="8">No hay jugadores</td></tr>');
                }
            },
            beforeSend: function(){
                $('#ranking table tbody').html('<tr><td colspan="8"><i class="fas fa-spinner fa-spin"></i></td></tr>');
            }
        });
    }

    if($('#perfil').length > 0){
        $.ajax({
            data: { modo: 'perfil' },
            type: 'POST',
            dataType: 'json',
            url: 'ajax/get.php',
            success: function(response){
                if(response !== false){
                    $('#perfil .titulo').html('Perfil de '+response.nick);
                    $('#perfil .estado').attr("class", "estado conexion-"+response.conectado);
                    switch(response.conectado){
                        case 0:
                            $('#perfil .estado').html("Desconectado");
                            break;
                        case 1:
                            $('#perfil .estado').html("Conectado");
                            break;
                        case 2:
                            $('#perfil .estado').html("<a class='"+response.codsala+"' name='jugar-sala' title='Entrar'>Jugando</a>");
                            break;
                        case 3:
                            $('#perfil .estado').html("<a class='"+response.codsala+"' name='jugar-sala' title='Entrar'>Viendo una partida</a>");
                            break;
                    }
                    if(response.ranking) {
                        $('#perfil .posicion-ranking').html("<span>#" + response.ranking.posicion + " en el ranking</span>");
                    }
                    $('#perfil .partidas-jugadas').html("<span>"+response.puntuaciones.total+" partidas jugadas</span>");
                    $('#perfil .partidas-ganadas').html("<span>"+response.puntuaciones.victorias+" partidas ganadas</span>");
                    $('#perfil .partidas-perdidas').html("<span>"+response.puntuaciones.derrotas+" partidas perdidas</span>");
                    $('#perfil .partidas-tablas').html("<span>"+response.puntuaciones.tablas+" partidas en tablas</span>");
                    if(response.miperfil) {
                        $('#perfil .seccion-amistad').html("<h3>Lista de amigos</h3><div class='lista-amigos'></div>");
                    } else {
                        if(response.amistad) {
                            if (response.amistad === 'none') {
                                $('#perfil .seccion-amistad').html("<button id='" + response.codusu + "' class='btn btn-primary btn-md' name='agregar-amigo'>Agregar amigo</button>");
                            } else if (response.amistad === 'solicitado') {
                                $('#perfil .seccion-amistad').html("<button id='" + response.codusu + "' class='btn btn-info btn-md' name='agregar-amigo' disabled='disabled'>Solicitud de amistad enviada</button>");
                            } else if (response.amistad === 'solicitud') {
                                $('#perfil .seccion-amistad').html("<button id='" + response.codusu + "' class='btn btn-warning btn-md' name='agregar-amigo'>Aceptar solicitud de amistad</button>");
                            } else if (response.amistad === 'amigo') {
                                $('#perfil .-seccion-amistad').html("<button id='" + response.codusu + "' class='btn btn-danger btn-md' name='agregar-amigo'>Borrar amigo</button>");
                            }
                        }
                    }

                    $('#perfil button[name=agregar-amigo]').click(function(){
                        var boton = $(this);
                        var texto_anterior = boton.html();
                        $.ajax({
                            data:{
                                modo : 'amistad',
                                codusu : $(this).attr('id')
                            },
                            type: 'POST',
                            dataType: 'json',
                            url: 'ajax/insert.php',
                            success: function(response){
                                if(response.correcto){
                                    botonNormal(boton, response.texto_boton);
                                    boton.attr('class', response.tipo_boton);
                                    if(response.texto_boton === 'Solicitud de amistad enviada'){
                                        boton.attr('disabled', true);
                                    } else {
                                        boton.attr('disabled', false);
                                    }
                                } else {
                                    botonNormal(boton, texto_anterior);
                                }
                            },
                            beforeSend: function(){
                                botonRueda(boton);
                            }
                        })
                    });

                } else {
                    window.location = 'principal';
                }

                //botón para jugar partida
                $('#perfil .estado a[name=jugar-sala]').on('click', function(){
                    var boton = $(this);
                    if(!boton.hasClass('desactivado')) {
                        var codsala = boton.attr('class');
                        boton.addClass('desactivado');
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
                                }
                            },
                            beforeSend: function () {
                                botonRueda(boton);
                            }
                        });
                    }
                });

            }
        });
        $.ajax({
            data: { modo: 'repeticiones' },
            type: 'POST',
            dataType: 'json',
            url: 'ajax/get.php',
            success: function(data){
                var cadena;
                cadena = '';
                for(var i = 0 ; i < data.repeticiones.length ; i++){
                    if(data.repeticiones[i].ganador !== '') {
                        cadena += "<tr>";
                        if (data.repeticiones[i].bla_tipo === 'jugador') {
                            cadena += "<td><a href='perfil/" + data.repeticiones[i].codblanco + "'>" + data.repeticiones[i].nickblanco + "</a></td>";
                        } else {
                            cadena += "<td>" + data.repeticiones[i].codblanco+"_"+data.repeticiones[i].nickblanco + "</td>";
                        }
                        if (data.repeticiones[i].neg_tipo === 'jugador') {
                            cadena += "<td><a href='perfil/" + data.repeticiones[i].codnegro + "'>" + data.repeticiones[i].nicknegro + "</a></td>";
                        } else {
                            cadena += "<td>" + data.repeticiones[i].codnegro+"_"+data.repeticiones[i].nicknegro + "</td>";
                        }
                        if (data.repeticiones[i].ganador === 'tablas') {
                            cadena += "<td>Tablas</td>";
                        } else {
                            cadena += "<td>Ganan " + data.repeticiones[i].ganador + "</td>";
                        }
                        cadena += "<td><a class='ver_repeticion' id='" + data.repeticiones[i].codpartida + "'>Ver</a>";
                        if (data.miperfil) {
                            cadena += "<br><select name='privacidad' class='" + data.repeticiones[i].codpartida + "'>";
                            if(data.repeticiones[i].mi_privacidad == 1) {
                                cadena += "<option selected value='1'>Público</option>";
                                cadena += "<option value='0'>Privado</option>";
                            } else {
                                cadena += "<option value='1'>Público</option>";
                                cadena += "<option selected value='0'>Privado</option>";
                            }
                            cadena += "</select>";
                        }
                        cadena += "</td></tr>";
                    }
                }
                if(cadena !== '') {
                    $('#perfil #repeticiones tbody').html(cadena);
                } else {
                    $('#perfil #repeticiones tbody').html("<tr><td colspan='4'>No hay repeticiones</td></tr>");
                }
                $('#perfil .ver_repeticion').click(function(){
                    var pulsado = $(this);
                    if(!pulsado.hasClass('desactivado')) {
                        $.ajax({
                            data: {
                                partida: pulsado.attr('id'),
                                modo: 'repeticion'
                            },
                            type: 'POST',
                            dataType: 'json',
                            url: 'ajax/get.php',
                            success: function (response) {
                                if(response.correcto) {
                                    window.location = 'juego';
                                } else {
                                    $('a.ver-repeticion').removeClass('desactivado');
                                    botonNormal(pulsado, 'Ver');
                                }
                            },
                            beforeSend: function () {
                                $('a.ver-repeticion').addClass('desactivado');
                                botonRueda(pulsado);
                            }
                        });
                    }
                });

                $('table#repeticiones select[name=privacidad]').change(function(){
                    $.ajax({
                        data: {
                            modo: 'privacidad',
                            privacidad: $(this).val(),
                            codpartida: $(this).attr('class')
                        },
                        type: 'POST',
                        dataType: 'json',
                        url: 'ajax/insert.php'
                    })
                });
            },
            beforeSend: function(){
                $('table#repeticiones tbody').html('<tr><td colspan="4"><i class="fas fa-spinner fa-spin"></i></td></tr>');
            }
        });
    }

});