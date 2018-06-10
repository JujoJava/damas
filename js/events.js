$(document).ready(function(){

    var ajaxModal = null;

    // evento para copiar un texto //
    $('[name=copiar]').click(function(){
        $(this).siblings('input').get(0).select();
        document.execCommand("Copy");
    });

    //reiniciar elementos del modal al abrir y cerrarlo
    $('.modal').on('hidden.bs.modal', function(){
        if(ajaxModal !== null){
            ajaxModal.abort();
            botonNormal('.modal button[name=crear-partida]', 'Crear');
            botonNormal('.modal button[name=iniciar-sesion]', 'Iniciar sesión');
            botonNormal('.modal button[name=registro-usuario]', 'Registrar');
            ajaxModal = null;
        }
        $('#modal_entrar_sala input[type=text]').val('');
        $('#modal_inv_red input[type=text]').val('');
        $('#modal_jugar_nueva input[type=text]').val('');
        $('#modal_login input[type=text]').val('');
        $('.modal input[type=password]').val('');
        $('.modal input').attr('disabled', false);
        $('.modal button.btn-primary').attr('disabled', true);
        $('.modal button[name=iniciar-sesion]').attr('disabled', false);
        ocultarErrores();
    });
    $('.modal').on('show.bs.modal', function(){
        if(ajaxModal !== null){
            ajaxModal.abort();
            botonNormal('.modal button[name=crear-partida]', 'Crear');
            botonNormal('.modal button[name=iniciar-sesion]', 'Iniciar sesión');
            botonNormal('.modal button[name=registro-usuario]', 'Registrar');
            ajaxModal = null;
        }
        $('#modal_entrar_sala input[type=text]').val('');
        $('#modal_inv_red input[type=text]').val('');
        $('#modal_jugar_nueva input[type=text]').val('');
        $('#modal_login input[type=text]').val('');
        $('.modal input[type=password]').val('');
        $('.modal input').attr('disabled', false);
        $('.modal button.btn-primary').attr('disabled', true);
        $('.modal button[name=iniciar-sesion]').attr('disabled', false);
        ocultarErrores();
    });

    $('#modal_registro').on('show.bs.modal', function(){
        $('#modal_registro input[name=nomUsu]').trigger('keyup');
    });

    $('#menu-lateral button[name=ver-repeticiones]').click(function(){
        $('#menu-lateral #lista-repeticiones').toggle(200);

    });
    $('#menu-lateral button[name=ver-lista-amigos]').click(function(){
        $('#menu-lateral #lista-amigos').toggle(200);
    });

    $('#menu-lateral #lista-repeticiones .ver_repeticion').click(function(){
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
                        $('a.ver_repeticion').removeClass('desactivado');
                        botonNormal(pulsado, 'Ver');
                    }
                },
                beforeSend: function (a) {
                    console.log(a);
                    console.log($('a.ver_repeticion'))
                    $('a.ver-repeticion').addClass('desactivado');
                    botonRueda(pulsado);
                }
            });
        }
    });

    // Eventos del modal //

    // control de la descripción al escribirla //
    $('#modal_jugar_nueva input[name=descripcion]').keyup(function(){
        if ($(this).val() !== '') {
            if ($(this).val().length <= 50) {
                ocultarError($(this));
                $('#modal_jugar_nueva button[name=crear-partida]').attr('disabled', false); //correcto
            }
            else {
                mostrarError($(this), '¡La descripción es demasiado larga!');
                $('#modal_jugar_nueva button[name=crear-partida]').attr('disabled', true);
            }
        } else {
            ocultarError($(this));
            $('#modal_jugar_nueva button[name=crear-partida]').attr('disabled', true);
        }
    });

    // control de la contraseña al escribirla //
    $('#modal_jugar_nueva input[name=pass_sala]').keyup(function(){
        if ($(this).val().length <= 250) {
            ocultarError($(this));
            if(!existeError($('#modal_jugar_nueva input[name=descripcion]'))
            && $('#modal_jugar_nueva input[name=descripcion]').val() !== '') {
                $('#modal_jugar_nueva button[name=crear-partida]').attr('disabled', false); //correcto
            }
        }
        else {
            mostrarError($(this), '¡La contraseña es demasiado larga!');
            $('#modal_jugar_nueva button[name=crear-partida]').attr('disabled', true);
        }
    });

    //activar o desactivar el botón de jugar según lo escrito en el input
    $('#modal_jugar_nueva input[name=nomUsuInvi]').keyup(function(){
        if($(this).val() !== ''){
            if($(this).val().length <= 16) {
                ocultarError($(this));
                $('#modal_jugar_nueva button[name=crear-partida]').attr('disabled', false); //correcto
            }
            else{
                mostrarError($(this), '¡El nick es demasiado largo!');
                $('#modal_jugar_nueva button[name=crear-partida]').attr('disabled', true);
            }
        } else{
            ocultarError($(this));
            $('#modal_jugar_nueva button[name=crear-partida]').attr('disabled', true);
        }
    });

    //activar o desactivar el botón de entrar en sala según lo escrito en el input
    $('#modal_entrar_sala input[name=nomUsuInvi]').keyup(function(){
        if($(this).val() !== ''){
            if($(this).val().length <= 16) {
                ocultarError($(this));
                $('#modal_entrar_sala button[name=entrar-sala]').attr('disabled', false); //correcto
            }
            else{
                mostrarError($(this), '¡El nick es demasiado largo!');
                $('#modal_entrar_sala button[name=entrar-sala]').attr('disabled', true);
            }
        } else{
            ocultarError($(this));
            $('#modal_entrar_sala button[name=entrar-sala]').attr('disabled', true);
        }
    });

    //activar o desactivar el botón de registro según lo escrito en los inputs
    var nomUsuCorrecto = false;
    var passUsuCorrecto = false;
    //nick
    $('#modal_registro input[name=nomUsu]').on('keyup', function(){
        if($(this).val() !== '') {
            if($(this).val().length <= 16) {
                nomUsuCorrecto = true;
                ocultarError($(this));
                if(passUsuCorrecto) {
                    $('#modal_registro button[name=registro-usuario]').attr('disabled', false); //correcto
                }
            }
            else{
                nomUsuCorrecto = false;
                mostrarError($(this), '¡El nick es demasiado largo!');
                $('#modal_registro button[name=registro-usuario]').attr('disabled', true);
            }
        } else{
            nomUsuCorrecto = false;
            ocultarError($(this));
            $('#modal_registro button[name=registro-usuario]').attr('disabled', true);
        }
    });
    //pass
    $('#modal_registro input[name=passUsu]').keyup(function(){
        if($(this).val() !== '') {
            if($(this).val().length <= 250) {
                passUsuCorrecto = true;
                ocultarError($(this));
                if(nomUsuCorrecto) {
                    $('#modal_registro button[name=registro-usuario]').attr('disabled', false); //correcto
                }
            }
            else{
                passUsuCorrecto = false;
                mostrarError($(this), '¡La contraseña es demasiado larga!');
                $('#modal_registro button[name=registro-usuario]').attr('disabled', true);
            }
        } else{
            passUsuCorrecto = false;
            ocultarError($(this));
            $('#modal_registro button[name=registro-usuario]').attr('disabled', true);
        }
    });

    //al pulsar el botón para registrar el usuario
    $('#modal_registro button[name=registro-usuario]').click(function(){
        var boton = $(this);
        var input_nombre = $('#modal_registro input[name=nomUsu]');
        var input_pass = $('#modal_registro input[name=passUsu]');
        if(input_nombre.val() !== ''){
            if(input_nombre.val().length <= 16){
                if(input_pass.val() !== ''){
                    if(input_pass.val().length <= 250){

                        ajaxModal = $.ajax({
                            data: {
                                nick: input_nombre.val(),
                                pass: input_pass.val(),
                                modo: 'registro'
                            },
                            type: 'POST',
                            dataType: 'json',
                            url: 'ajax/insert.php',
                            success: function(response){
                                botonNormal(boton, 'Registrar');
                                if (response.correcto === false) {
                                    input_nombre.attr('disabled', false);
                                    input_pass.attr('disabled', false);
                                    mostrarError(input_nombre, response.error.error_nombre);
                                    mostrarError(input_pass, response.error.error_pass);
                                }
                                else { //usuario registrado
                                    location.reload();
                                }
                            },
                            beforeSend: function(){
                                botonRueda(boton);
                                input_nombre.attr('disabled', true);
                                input_pass.attr('disabled', true);
                            }
                        });

                    } else {
                        mostrarError(input_pass, '¡La contraseña es demasiado larga!');
                        $('#modal_registro button[name=registro-usuario]').attr('disabled', true);
                    }
                } else {
                    mostrarError(input_pass, '¡La contraseña está vacía!');
                    $('#modal_registro button[name=registro-usuario]').attr('disabled', true);
                }
            } else {
                mostrarError(input_nombre, '¡El nick es demasiado largo!');
                $('#modal_registro button[name=registro-usuario]').attr('disabled', true);
            }
        } else {
            mostrarError(input_nombre, '¡El nick está vacío!');
            $('#modal_registro button[name=registro-usuario]').attr('disabled', true);
        }
    });

    //al pulsar el botón de iniciar sesión
    $('#modal_login button[name=iniciar-sesion]').click(function(){
        var boton = $(this);
        var input_nombre = $('#modal_login input[name=nomUsu]');
        var input_pass = $('#modal_login input[name=passUsu]');

        ajaxModal = $.ajax({
            data: {
                nick: input_nombre.val(),
                pass: input_pass.val(),
                modo: 'login'
            },
            type: 'POST',
            dataType: 'json',
            url: 'ajax/get.php',
            success: function(response){
                if(response.correcto){
                    location.reload();
                } else {
                    botonNormal(boton, 'Iniciar sesión');
                    input_nombre.attr('disabled', false);
                    input_pass.attr('disabled', false);
                    mostrarError(boton, response.error);
                }
            },
            beforeSend: function(){
                botonRueda(boton);
                input_nombre.attr('disabled', true);
                input_pass.attr('disabled', true);
            }
        });

    });

    //al pulsar el botón del modal de cerrar sesión
    $('#menu-superior a[name=logout]').click(function(){
        $('#modal_logout').modal({backdrop:'static', keyboard:false});
        $.ajax({
            data: {modo:'logout'},
            type: 'POST',
            dataType: 'json',
            url: 'ajax/delete.php',
            success: function(){
                window.location.reload();
            },
            beforeSend: function(){
                $('#modal_logout .modal-body .info').html("<i class='fas fa-spinner fa-spin'></i>");
            }
        });
    });

    //al pulsar el botón del modal de entrar en sala
    $('#modal_entrar_sala button[name=entrar-sala]').click(function() {
        // crear invitado
        var boton = $(this);
        var input_nombre = $('#modal_entrar_sala input[name=nomUsuInvi]');
        if (input_nombre.val() !== '') {
            if (input_nombre.val().length <= 16) {

                ajaxModal = $.ajax({
                    data: {
                        nick: input_nombre.val(),
                        modo: 'usuario_invitado'
                    },
                    type: 'POST',
                    dataType: 'json',
                    url: 'ajax/insert.php',
                    success: function (response) {
                        botonNormal(boton, 'Crear');
                        if (response.correcto === false) {
                            input_nombre.attr('disabled', false);
                            mostrarError(input_nombre, response.error);
                        }
                        else { //usuario invitado registrado
                            window.location = 'redirect/' + boton.attr('id') + '/';
                        }
                    },
                    beforeSend: function () {
                        botonRueda(boton);
                        input_nombre.attr('disabled', true);
                    }
                });

            } else {
                mostrarError(input_nombre, '¡El nick es demasiado largo!');
                $('#modal_jugar_nueva button[name=crear-partida]').attr('disabled', true);
            }
        } else {
            mostrarError(input_nombre, '¡El campo está vacío!');
            $('#modal_jugar_nueva button[name=crear-partida]').attr('disabled', true);
        }
    });
    //al pulsar el botón de crear partida
    $('#modal_jugar_nueva button[name=crear-partida]').click(function(){
        // crear invitado
        var boton = $(this);
        if($('#modal_jugar_nueva input[name=nomUsuInvi]').is(':visible')){
            var input_nombre = $('#modal_jugar_nueva input[name=nomUsuInvi]');
            if(input_nombre.val() !== ''){
                if(input_nombre.val().length <= 16) {

                    ajaxModal = $.ajax({
                        data: {
                            nick: input_nombre.val(),
                            modo: 'usuario_invitado'
                        },
                        type: 'POST',
                        dataType: 'json',
                        url: 'ajax/insert.php',
                        success: function (response) {
                            botonNormal(boton, 'Crear');
                            if (response.correcto === false) {
                                input_nombre.attr('disabled', false);
                                mostrarError(input_nombre, response.error);
                            }
                            else { //usuario invitado registrado
                                $('#menu-superior li.mostrar-invitado').html(response.codusu + "_" + input_nombre.val());
                                $('#modal_jugar_nueva .conf-invitado').hide(300, function(){
                                    $('#modal_jugar_nueva .conf-partida').show(300);
                                    $('.mostrar-invitado').show(300);
                                    $('#modal_jugar_nueva button[name=crear-partida]').attr('disabled', true);
                                    estaConectado(); //conexion.js
                                });
                            }
                        },
                        beforeSend: function () {
                            botonRueda(boton);
                            input_nombre.attr('disabled', true);
                        }
                    });

                } else {
                    mostrarError(input_nombre, '¡El nick es demasiado largo!');
                    $('#modal_jugar_nueva button[name=crear-partida]').attr('disabled', true);
                }
            } else {
                mostrarError(input_nombre, '¡El campo está vacío!');
                $('#modal_jugar_nueva button[name=crear-partida]').attr('disabled', true);
            }
        }
        // para crear partida
        else {
            $('#modal_jugar_nueva input[name=descripcion]').keyup();
            $('#modal_jugar_nueva input[name=pass_sala]').keyup();
            if (!$('#modal_jugar_nueva button[name=crear-partida]').is(':disabled')) {
                var input_descripcion = $('#modal_jugar_nueva input[name=descripcion]');
                var input_pass = $('#modal_jugar_nueva input[name=pass_sala]');
                var input_espectar = $('#modal_jugar_nueva input[name=puede_espectar]');
                var input_color = $('#modal_jugar_nueva input[name=color-fichas]:checked');

                input_descripcion.attr('disabled', true);
                input_pass.attr('disabled', true);
                input_espectar.attr('disabled', true);
                $('#modal_jugar_nueva input[name=color-fichas]').attr('disabled', true);

                var puede_espectar = 0;
                if(input_espectar.is(':checked')){
                    puede_espectar = 1;
                }

                ajaxModal = $.ajax({
                    data : {
                        descripcion: input_descripcion.val(),
                        pass: input_pass.val(),
                        puede_espectar: puede_espectar,
                        color_anfit: input_color.attr('id'),
                        modo: 'crea_sala'
                    },
                    type: 'POST',
                    dataType: 'json',
                    url: 'ajax/insert.php',
                    success: function(resul){
                        if (resul.correcto) {
                            window.location = 'juego';
                        } else {
                            botonNormal(boton, 'Crear');
                            mostrarError(boton, resul.error);
                        }
                    },
                    beforeSend: function(){
                        botonRueda(boton);
                        input_descripcion.attr('disabled', false);
                        input_pass.attr('disabled', false);
                        input_espectar.attr('disabled', false);
                        $('#modal_jugar_nueva input[name=color-fichas]').attr('disabled', false);
                    }
                });
            }
        }
    });

    if ($('#redirect').length > 0) {

        //activar o desactivar el botón de jugar según lo escrito en el input
        $('#modal_inv_red input[name=nomUsuInvi]').keyup(function(){
            if($(this).val() !== ''){
                if($(this).val().length <= 16) {
                    ocultarError($(this));
                    $('#modal_inv_red button[name=red-partida]').attr('disabled', false); //correcto
                }
                else{
                    mostrarError($(this), '¡El nick es demasiado largo!');
                    $('#modal_inv_red button[name=red-partida]').attr('disabled', true);
                }
            } else{
                ocultarError($(this));
                $('#modal_inv_red button[name=red-partida]').attr('disabled', true);
            }
        });
        //activar o desactivar el botón de jugar según lo escrito en el input
        $('#modal_inv_red input[name=passSala]').keyup(function(){
            if($(this).val() !== ''){
                ocultarError($(this));
                $('#modal_inv_red button[name=red-partida]').attr('disabled', false); //correcto
            } else{
                ocultarError($(this));
                $('#modal_inv_red button[name=red-partida]').attr('disabled', true);
            }
        });
        $('#modal_inv_red button[name=red-partida]').click(function () {
            var boton = $(this);
            var input_nombre = $('#modal_inv_red input[name=nomUsuInvi]');
            if (input_nombre.val() !== '') {
                if (input_nombre.val().length <= 16) {

                    ajaxModal = $.ajax({
                        data: {
                            nick: input_nombre.val(),
                            modo: 'usuario_invitado'
                        },
                        type: 'POST',
                        dataType: 'json',
                        url: 'ajax/insert.php',
                        success: function (response) {
                            if (response.correcto === false) {
                                input_nombre.attr('disabled', false);
                                botonNormal(boton, 'Entrar');
                                mostrarError(input_nombre, response.error);
                            }
                            else { //usuario invitado registrado
                                window.location.reload();
                            }
                        },
                        beforeSend: function () {
                            botonRueda(boton);
                            input_nombre.attr('disabled', true);
                        }
                    });

                } else {
                    mostrarError(input_nombre, '¡El nick es demasiado largo!');
                    boton.attr('disabled', true);
                }
            } else {
                mostrarError(input_nombre, '¡El campo está vacío!');
                boton.attr('disabled', true);
            }
        });
        $('#modal_inv_red button[name=red-partida]').click(function () {
            var boton = $(this);
            var input_pass = $('#modal_inv_red input[name=passSala]');
            if (input_pass.val() !== '') {

                ajaxModal = $.ajax({
                    data: {
                        pass: input_pass.val(),
                        modo: 'pass-sala'
                    },
                    type: 'POST',
                    dataType: 'json',
                    url: 'ajax/get.php',
                    success: function (response) {
                        if (response.correcto === false) {
                            input_pass.attr('disabled', false);
                            botonNormal(boton, 'Entrar');
                            mostrarError(input_pass, response.error);
                        }
                        else { //contraseña correcta
                            window.location.reload();
                        }
                    },
                    beforeSend: function () {
                        botonRueda(boton);
                        input_pass.attr('disabled', true);
                    }
                });

            } else {
                mostrarError(input_pass, '¡El campo está vacío!');
                boton.attr('disabled', true);
            }
        });

    } else if($('#juego').length > 0) {

        $('.menu button[name=salir-partida]').click(function(){

            var boton = $(this);

            $.ajax({
                data: {modo: 'partida'},
                type: 'POST',
                dataType: 'json',
                url: 'ajax/delete.php',
                success: function(response){
                    if(response.correcto){
                        window.location = 'principal';
                    }
                    else{
                        botonNormal(boton, 'Salir de partida');
                    }
                },
                beforeSend: function(){
                    botonRueda(boton);
                }
            });

        });

        $('.menu button[name=proponer-tablas]').click(function(){

            var boton = $(this);

            $.ajax({
                data: {modo: 'tablas'},
                type: 'POST',
                dataType: 'json',
                url: 'ajax/insert.php',
                success: function(response){
                    if(response.correcto){
                        botonNormalDisabled(boton, 'Proponiendo tablas...');
                    } else {
                        botonNormal(boton, 'Proponer tablas');
                    }
                },
                beforeSend: function(){
                    botonRueda(boton);
                }
            })

        });

        $('.menu button[name=rendirse]').click(function(){
            var boton = $(this);

            $.ajax({
                data: {
                    ganador: 'rendicion',
                    modo: 'resultados'
                },
                type: 'POST',
                dataType: 'json',
                url: 'ajax/insert.php',
                success: function(response){
                    botonNormal(boton, 'Rendirse');
                    if(response.correcto){
                        boton.attr('disabled', true);
                        $('.menu button[name=proponer-tablas]').attr('disabled', true);
                    }
                },
                beforeSend: function(){
                    botonRueda(boton);
                }
            });

        });

    }

});