"use strict";

$(document).ready(function(){

    function cargaSalas(data){
        $("#lista_salas table tbody").html("");
        var cadena = "";
        if(data.length > 0){
            for(var i = 0 ; i < data.length ; i++){
                cadena += "<tr id='"+data[i].codsala+"'>";
                cadena += "<td class='numsala'>"+data[i].codsala+"</td>"; //código de la sala
                cadena += "<td>"+data[i].anfitrion+"</td>"; //usuario anfitrión
                if(data[i].visitante !== null) //usuario visitante
                    cadena += "<td>" + data[i].visitante + "</td>";
                else
                    cadena += "<td></td>";
                cadena += "<td title='"+data[i].descripcion+"' class='descripcion'><div>"+data[i].descripcion+"</div></td>"; //descripción
                if(data[i].pass !== null) //tiene contraseña o no
                    cadena += "<td class='pass' title='Con contraseña'><i class='fas fa-lock'></i></td>";
                else
                    cadena += "<td class='pass' title='Sin contraseña'><i class='fas fa-lock-open'></i></td>";
                cadena += "<td class='espectadores'>"+data[i].cantespec+"</td>"; //espectadores (totales)
                // campo acciones //
                cadena += "<td class='acciones'>";
                if(data[i].visitante === null){ //si no hay un visitante, botón para jugar
                    cadena += "<button type='button' class='btn btn-secondary'>Jugar</button>";
                }
                if(Number(data[i].puede_espectar) === 1){ //si se puede espectar, botón para ello
                    cadena += "<button type='button' class='btn btn-info'>Espectar</button>";
                }
                cadena += "</td></tr>";
            }
            $("#lista_salas table tbody").html(cadena);

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
                beforeSend: function(e){
                    console.log(e);
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
                modo: 'redirect',
                tipo: 'visitante'
            },
            type: 'POST',
            dataType: 'json',
            url: 'ajax/get.php',
            success: function(data){
                console.log(data);
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

});