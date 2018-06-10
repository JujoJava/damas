// constantes //

var TAM_CUADROS = 0;
var NUM_CASILLAS = 8;
var TAM_TABLERO = 0;

var NEGRO = "#3c3c3c";
var BLANCO = "#a1a1a1";

var FICHA_NEGRA = new Image();
FICHA_NEGRA.src = "img/ficha_negra.png";
var FICHA_BLANCA = new Image();
FICHA_BLANCA.src = "img/ficha_blanca.png";
var FICHA_SELECT = new Image();
FICHA_SELECT.src = "img/ficha_select.png";
var FICHA_COMIDA = new Image();
FICHA_COMIDA.src = "img/ficha_comida.png";
var FICHA_MOV = new Image();
FICHA_MOV.src = "img/ficha_mov.png";
var CUADRO_SELECT = new Image();
CUADRO_SELECT.src = "img/cuadro_select.png";
var DAMA_NEGRA = new Image();
DAMA_NEGRA.src = "img/dama_negra.png";
var DAMA_BLANCA = new Image();
DAMA_BLANCA.src = "img/dama_blanca.png";

// variables //
var estado = 'no_jugando';
var fichas = []; //array con las posiciones de las fichas
var fichas_ant = []; //array con las posiciones de las fichas con un movimiento previo
var movimientos = []; //array de objetos
var casillas = []; //diccionario de las casillas y sus posiciones reales en el cliente
var canvas;
var ctx;
var mis_datos = null; //objeto con mis datos
var anfitrion = false;
var visitante = false;
var repeticion = false;
var rep_mov = -1;
var rep_mov_totales = [];
var turno = '';
var rendicion = '';

var posibles_movimientos = []; //array con los posibles movimientos de una ficha seleccionada
var ficha_seleccionada = false;
var raton_down = false;
var cuadro_hover = false;
var mousePos = {};
var touch_activado = false;
var mostrar_hover_touch = -1;
var mov_hover_touch = null;
var num_comidas_ult_mov = 0;
var puede_castigar = false;

var fichas_blancas = 12;
var fichas_negras = 12;

function cambioMovimiento(pos){
    var mov_estado = [];
    var i = 0;
    if(pos === -1){ //atras
        if(rep_mov > 0) {
            rep_mov--;
            for(i = 0 ; i < rep_mov ; i++){
                mov_estado.push(rep_mov_totales[i]);
            }
            hayNuevoMovimiento(mov_estado);
        } else if(rep_mov === 0){
            movimientos = [];
        }
    } else if(pos === +1) { //adelante
        if(rep_mov < rep_mov_totales.length){
            rep_mov++;
            for(i = 0 ; i < rep_mov ; i++){
                mov_estado.push(rep_mov_totales[i]);
            }
            hayNuevoMovimiento(mov_estado);
        }
    }
    if(rep_mov === 0){
        $('.menu button[name=atras]').attr('disabled', true);
        $('.menu button[name=adelante]').attr('disabled', false);
    } else if(rep_mov === rep_mov_totales.length){
        $('.menu button[name=atras]').attr('disabled', false);
        $('.menu button[name=adelante]').attr('disabled', true);
    } else {
        $('.menu button[name=atras]').attr('disabled', false);
        $('.menu button[name=adelante]').attr('disabled', false);
    }

    if(rep_mov !== -1){
        $('.menu span.num-mov').html(rep_mov);
    } else {
        $('.menu span.num-mov').html('');
    }
}

function miTurno(){
    if(mis_datos.rol !== 'espectador'){
        if(mis_datos.color === turno){
            return true;
        }
    }
    return false;
}

function defineCasillas(){
    for(var i = 0 ; i < NUM_CASILLAS ; i++){
        for(var j = 0 ; j < NUM_CASILLAS ; j++){
            casillas.push({
                casilla: generaPosicion(i,j),
                x: (i*TAM_CUADROS),
                y: (j*TAM_CUADROS),
                w: (i*TAM_CUADROS) + TAM_CUADROS,
                h: (j*TAM_CUADROS) + TAM_CUADROS
            });
        }
    }
}

function obtieneCasilla(alto, ancho){
    var casilla_sel = null;
    for(var i = 0 ; i < casillas.length ; i++){
        if(casillas[i].y <= alto && casillas[i].x <= ancho &&
        casillas[i].h >= alto && casillas[i].w >= ancho){
            casilla_sel = casillas[i].casilla;
        }
    }
    return casilla_sel;
}

function getMousePos(canvas, evt) {
    var rect = canvas[0].getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function castigaFicha(movimiento){
    var mov = {
        comidas:[ficha_seleccionada],
        movimiento:movimiento
    };
    addMovimiento([ficha_seleccionada], movimiento, espacioVacio(ficha_seleccionada.posicion));
    ajaxMovimiento(mov, espacioVacio(ficha_seleccionada.posicion));
}
function compruebaCastigoFicha(){
    for(var i = 0 ; i < posibles_movimientos.length ; i++){
        if(posibles_movimientos[i].comidas.length > num_comidas_ult_mov){
            if(puede_castigar){
                castigaFicha(posibles_movimientos[i].movimiento);
                puede_castigar = false;
            }
        }
    }
}
function devuelveDatosFicha(ficha){
    if(ficha) {
        return {
            numFicha: ficha.numFicha,
            posicion: ficha.posicion,
            color: ficha.color,
            tipo: ficha.tipo
        };
    }
    return ficha;
}

function getMovDer(orientacion, posicion){
    var numPos = generaNumPosicion(posicion);
    if (orientacion === 'blancas') {
        if(numPos.y - 1 >= 0 && numPos.x + 1 <= 7){
            return fichas[numPos.y-1][numPos.x+1];
        }
    } else {
        if(numPos.x - 1 >= 0 && numPos.y + 1 <= 7){
            return fichas[numPos.y+1][numPos.x-1];
        }
    }
    return false;
}
function getMovIzq(orientacion, posicion){
    var numPos = generaNumPosicion(posicion);
    if (orientacion === 'blancas') {
        if(numPos.x - 1 >= 0 && numPos.y - 1 >= 0) {
            return fichas[numPos.y-1][numPos.x-1];
        }
    } else {
        if(numPos.x + 1 <= 7 && numPos.y + 1 <= 7) {
            return fichas[numPos.y+1][numPos.x+1];
        }
    }
    return false;
}

function comidaEnCadenaIzqInv(fichaMov, fichaComer, movimientos){
    var casillaLibre, mov, color_inverso, hay_hueco, ficha_state;
    var comidas = [];

    if(movimientos.length > 0) {
        for (var i = 0; i < movimientos[movimientos.length - 1].comidas.length; i++) {
            comidas.push(movimientos[movimientos.length - 1].comidas[i]);
        }
    }

    switch(fichaMov.color){
        case 'blancas':
            color_inverso = 'negras';
            break;
        case 'negras':
            color_inverso = 'blancas';
            break;
    }

    casillaLibre = getMovIzq(color_inverso, fichaComer.posicion);
    if(casillaLibre) {
        if (casillaLibre.numFicha === -1) { //se la puede comer

            comidas.push(fichaComer);
            movimientos.push({comidas: comidas, movimiento: casillaLibre});

            mov = getMovIzq(color_inverso, casillaLibre.posicion);
            if (mov) {
                if (mov.color !== fichaMov.color && mov.numFicha !== -1) { //posibilidad de comerse otra ficha
                    movimientos = comidaEnCadenaIzqInv(fichaMov, mov, movimientos);
                }
                else if(fichaMov.tipo === 'dama'){
                    hay_hueco = true;
                    ficha_state = devuelveDatosFicha(fichaMov);
                    while(hay_hueco){
                        mov = getMovIzq(color_inverso, mov.posicion);
                        if (mov) {
                            if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                movimientos = comidaEnCadenaIzqInv(ficha_state, mov, movimientos);
                                hay_hueco = false;
                            }
                            ficha_state.posicion = mov.posicion;
                        } else { hay_hueco = false; }
                    }
                }
            }
            mov = getMovDer(color_inverso, casillaLibre.posicion);
            if (mov) {
                if (mov.color !== fichaMov.color && mov.numFicha !== -1) { //posibilidad de comerse otra ficha
                    movimientos = comidaEnCadenaDerInv(fichaMov, mov, movimientos);
                }
                else if(fichaMov.tipo === 'dama'){
                    hay_hueco = true;
                    ficha_state = devuelveDatosFicha(fichaMov);
                    while(hay_hueco){
                        mov = getMovDer(color_inverso, mov.posicion);
                        if (mov) {
                            if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                movimientos = comidaEnCadenaDerInv(ficha_state, mov, movimientos);
                                hay_hueco = false;
                            }
                            ficha_state.posicion = mov.posicion;
                        } else { hay_hueco = false; }
                    }
                }
            }

            if(fichaMov.tipo === 'dama'){
                mov = getMovDer(fichaMov.color, casillaLibre.posicion);
                if (mov) {
                    if (mov.color !== fichaMov.color && mov.numFicha !== -1) {
                        movimientos = comidaEnCadenaDer(fichaMov, mov, movimientos);
                    }
                    else if(fichaMov.tipo === 'dama'){
                        hay_hueco = true;
                        ficha_state = devuelveDatosFicha(fichaMov);
                        while(hay_hueco){
                            mov = getMovDer(fichaMov.color, mov.posicion);
                            if (mov) {
                                if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                    movimientos = comidaEnCadenaDer(ficha_state, mov, movimientos);
                                    hay_hueco = false;
                                }
                                ficha_state.posicion = mov.posicion;
                            } else { hay_hueco = false; }
                        }
                    }
                }
            }

        }
    }
    return movimientos;
}
function comidaEnCadenaDerInv(fichaMov, fichaComer, movimientos){
    var casillaLibre, mov, color_inverso, hay_hueco, ficha_state;
    var comidas = [];

    if(movimientos.length > 0) {
        for (var i = 0; i < movimientos[movimientos.length - 1].comidas.length; i++) {
            comidas.push(movimientos[movimientos.length - 1].comidas[i]);
        }
    }

    switch(fichaMov.color){
        case 'blancas':
            color_inverso = 'negras';
            break;
        case 'negras':
            color_inverso = 'blancas';
            break;
    }

    casillaLibre = getMovDer(color_inverso, fichaComer.posicion);
    if(casillaLibre) {
        if (casillaLibre.numFicha === -1) { //se la puede comer

            comidas.push(fichaComer);
            movimientos.push({comidas: comidas, movimiento: casillaLibre});

            mov = getMovIzq(color_inverso, casillaLibre.posicion);
            if (mov) {
                if (mov.color !== fichaMov.color && mov.numFicha !== -1) { //posibilidad de comerse otra ficha
                    movimientos = comidaEnCadenaIzqInv(fichaMov, mov, movimientos);
                }
                else if(fichaMov.tipo === 'dama'){
                    hay_hueco = true;
                    ficha_state = devuelveDatosFicha(fichaMov);
                    while(hay_hueco){
                        mov = getMovIzq(color_inverso, mov.posicion);
                        if (mov) {
                            if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                movimientos = comidaEnCadenaIzqInv(ficha_state, mov, movimientos);
                                hay_hueco = false;
                            }
                            ficha_state.posicion = mov.posicion;
                        } else { hay_hueco = false; }
                    }
                }
            }
            mov = getMovDer(color_inverso, casillaLibre.posicion);
            if (mov) {
                if (mov.color !== fichaMov.color && mov.numFicha !== -1) { //posibilidad de comerse otra ficha
                    movimientos = comidaEnCadenaDerInv(fichaMov, mov, movimientos);
                }
                else if(fichaMov.tipo === 'dama'){
                    hay_hueco = true;
                    ficha_state = devuelveDatosFicha(fichaMov);
                    while(hay_hueco){
                        mov = getMovDer(color_inverso, mov.posicion);
                        if (mov) {
                            if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                movimientos = comidaEnCadenaDerInv(ficha_state, mov, movimientos);
                                hay_hueco = false;
                            }
                            ficha_state.posicion = mov.posicion;
                        } else { hay_hueco = false; }
                    }
                }
            }

            if(fichaMov.tipo === 'dama'){
                mov = getMovIzq(fichaMov.color, casillaLibre.posicion);
                if (mov) {
                    if (mov.color !== fichaMov.color && mov.numFicha !== -1) {
                        movimientos = comidaEnCadenaIzq(fichaMov, mov, movimientos);
                    }
                    else if(fichaMov.tipo === 'dama'){
                        hay_hueco = true;
                        ficha_state = devuelveDatosFicha(fichaMov);
                        while(hay_hueco){
                            mov = getMovIzq(fichaMov.color, mov.posicion);
                            if (mov) {
                                if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                    movimientos = comidaEnCadenaIzq(ficha_state, mov, movimientos);
                                    hay_hueco = false;
                                }
                                ficha_state.posicion = mov.posicion;
                            } else { hay_hueco = false; }
                        }
                    }
                }
            }

        }
    }
    return movimientos;
}

function comidaEnCadenaIzq(fichaMov, fichaComer, movimientos){
    var casillaLibre, mov, color_inverso, hay_hueco, ficha_state;
    var comidas = [];

    if(movimientos.length > 0) {
        for (var i = 0; i < movimientos[movimientos.length - 1].comidas.length; i++) {
            comidas.push(movimientos[movimientos.length - 1].comidas[i]);
        }
    }

    switch(fichaMov.color){
        case 'blancas':
            color_inverso = 'negras';
            break;
        case 'negras':
            color_inverso = 'blancas';
            break;
    }

    casillaLibre = getMovIzq(fichaMov.color, fichaComer.posicion);
    if(casillaLibre) {
        if (casillaLibre.numFicha === -1) { //se la puede comer

            comidas.push(fichaComer);
            movimientos.push({comidas: comidas, movimiento: casillaLibre});

            mov = getMovIzq(fichaMov.color, casillaLibre.posicion);
            if (mov) {
                if (mov.color !== fichaMov.color && mov.numFicha !== -1) { //posibilidad de comerse otra ficha
                    movimientos = comidaEnCadenaIzq(fichaMov, mov, movimientos);
                }
                else if(fichaMov.tipo === 'dama'){
                    hay_hueco = true;
                    ficha_state = devuelveDatosFicha(fichaMov);
                    while(hay_hueco){
                        mov = getMovIzq(fichaMov.color, mov.posicion);
                        if (mov) {
                            if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                movimientos = comidaEnCadenaIzq(ficha_state, mov, movimientos);
                                hay_hueco = false;
                            }
                            ficha_state.posicion = mov.posicion;
                        } else { hay_hueco = false; }
                    }
                }
            }
            mov = getMovDer(fichaMov.color, casillaLibre.posicion);
            if (mov) {
                if (mov.color !== fichaMov.color && mov.numFicha !== -1) { //posibilidad de comerse otra ficha
                    movimientos = comidaEnCadenaDer(fichaMov, mov, movimientos);
                }
                else if(fichaMov.tipo === 'dama'){
                    hay_hueco = true;
                    ficha_state = devuelveDatosFicha(fichaMov);
                    while(hay_hueco){
                        mov = getMovDer(fichaMov.color, mov.posicion);
                        if (mov) {
                            if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                movimientos = comidaEnCadenaDer(ficha_state, mov, movimientos);
                                hay_hueco = false;
                            }
                            ficha_state.posicion = mov.posicion;
                        } else { hay_hueco = false; }
                    }
                }
            }

            if(fichaMov.tipo === 'dama'){
                mov = getMovDer(color_inverso, casillaLibre.posicion);
                if (mov) {
                    if (mov.color !== fichaMov.color && mov.numFicha !== -1) {
                        movimientos = comidaEnCadenaDerInv(fichaMov, mov, movimientos);
                    }
                    else if(fichaMov.tipo === 'dama'){
                        hay_hueco = true;
                        ficha_state = devuelveDatosFicha(fichaMov);
                        while(hay_hueco){
                            mov = getMovDer(color_inverso, mov.posicion);
                            if (mov) {
                                if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                    movimientos = comidaEnCadenaDerInv(ficha_state, mov, movimientos);
                                    hay_hueco = false;
                                }
                                ficha_state.posicion = mov.posicion;
                            } else { hay_hueco = false; }
                        }
                    }
                }
            }

        }
    }
    return movimientos;
}
function comidaEnCadenaDer(fichaMov, fichaComer, movimientos){
    var casillaLibre, mov, color_inverso, hay_hueco, ficha_state;
    var comidas = [];

    if(movimientos.length > 0) {
        for (var i = 0; i < movimientos[movimientos.length - 1].comidas.length; i++) {
            comidas.push(movimientos[movimientos.length - 1].comidas[i]);
        }
    }

    switch(fichaMov.color){
        case 'blancas':
            color_inverso = 'negras';
            break;
        case 'negras':
            color_inverso = 'blancas';
            break;
    }

    casillaLibre = getMovDer(fichaMov.color, fichaComer.posicion);
    if(casillaLibre) {
        if (casillaLibre.numFicha === -1) { //se la puede comer

            comidas.push(fichaComer);
            movimientos.push({comidas: comidas, movimiento: casillaLibre});

            mov = getMovIzq(fichaMov.color, casillaLibre.posicion);
            if (mov) {
                if (mov.color !== fichaMov.color && mov.numFicha !== -1) { //posibilidad de comerse otra ficha
                    movimientos = comidaEnCadenaIzq(fichaMov, mov, movimientos);
                }
                else if(fichaMov.tipo === 'dama'){
                    hay_hueco = true;
                    ficha_state = devuelveDatosFicha(fichaMov);
                    while(hay_hueco){
                        mov = getMovIzq(fichaMov.color, mov.posicion);
                        if (mov) {
                            if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                movimientos = comidaEnCadenaIzq(ficha_state, mov, movimientos);
                                hay_hueco = false;
                            }
                            ficha_state.posicion = mov.posicion;
                        } else { hay_hueco = false; }
                    }
                }
            }
            mov = getMovDer(fichaMov.color, casillaLibre.posicion);
            if (mov) {
                if (mov.color !== fichaMov.color && mov.numFicha !== -1) { //posibilidad de comerse otra ficha
                    movimientos = comidaEnCadenaDer(fichaMov, mov, movimientos);
                }
                else if(fichaMov.tipo === 'dama'){
                    hay_hueco = true;
                    ficha_state = devuelveDatosFicha(fichaMov);
                    while(hay_hueco){
                        mov = getMovDer(fichaMov.color, mov.posicion);
                        if (mov) {
                            if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                movimientos = comidaEnCadenaDer(ficha_state, mov, movimientos);
                                hay_hueco = false;
                            }
                            ficha_state.posicion = mov.posicion;
                        } else { hay_hueco = false; }
                    }
                }
            }
            if(fichaMov.tipo === 'dama'){
                mov = getMovIzq(color_inverso, casillaLibre.posicion);
                if (mov) {
                    if (mov.color !== fichaMov.color && mov.numFicha !== -1) {
                        movimientos = comidaEnCadenaIzqInv(fichaMov, mov, movimientos);
                    }
                    else if(fichaMov.tipo === 'dama'){
                        hay_hueco = true;
                        ficha_state = devuelveDatosFicha(fichaMov);
                        while(hay_hueco){
                            mov = getMovIzq(color_inverso, mov.posicion);
                            if (mov) {
                                if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                    movimientos = comidaEnCadenaIzqInv(ficha_state, mov, movimientos);
                                    hay_hueco = false;
                                }
                                ficha_state.posicion = mov.posicion;
                            } else { hay_hueco = false; }
                        }
                    }
                }
            }

        }
    }
    return movimientos;
}

function generaPosiblesMovimientos(){
    var mov;
    if(ficha_seleccionada){
        if(ficha_seleccionada.tipo === 'normal'){
            mov = getMovIzq(ficha_seleccionada.color, ficha_seleccionada.posicion);
            if(mov) {
                if (mov.numFicha !== -1) { //hay una ficha enfrente
                    if (mov.color !== ficha_seleccionada.color) { //posibilidad de comerse una ficha
                        mov = comidaEnCadenaIzq(ficha_seleccionada, mov, []);
                        for (var i = 0; i < mov.length; i++) {
                            posibles_movimientos.push(mov[i]);
                        }
                    }
                } else { //hay un espacio enfrente
                    posibles_movimientos.push({comidas: [], movimiento: mov});
                }
            }

            mov = getMovDer(ficha_seleccionada.color, ficha_seleccionada.posicion);
            if(mov) {
                if (mov.numFicha !== -1) { //hay una ficha enfrente
                    if (mov.color !== ficha_seleccionada.color) { //posibilidad de comerse una ficha
                        mov = comidaEnCadenaDer(ficha_seleccionada, mov, []);
                        for (var j = 0; j < mov.length; j++) {
                            posibles_movimientos.push(mov[j]);
                        }
                    }
                } else { //hay un espacio enfrente
                    posibles_movimientos.push({comidas: [], movimiento: mov});
                }
            }
        } else if(ficha_seleccionada.tipo === 'dama'){
            var color_inverso;
            switch(ficha_seleccionada.color){
                case 'blancas':
                    color_inverso = 'negras';
                    break;
                case 'negras':
                    color_inverso = 'blancas';
                    break;
            }

            var hay_hueco = true;
            var ficha_state = devuelveDatosFicha(ficha_seleccionada);
            while(hay_hueco) {
                mov = getMovIzq(ficha_seleccionada.color, ficha_state.posicion);
                if(mov) {
                    if (mov.numFicha !== -1) { //hay una ficha enfrente
                        hay_hueco = false;
                        if(mov.color !== ficha_seleccionada.color){ //posibilidad de comerse una ficha
                            mov = comidaEnCadenaIzq(ficha_state, mov, []);
                            for (var i2 = 0 ; i2 < mov.length ; i2++){
                                posibles_movimientos.push(mov[i2]);
                            }
                        }
                    } else {
                        posibles_movimientos.push({comidas: [], movimiento: mov});
                        ficha_state = {
                            numFicha: ficha_seleccionada.numFicha,
                            color: ficha_seleccionada.color,
                            posicion: mov.posicion,
                            tipo: ficha_seleccionada.tipo
                        }
                    }
                } else { hay_hueco = false; }
            }

            hay_hueco = true;
            ficha_state = devuelveDatosFicha(ficha_seleccionada);
            while(hay_hueco) {
                mov = getMovDer(ficha_seleccionada.color, ficha_state.posicion);
                if (mov) {
                    if (mov.numFicha !== -1) { //hay una ficha enfrente
                        hay_hueco = false;
                        if (mov.color !== ficha_seleccionada.color) { //posibilidad de comerse una ficha
                            mov = comidaEnCadenaDer(ficha_state, mov, []);
                            for (var j2 = 0; j2 < mov.length; j2++) {
                                posibles_movimientos.push(mov[j2]);
                            }
                        }
                    } else { //hay un espacio enfrente
                        posibles_movimientos.push({comidas: [], movimiento: mov});
                        ficha_state = {
                            numFicha: ficha_seleccionada.numFicha,
                            color: ficha_seleccionada.color,
                            posicion: mov.posicion,
                            tipo: ficha_seleccionada.tipo
                        }
                    }
                } else { hay_hueco = false; }
            }

            hay_hueco = true;
            ficha_state = devuelveDatosFicha(ficha_seleccionada);
            while(hay_hueco) {
                mov = getMovIzq(color_inverso, ficha_state.posicion);
                if (mov) {
                    if (mov.numFicha !== -1) { //hay una ficha enfrente
                        hay_hueco = false;
                        if (mov.color !== ficha_seleccionada.color) { //posibilidad de comerse una ficha
                            mov = comidaEnCadenaIzqInv(ficha_state, mov, []);
                            for (var k = 0; k < mov.length; k++) {
                                posibles_movimientos.push(mov[k]);
                            }
                        }
                    } else { //hay un espacio enfrente
                        posibles_movimientos.push({comidas: [], movimiento: mov});
                        ficha_state = {
                            numFicha: ficha_seleccionada.numFicha,
                            color: ficha_seleccionada.color,
                            posicion: mov.posicion,
                            tipo: ficha_seleccionada.tipo
                        }
                    }
                } else { hay_hueco = false; }
            }

            hay_hueco = true;
            ficha_state = devuelveDatosFicha(ficha_seleccionada);
            while(hay_hueco) {
                mov = getMovDer(color_inverso, ficha_state.posicion);
                if (mov) {
                    if (mov.numFicha !== -1) { //hay una ficha enfrente
                        hay_hueco = false;
                        if (mov.color !== ficha_seleccionada.color) { //posibilidad de comerse una ficha
                            mov = comidaEnCadenaDerInv(ficha_state, mov, []);
                            for (var n = 0; n < mov.length; n++) {
                                posibles_movimientos.push(mov[n]);
                            }
                        }
                    } else { //hay un espacio enfrente
                        posibles_movimientos.push({comidas: [], movimiento: mov});
                        ficha_state = {
                            numFicha: ficha_seleccionada.numFicha,
                            color: ficha_seleccionada.color,
                            posicion: mov.posicion,
                            tipo: ficha_seleccionada.tipo
                        }
                    }
                } else { hay_hueco = false; }
            }

        }
    }
}

// FUNCIONES DE MOVIMIENTO ANTERIOR //
function getMovDerAnt(orientacion, posicion){
    var numPos = generaNumPosicion(posicion);
    if (orientacion === 'blancas') {
        if(numPos.y - 1 >= 0 && numPos.x + 1 <= 7){
            return fichas_ant[numPos.y-1][numPos.x+1];
        }
    } else {
        if(numPos.x - 1 >= 0 && numPos.y + 1 <= 7){
            return fichas_ant[numPos.y+1][numPos.x-1];
        }
    }
    return false;
}
function getMovIzqAnt(orientacion, posicion){
    var numPos = generaNumPosicion(posicion);
    if (orientacion === 'blancas') {
        if(numPos.x - 1 >= 0 && numPos.y - 1 >= 0) {
            return fichas_ant[numPos.y-1][numPos.x-1];
        }
    } else {
        if(numPos.x + 1 <= 7 && numPos.y + 1 <= 7) {
            return fichas_ant[numPos.y+1][numPos.x+1];
        }
    }
    return false;
}
function comidaEnCadenaIzqInvAnt(fichaMov, fichaComer, movimientos){
    var casillaLibre, mov, color_inverso, hay_hueco, ficha_state;
    var comidas = [];

    if(movimientos.length > 0) {
        for (var i = 0; i < movimientos[movimientos.length - 1].comidas.length; i++) {
            comidas.push(movimientos[movimientos.length - 1].comidas[i]);
        }
    }

    switch(fichaMov.color){
        case 'blancas':
            color_inverso = 'negras';
            break;
        case 'negras':
            color_inverso = 'blancas';
            break;
    }

    casillaLibre = getMovIzqAnt(color_inverso, fichaComer.posicion);
    if(casillaLibre) {
        if (casillaLibre.numFicha === -1) { //se la puede comer

            comidas.push(fichaComer);
            movimientos.push({comidas: comidas, movimiento: casillaLibre});

            mov = getMovIzqAnt(color_inverso, casillaLibre.posicion);
            if (mov) {
                if (mov.color !== fichaMov.color && mov.numFicha !== -1) { //posibilidad de comerse otra ficha
                    movimientos = comidaEnCadenaIzqInvAnt(fichaMov, mov, movimientos);
                }
                else if(fichaMov.tipo === 'dama'){
                    hay_hueco = true;
                    ficha_state = devuelveDatosFicha(fichaMov);
                    while(hay_hueco){
                        mov = getMovIzqAnt(color_inverso, mov.posicion);
                        if (mov) {
                            if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                movimientos = comidaEnCadenaIzqInvAnt(ficha_state, mov, movimientos);
                                hay_hueco = false;
                            }
                            ficha_state.posicion = mov.posicion;
                        } else { hay_hueco = false; }
                    }
                }
            }
            mov = getMovDerAnt(color_inverso, casillaLibre.posicion);
            if (mov) {
                if (mov.color !== fichaMov.color && mov.numFicha !== -1) { //posibilidad de comerse otra ficha
                    movimientos = comidaEnCadenaDerInvAnt(fichaMov, mov, movimientos);
                }
                else if(fichaMov.tipo === 'dama'){
                    hay_hueco = true;
                    ficha_state = devuelveDatosFicha(fichaMov);
                    while(hay_hueco){
                        mov = getMovDerAnt(color_inverso, mov.posicion);
                        if (mov) {
                            if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                movimientos = comidaEnCadenaDerInvAnt(ficha_state, mov, movimientos);
                                hay_hueco = false;
                            }
                            ficha_state.posicion = mov.posicion;
                        } else { hay_hueco = false; }
                    }
                }
            }

            if(fichaMov.tipo === 'dama'){
                mov = getMovDerAnt(fichaMov.color, casillaLibre.posicion);
                if (mov) {
                    if (mov.color !== fichaMov.color && mov.numFicha !== -1) {
                        movimientos = comidaEnCadenaDerInvAnt(fichaMov, mov, movimientos);
                    }
                    else if(fichaMov.tipo === 'dama'){
                        hay_hueco = true;
                        ficha_state = devuelveDatosFicha(fichaMov);
                        while(hay_hueco){
                            mov = getMovDerAnt(fichaMov.color, mov.posicion);
                            if (mov) {
                                if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                    movimientos = comidaEnCadenaDerInvAnt(ficha_state, mov, movimientos);
                                    hay_hueco = false;
                                }
                                ficha_state.posicion = mov.posicion;
                            } else { hay_hueco = false; }
                        }
                    }
                }
            }

        }
    }
    return movimientos;
}
function comidaEnCadenaDerInvAnt(fichaMov, fichaComer, movimientos){
    var casillaLibre, mov, color_inverso, hay_hueco, ficha_state;
    var comidas = [];

    if(movimientos.length > 0) {
        for (var i = 0; i < movimientos[movimientos.length - 1].comidas.length; i++) {
            comidas.push(movimientos[movimientos.length - 1].comidas[i]);
        }
    }

    switch(fichaMov.color){
        case 'blancas':
            color_inverso = 'negras';
            break;
        case 'negras':
            color_inverso = 'blancas';
            break;
    }

    casillaLibre = getMovDerAnt(color_inverso, fichaComer.posicion);
    if(casillaLibre) {
        if (casillaLibre.numFicha === -1) { //se la puede comer

            comidas.push(fichaComer);
            movimientos.push({comidas: comidas, movimiento: casillaLibre});

            mov = getMovIzqAnt(color_inverso, casillaLibre.posicion);
            if (mov) {
                if (mov.color !== fichaMov.color && mov.numFicha !== -1) { //posibilidad de comerse otra ficha
                    movimientos = comidaEnCadenaIzqInvAnt(fichaMov, mov, movimientos);
                }
                else if(fichaMov.tipo === 'dama'){
                    hay_hueco = true;
                    ficha_state = devuelveDatosFicha(fichaMov);
                    while(hay_hueco){
                        mov = getMovIzqAnt(color_inverso, mov.posicion);
                        if (mov) {
                            if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                movimientos = comidaEnCadenaIzqInvAnt(ficha_state, mov, movimientos);
                                hay_hueco = false;
                            }
                            ficha_state.posicion = mov.posicion;
                        } else { hay_hueco = false; }
                    }
                }
            }
            mov = getMovDerAnt(color_inverso, casillaLibre.posicion);
            if (mov) {
                if (mov.color !== fichaMov.color && mov.numFicha !== -1) { //posibilidad de comerse otra ficha
                    movimientos = comidaEnCadenaDerInvAnt(fichaMov, mov, movimientos);
                }
                else if(fichaMov.tipo === 'dama'){
                    hay_hueco = true;
                    ficha_state = devuelveDatosFicha(fichaMov);
                    while(hay_hueco){
                        mov = getMovDerAnt(color_inverso, mov.posicion);
                        if (mov) {
                            if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                movimientos = comidaEnCadenaDerInvAnt(ficha_state, mov, movimientos);
                                hay_hueco = false;
                            }
                            ficha_state.posicion = mov.posicion;
                        } else { hay_hueco = false; }
                    }
                }
            }

            if(fichaMov.tipo === 'dama'){
                mov = getMovIzqAnt(fichaMov.color, casillaLibre.posicion);
                if (mov) {
                    if (mov.color !== fichaMov.color && mov.numFicha !== -1) {
                        movimientos = comidaEnCadenaIzqAnt(fichaMov, mov, movimientos);
                    }
                    else if(fichaMov.tipo === 'dama'){
                        hay_hueco = true;
                        ficha_state = devuelveDatosFicha(fichaMov);
                        while(hay_hueco){
                            mov = getMovIzqAnt(fichaMov.color, mov.posicion);
                            if (mov) {
                                if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                    movimientos = comidaEnCadenaIzqAnt(ficha_state, mov, movimientos);
                                    hay_hueco = false;
                                }
                                ficha_state.posicion = mov.posicion;
                            } else { hay_hueco = false; }
                        }
                    }
                }
            }

        }
    }
    return movimientos;
}
function comidaEnCadenaIzqAnt(fichaMov, fichaComer, movimientos){
    var casillaLibre, mov, color_inverso, hay_hueco, ficha_state;
    var comidas = [];

    if(movimientos.length > 0) {
        for (var i = 0; i < movimientos[movimientos.length - 1].comidas.length; i++) {
            comidas.push(movimientos[movimientos.length - 1].comidas[i]);
        }
    }

    switch(fichaMov.color){
        case 'blancas':
            color_inverso = 'negras';
            break;
        case 'negras':
            color_inverso = 'blancas';
            break;
    }

    casillaLibre = getMovIzqAnt(fichaMov.color, fichaComer.posicion);
    if(casillaLibre) {
        if (casillaLibre.numFicha === -1) { //se la puede comer

            comidas.push(fichaComer);
            movimientos.push({comidas: comidas, movimiento: casillaLibre});

            mov = getMovIzqAnt(fichaMov.color, casillaLibre.posicion);
            if (mov) {
                if (mov.color !== fichaMov.color && mov.numFicha !== -1) { //posibilidad de comerse otra ficha
                    movimientos = comidaEnCadenaIzqAnt(fichaMov, mov, movimientos);
                }
                else if(fichaMov.tipo === 'dama'){
                    hay_hueco = true;
                    ficha_state = devuelveDatosFicha(fichaMov);
                    while(hay_hueco){
                        mov = getMovIzqAnt(fichaMov.color, mov.posicion);
                        if (mov) {
                            if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                movimientos = comidaEnCadenaIzqAnt(ficha_state, mov, movimientos);
                                hay_hueco = false;
                            }
                            ficha_state.posicion = mov.posicion;
                        } else { hay_hueco = false; }
                    }
                }
            }
            mov = getMovDerAnt(fichaMov.color, casillaLibre.posicion);
            if (mov) {
                if (mov.color !== fichaMov.color && mov.numFicha !== -1) { //posibilidad de comerse otra ficha
                    movimientos = comidaEnCadenaDerAnt(fichaMov, mov, movimientos);
                }
                else if(fichaMov.tipo === 'dama'){
                    hay_hueco = true;
                    ficha_state = devuelveDatosFicha(fichaMov);
                    while(hay_hueco){
                        mov = getMovDerAnt(fichaMov.color, mov.posicion);
                        if (mov) {
                            if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                movimientos = comidaEnCadenaDerAnt(ficha_state, mov, movimientos);
                                hay_hueco = false;
                            }
                            ficha_state.posicion = mov.posicion;
                        } else { hay_hueco = false; }
                    }
                }
            }

            if(fichaMov.tipo === 'dama'){
                mov = getMovDerAnt(color_inverso, casillaLibre.posicion);
                if (mov) {
                    if (mov.color !== fichaMov.color && mov.numFicha !== -1) {
                        movimientos = comidaEnCadenaDerInvAnt(fichaMov, mov, movimientos);
                    }
                    else if(fichaMov.tipo === 'dama'){
                        hay_hueco = true;
                        ficha_state = devuelveDatosFicha(fichaMov);
                        while(hay_hueco){
                            mov = getMovDerAnt(color_inverso, mov.posicion);
                            if (mov) {
                                if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                    movimientos = comidaEnCadenaDerInvAnt(ficha_state, mov, movimientos);
                                    hay_hueco = false;
                                }
                                ficha_state.posicion = mov.posicion;
                            } else { hay_hueco = false; }
                        }
                    }
                }
            }

        }
    }
    return movimientos;
}
function comidaEnCadenaDerAnt(fichaMov, fichaComer, movimientos){
    var casillaLibre, mov, color_inverso, hay_hueco, ficha_state;
    var comidas = [];

    if(movimientos.length > 0) {
        for (var i = 0; i < movimientos[movimientos.length - 1].comidas.length; i++) {
            comidas.push(movimientos[movimientos.length - 1].comidas[i]);
        }
    }

    switch(fichaMov.color){
        case 'blancas':
            color_inverso = 'negras';
            break;
        case 'negras':
            color_inverso = 'blancas';
            break;
    }

    casillaLibre = getMovDerAnt(fichaMov.color, fichaComer.posicion);
    if(casillaLibre) {
        if (casillaLibre.numFicha === -1) { //se la puede comer

            comidas.push(fichaComer);
            movimientos.push({comidas: comidas, movimiento: casillaLibre});

            mov = getMovIzqAnt(fichaMov.color, casillaLibre.posicion);
            if (mov) {
                if (mov.color !== fichaMov.color && mov.numFicha !== -1) { //posibilidad de comerse otra ficha
                    movimientos = comidaEnCadenaIzqAnt(fichaMov, mov, movimientos);
                }
                else if(fichaMov.tipo === 'dama'){
                    hay_hueco = true;
                    ficha_state = devuelveDatosFicha(fichaMov);
                    while(hay_hueco){
                        mov = getMovIzqAnt(fichaMov.color, mov.posicion);
                        if (mov) {
                            if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                movimientos = comidaEnCadenaIzqAnt(ficha_state, mov, movimientos);
                                hay_hueco = false;
                            }
                            ficha_state.posicion = mov.posicion;
                        } else { hay_hueco = false; }
                    }
                }
            }
            mov = getMovDerAnt(fichaMov.color, casillaLibre.posicion);
            if (mov) {
                if (mov.color !== fichaMov.color && mov.numFicha !== -1) { //posibilidad de comerse otra ficha
                    movimientos = comidaEnCadenaDerAnt(fichaMov, mov, movimientos);
                }
                else if(fichaMov.tipo === 'dama'){
                    hay_hueco = true;
                    ficha_state = devuelveDatosFicha(fichaMov);
                    while(hay_hueco){
                        mov = getMovDerAnt(fichaMov.color, mov.posicion);
                        if (mov) {
                            if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                movimientos = comidaEnCadenaDerAnt(ficha_state, mov, movimientos);
                                hay_hueco = false;
                            }
                            ficha_state.posicion = mov.posicion;
                        } else { hay_hueco = false; }
                    }
                }
            }

            if(fichaMov.tipo === 'dama'){
                mov = getMovIzqAnt(color_inverso, casillaLibre.posicion);
                if (mov) {
                    if (mov.color !== fichaMov.color && mov.numFicha !== -1) {
                        movimientos = comidaEnCadenaIzqInvAnt(fichaMov, mov, movimientos);
                    }
                    else if(fichaMov.tipo === 'dama'){
                        hay_hueco = true;
                        ficha_state = devuelveDatosFicha(fichaMov);
                        while(hay_hueco){
                            mov = getMovIzqAnt(color_inverso, mov.posicion);
                            if (mov) {
                                if (mov.color !== fichaMov.color && mov.numFicha !== -1){
                                    movimientos = comidaEnCadenaIzqInvAnt(ficha_state, mov, movimientos);
                                    hay_hueco = false;
                                }
                                ficha_state.posicion = mov.posicion;
                            } else { hay_hueco = false; }
                        }
                    }
                }
            }

        }
    }
    return movimientos;
}

function generaPosiblesMovimientosAnt(){
    var mov, ficha_ant;
    if(ficha_seleccionada){
        for(var i2 = 0 ; i2 < fichas_ant.length ; i2++){
            for(var j2 = 0 ; j2 < fichas_ant[i2].length ; j2++){
                if(ficha_seleccionada.color === fichas_ant[i2][j2].color && ficha_seleccionada.numFicha == fichas_ant[i2][j2].numFicha){
                    ficha_ant = fichas_ant[i2][j2];
                }
            }
        }
        if(ficha_ant.tipo === 'normal'){ //si es un peón...
            mov = getMovIzqAnt(ficha_ant.color, ficha_ant.posicion);
            if(mov) {
                if (mov.numFicha !== -1) { //hay una ficha enfrente
                    if (mov.color !== ficha_ant.color) { //posibilidad de comerse una ficha
                        mov = comidaEnCadenaIzqAnt(ficha_ant, mov, []);
                        for (var i = 0; i < mov.length; i++) {
                            posibles_movimientos.push(mov[i]);
                        }
                    }
                } else { //hay un espacio enfrente
                    posibles_movimientos.push({comidas: [], movimiento: mov});
                }
            }

            mov = getMovDerAnt(ficha_ant.color, ficha_ant.posicion);
            if(mov) {
                if (mov.numFicha !== -1) { //hay una ficha enfrente
                    if (mov.color !== ficha_ant.color) { //posibilidad de comerse una ficha
                        mov = comidaEnCadenaDerAnt(ficha_ant, mov, []);
                        for (var j = 0; j < mov.length; j++) {
                            posibles_movimientos.push(mov[j]);
                        }
                    }
                } else { //hay un espacio enfrente
                    posibles_movimientos.push({comidas: [], movimiento: mov});
                }
            }

        } else if(ficha_seleccionada.tipo === 'dama'){
            var color_inverso;
            switch(ficha_seleccionada.color){
                case 'blancas':
                    color_inverso = 'negras';
                    break;
                case 'negras':
                    color_inverso = 'blancas';
                    break;
            }

            var hay_hueco = true;
            var ficha_state = devuelveDatosFicha(ficha_ant);
            while(hay_hueco) {
                mov = getMovIzqAnt(ficha_ant.color, ficha_state.posicion);
                if(mov) {
                    if (mov.numFicha !== -1) { //hay una ficha enfrente
                        hay_hueco = false;
                        if(mov.color !== ficha_ant.color){ //posibilidad de comerse una ficha
                            mov = comidaEnCadenaIzqAnt(ficha_state, mov, []);
                            for (var m = 0 ; m < mov.length ; m++){
                                posibles_movimientos.push(mov[m]);
                            }
                        }
                    } else {
                        posibles_movimientos.push({comidas: [], movimiento: mov});
                        ficha_state = {
                            numFicha: ficha_ant.numFicha,
                            color: ficha_ant.color,
                            posicion: mov.posicion,
                            tipo: ficha_ant.tipo
                        }
                    }
                } else { hay_hueco = false; }
            }

            hay_hueco = true;
            ficha_state = devuelveDatosFicha(ficha_ant);
            while(hay_hueco) {
                mov = getMovDerAnt(ficha_ant.color, ficha_state.posicion);
                if (mov) {
                    if (mov.numFicha !== -1) { //hay una ficha enfrente
                        hay_hueco = false;
                        if (mov.color !== ficha_ant.color) { //posibilidad de comerse una ficha
                            mov = comidaEnCadenaDerAnt(ficha_state, mov, []);
                            for (var l = 0; l < mov.length; l++) {
                                posibles_movimientos.push(mov[l]);
                            }
                        }
                    } else { //hay un espacio enfrente
                        posibles_movimientos.push({comidas: [], movimiento: mov});
                        ficha_state = {
                            numFicha: ficha_ant.numFicha,
                            color: ficha_ant.color,
                            posicion: mov.posicion,
                            tipo: ficha_ant.tipo
                        }
                    }
                } else { hay_hueco = false; }
            }

            hay_hueco = true;
            ficha_state = devuelveDatosFicha(ficha_ant);
            while(hay_hueco) {
                mov = getMovIzqAnt(color_inverso, ficha_state.posicion);
                if (mov) {
                    if (mov.numFicha !== -1) { //hay una ficha enfrente
                        hay_hueco = false;
                        if (mov.color !== ficha_ant.color) { //posibilidad de comerse una ficha
                            mov = comidaEnCadenaIzqInvAnt(ficha_state, mov, []);
                            for (var k = 0; k < mov.length; k++) {
                                posibles_movimientos.push(mov[k]);
                            }
                        }
                    } else { //hay un espacio enfrente
                        posibles_movimientos.push({comidas: [], movimiento: mov});
                        ficha_state = {
                            numFicha: ficha_ant.numFicha,
                            color: ficha_ant.color,
                            posicion: mov.posicion,
                            tipo: ficha_ant.tipo
                        }
                    }
                } else { hay_hueco = false; }
            }

            hay_hueco = true;
            ficha_state = devuelveDatosFicha(ficha_ant);
            while(hay_hueco) {
                mov = getMovDerAnt(color_inverso, ficha_state.posicion);
                if (mov) {
                    if (mov.numFicha !== -1) { //hay una ficha enfrente
                        hay_hueco = false;
                        if (mov.color !== ficha_ant.color) { //posibilidad de comerse una ficha
                            mov = comidaEnCadenaDerInvAnt(ficha_state, mov, []);
                            for (var n = 0; n < mov.length; n++) {
                                posibles_movimientos.push(mov[n]);
                            }
                        }
                    } else { //hay un espacio enfrente
                        posibles_movimientos.push({comidas: [], movimiento: mov});
                        ficha_state = {
                            numFicha: ficha_ant.numFicha,
                            color: ficha_ant.color,
                            posicion: mov.posicion,
                            tipo: ficha_ant.tipo
                        }
                    }
                } else { hay_hueco = false; }
            }

        }
    }
}
// /FUNCIONES DE MOVIMIENTO ANTERIOR //

// función que llamará el evento mousedown, o, en caso de tener un dispositivo táctil, touchstart //
function pulsarTouchMouse(){
    var otra_ficha = true;
    if(miTurno()) {
        if (ficha_seleccionada) {
            for (var k = 0; k < posibles_movimientos.length; k++) {
                if (posibles_movimientos[k].movimiento.posicion === obtieneCasilla(mousePos.x, mousePos.y)) {
                    if(touch_activado && mostrar_hover_touch === -1) mostrar_hover_touch = 0;
                    else if(touch_activado && mov_hover_touch !== posibles_movimientos[k].movimiento.posicion) mostrar_hover_touch = 0;
                    if(mostrar_hover_touch !== 0) {
                        addMovimiento(posibles_movimientos[k].comidas, posibles_movimientos[k].movimiento, ficha_seleccionada);
                        cambiaTurno();
                        ajaxMovimiento(posibles_movimientos[k], ficha_seleccionada);
                        ficha_seleccionada = false;
                        posibles_movimientos = [];
                        otra_ficha = false;
                        mostrar_hover_touch = -1;
                        mov_hover_touch = null;
                    } else { //simulación del mousemove en disp. táctiles cuando se pulsa un cuadro
                        otra_ficha = false;
                        mov_hover_touch = posibles_movimientos[k].movimiento.posicion;
                        canvas.trigger('mousemove');
                    }
                }
            }
        }
        if(otra_ficha) {
            mostrar_hover_touch = -1;
            mov_hover_touch = null;
            ficha_seleccionada = false;
            posibles_movimientos = [];
            for (var i = 0; i < NUM_CASILLAS; i++) {
                for (var j = 0; j < NUM_CASILLAS; j++) {
                    if (fichas[i][j].posicion === obtieneCasilla(mousePos.x, mousePos.y)) {
                        if (fichas[i][j].color === mis_datos.color) {
                            ficha_seleccionada = fichas[i][j];
                            generaPosiblesMovimientos();
                            raton_down = true;
                        } else if(fichas_ant.length > 0) {
                            ficha_seleccionada = fichas[i][j];
                            generaPosiblesMovimientosAnt();
                            compruebaCastigoFicha();
                            posibles_movimientos = [];
                            ficha_seleccionada = false;
                        }
                    }
                }
            }
        }
        actualizaJuego();
    }
}
function limpiaEventos(){
    canvas.off('selectstart');
    canvas.off('mouseleave');
    canvas.off('touchstart');
    canvas.off('touchmove');
    canvas.off('touchend');
    canvas.off('mousedown');
    canvas.off('mousemove');
    canvas.off('mouseup');
}
function defineEventos(){
    canvas.on('selectstart', function(e) { e.preventDefault(); return false; }, false);
    canvas.on('mouseleave', function(){
        raton_down = false;
        cuadro_hover = false;
        actualizaJuego();
    });

    canvas.on('touchstart', function(e) {
        touch_activado = true;
        mousePos = getMousePos(canvas, e.touches[0]);
        pulsarTouchMouse();
        // elimina el evento de mousedown, para que no haya acumulación y se pueda hacer el movimiento en 2 pasos
        canvas.off('mousedown');
        if (e.target === canvas[0]) {
            e.preventDefault();
        }
    });
    canvas.on('touchmove', function(e) {
        mousePos = getMousePos(canvas, e.touches[0]);
        canvas.trigger('mousemove');
        if (e.target === canvas[0]) {
            e.preventDefault();
        }
    });
    canvas.on('touchend', function(e) {
        canvas.trigger('mouseup');
        touch_activado = false;
        if (e.target === canvas[0]) {
            e.preventDefault();
        }
    });

    canvas.on('mousedown', pulsarTouchMouse);
    canvas.on('mousemove', function(e) {
        cuadro_hover = false;
        for(var i = 0 ; i < NUM_CASILLAS ; i++){
            for(var j = 0 ; j < NUM_CASILLAS ; j++){
                if(!touch_activado)
                    mousePos= getMousePos(canvas, e);
                if(fichas[i][j].posicion === obtieneCasilla(mousePos.x, mousePos.y)) {
                    cuadro_hover = fichas[i][j];
                    if (miTurno() && fichas[i][j].color === mis_datos.color && fichas[i][j].numFicha !== -1) {
                        canvas.css({cursor: 'pointer'});
                    } else {
                        canvas.css({cursor: 'auto'});
                    }
                }
            }
        }
        actualizaJuego();
    });
    canvas.on('mouseup', function() {
        if(mostrar_hover_touch === 0) mostrar_hover_touch = 1;
        if(raton_down && ficha_seleccionada){
            for(var i = 0 ; i < posibles_movimientos.length ; i++){
                if(posibles_movimientos[i].movimiento.posicion === obtieneCasilla(mousePos.x, mousePos.y)){
                    addMovimiento(posibles_movimientos[i].comidas, posibles_movimientos[i].movimiento, ficha_seleccionada);
                    cambiaTurno();
                    ajaxMovimiento(posibles_movimientos[i], ficha_seleccionada);
                    ficha_seleccionada = false;
                    posibles_movimientos = [];
                }
            }
        }
        raton_down = false;
        actualizaJuego();
    });
}

function obtieneFicha(numficha, color){
    if(numficha == -1){
        return {
            numFicha: -1,
            color: '',
            posicion: '',
            tipo: ''
        };
    }
    for(var i = 0 ; i < fichas.length ; i++){
        for(var j = 0 ; j < fichas[i].length ; j++){
            if(fichas[i][j].numFicha == numficha && fichas[i][j].color === color){
                return fichas[i][j];
            }
        }
    }
    return false;
}

function convertirDama(ficha, posicion){
    var tipo = 'dama';
    if(ficha.tipo === 'normal'){
        if(getMovDer(ficha.color, posicion) || getMovIzq(ficha.color, posicion)){
            tipo = 'normal';
        }
    }
    if(ficha.tipo === ''){
        tipo = '';
    }
    return tipo;
}

// los movimientos se calcularán TODOS desde cero //
function hayNuevoMovimiento(mov){
    var comidas;
    if(repeticion === false) {
        num_comidas_ult_mov = mov[mov.length - 1].comidas.length;
    }
    movimientos = []; //vaciamos el array para volverlo a llenar
    inicializaFichas(); //reiniciamos el array de fichas para realizar el proceso de movimientos
    for(var i = 0 ; i < mov.length ; i++){
        comidas = mov[i].comidas;
        var ficha = obtieneFicha(mov[i].numficha, mov[i].color);
        if(ficha.numFicha == -1){
            ficha.posicion = mov[i].posicion;
        }
        var movimiento = {
            numFicha: Number(mov[i].numficha),
            posicion: mov[i].posicion,
            color: mov[i].color,
            tipo: ficha.tipo
        };
        addMovimiento(comidas, movimiento, ficha);
    }
}

function addMovimiento(comidas, movimiento, ficha){
    if(ficha !== false) {
        var ficha_aux = '';
        for (var i = 0; i < NUM_CASILLAS; i++) {
            for (var j = 0; j < NUM_CASILLAS; j++) {
                ficha_aux = devuelveDatosFicha(fichas[i][j]);
                if (ficha_aux.posicion === ficha.posicion) {
                    fichas[i][j] = espacioVacio(ficha.posicion);
                }
                if (ficha_aux.posicion === movimiento.posicion) {
                    fichas[i][j].color = ficha.color;
                    fichas[i][j].tipo = convertirDama(ficha, movimiento.posicion);
                    fichas[i][j].numFicha = ficha.numFicha;
                }
                for (var k = 0; k < comidas.length; k++) {
                    if (ficha_aux.posicion === comidas[k].posicion) {
                        restaFicha(ficha_aux.color);
                        fichas[i][j] = espacioVacio(comidas[k].posicion);
                        comprobarPuntos();
                    }
                }
            }
        }
    }
    movimientos.push({comidas:comidas, movimiento:movimiento});
}

function ajaxMovimiento(movimiento, ficha){
    $.ajax({
        data: {
            comidas: movimiento.comidas,
            movimiento: movimiento.movimiento.posicion,
            ficha: ficha,
            modo: 'movimiento'
        },
        type: 'POST',
        dataType: 'json',
        url: 'ajax/insert.php'
    });
}

function restaFicha(color){
    switch(color){
        case 'blancas':
            fichas_blancas--;
            break;
        case 'negras':
            fichas_negras--;
            break;
    }
}

function comprobarPuntos(){
    if(fichas_blancas === 0 || fichas_negras === 0) {
        setTimeout(function(){
            estado = 'resultados';
            turno = '';
            guardaResultados();
        }, 1000);
    }
}

function guardaResultados(){
    var ganador = 'tablas';
    if (estado === 'resultados') {
        ganador = 'blancas';
        if (fichas_blancas === 0) {
            ganador = 'negras';
        }
    }
    $.ajax({
        data: {
            ganador: ganador,
            modo: 'resultados'
        },
        type: 'POST',
        dataType: 'json',
        url: 'ajax/insert.php'
    });
}

function cambiaTurno(){
    switch(turno){
        case 'blancas':
            turno = 'negras';
            break;
        case 'negras':
            turno = 'blancas';
            break;
    }
    puede_castigar = true;
}

function espacioVacio(posicion){
    return {
        numFicha : -1,
        posicion : posicion,
        color : '',
        tipo : ''
    };
}

function generaPosicion(fila,columna){
    var columnas = ['a','b','c','d','e','f','g','h'];
    var filas = ['8','7','6','5','4','3','2','1'];
    return columnas[columna]+filas[fila];
}

function generaNumPosicion(posicion){
    var col = posicion.charAt(0);
    var fil = posicion.charAt(1);
    var ret = {x: -1, y: -1};
    var columnas = ['a','b','c','d','e','f','g','h'];
    var filas = ['8','7','6','5','4','3','2','1'];
    for(var i = 0 ; i < filas.length ; i++){
        if(filas[i] === fil){
            ret.y = i;
        }
    }
    for(var j = 0 ; j < columnas.length ; j++){
        if(columnas[j] === col){
            ret.x = j;
        }
    }
    return ret;
}

function inicializaFichas(){
    fichas_blancas = 12;
    fichas_negras = 12;
    fichas_ant = fichas;
    fichas = [];
    var numFichasBlancas = 0;
    var numFichasNegras = 0;
    for(var i = 0 ; i < NUM_CASILLAS ; i++){
        fichas.push([]);
        for(var j = 0 ; j < NUM_CASILLAS ; j++){
            if(i <= 2 || i >= 5) {
                if (i % 2 === 0) {
                    if (j % 2 === 0) {
                        fichas[i].push({
                            numFicha: -1,
                            posicion: generaPosicion(i, j),
                            color: '',
                            tipo: ''
                        });
                    }
                    else {
                        if (numFichasNegras < 12) {
                            fichas[i].push({
                                numFicha: numFichasNegras,
                                posicion: generaPosicion(i, j),
                                color: 'negras',
                                tipo: 'normal'
                            });
                            numFichasNegras++;
                        }
                        else {
                            fichas[i].push({
                                numFicha: numFichasBlancas,
                                posicion: generaPosicion(i, j),
                                color: 'blancas',
                                tipo: 'normal'
                            });
                            numFichasBlancas++;
                        }
                    }
                }
                else {
                    if (j % 2 === 0) {
                        if (numFichasNegras < 12) {
                            fichas[i].push({
                                numFicha: numFichasNegras,
                                posicion: generaPosicion(i, j),
                                color: 'negras',
                                tipo: 'normal'
                            });
                            numFichasNegras++;
                        }
                        else {
                            fichas[i].push({
                                numFicha: numFichasBlancas,
                                posicion: generaPosicion(i, j),
                                color: 'blancas',
                                tipo: 'normal'
                            });
                            numFichasBlancas++;
                        }

                    }
                    else {
                        fichas[i].push({
                            numFicha: -1,
                            posicion: generaPosicion(i, j),
                            color: '',
                            tipo:''
                        });
                    }
                }
            }
            else {
                fichas[i].push({
                    numFicha: -1,
                    posicion:generaPosicion(i,j),
                    color:'',
                    tipo:''
                });
            }
        }
    }
}

function dibujaFicha(color, tipo, x, y, w, h){
    if(color === 'blancas'){
        if(tipo === 'dama'){
            ctx.drawImage(DAMA_BLANCA, x, y, w, h);
        } else {
            ctx.drawImage(FICHA_BLANCA, x, y, w, h);
        }
    } else if(color === 'negras') {
        if(tipo === 'dama'){
            ctx.drawImage(DAMA_NEGRA, x, y, w, h);
        } else {
            ctx.drawImage(FICHA_NEGRA, x, y, w, h);
        }
    }
}

function dibujaFichas(){
    var ficha_drag = false;
    var comidas = [];
    if(fichas.length > 0) {
        for (var i = 0; i < NUM_CASILLAS; i++) {
            for (var j = 0; j < NUM_CASILLAS; j++) {
                // dibujos sobre todas las fichas, excepto la que esté siendo arrastrada //
                if (ficha_seleccionada && raton_down) {
                    if (ficha_seleccionada.color !== fichas[i][j].color || ficha_seleccionada.numFicha !== fichas[i][j].numFicha) {
                        dibujaFicha(fichas[i][j].color, fichas[i][j].tipo, j * TAM_CUADROS, i * TAM_CUADROS, TAM_CUADROS, TAM_CUADROS);
                    }
                } else {
                    dibujaFicha(fichas[i][j].color, fichas[i][j].tipo, j * TAM_CUADROS, i * TAM_CUADROS, TAM_CUADROS, TAM_CUADROS);
                }

                // dibujos sobre la ficha seleccionada //
                if (ficha_seleccionada) {
                    if (ficha_seleccionada.numFicha === fichas[i][j].numFicha && fichas[i][j].color === ficha_seleccionada.color) {
                        if (!raton_down) {
                            ctx.drawImage(FICHA_SELECT, j * TAM_CUADROS, i * TAM_CUADROS, TAM_CUADROS, TAM_CUADROS);
                        } else {
                            ficha_drag = fichas[i][j];
                        }
                    }
                }
                // dibujos sobre los posibles movimientos de una ficha seleccionada //
                for (var k = 0; k < posibles_movimientos.length; k++) {
                    if (posibles_movimientos[k].movimiento.posicion === fichas[i][j].posicion) {
                        ctx.drawImage(FICHA_MOV, j * TAM_CUADROS, i * TAM_CUADROS, TAM_CUADROS, TAM_CUADROS);
                        if (cuadro_hover) {
                            if (fichas[i][j].posicion === cuadro_hover.posicion) {
                                ctx.drawImage(CUADRO_SELECT, j * TAM_CUADROS, i * TAM_CUADROS, TAM_CUADROS, TAM_CUADROS);
                                comidas = posibles_movimientos[k].comidas;
                                for (var n = 0; n < comidas.length; n++) {
                                    for (var i2 = 0; i2 < fichas.length; i2++) {
                                        for (var j2 = 0; j2 < fichas[i2].length; j2++) {
                                            if (fichas[i2][j2].posicion === comidas[n].posicion) {
                                                ctx.drawImage(FICHA_COMIDA, j2 * TAM_CUADROS, i2 * TAM_CUADROS, TAM_CUADROS, TAM_CUADROS);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        // dibujo de arrastre de la ficha seleccionada //
        if (ficha_drag) {
            var diferencia = (TAM_CUADROS / 2);
            dibujaFicha(ficha_drag.color, ficha_drag.tipo, mousePos.x - diferencia, mousePos.y - diferencia, TAM_CUADROS, TAM_CUADROS);
            ctx.drawImage(FICHA_SELECT, mousePos.x - diferencia, mousePos.y - diferencia, TAM_CUADROS, TAM_CUADROS);
        }
        // dibujo de ganador si se ha acabado la partida //
        if (estado === 'resultados') {
            ctx.fillStyle = '#4b4e6e';
            ctx.fillRect(0, TAM_TABLERO / 2 - TAM_CUADROS / 3, TAM_TABLERO, TAM_CUADROS / 2);
            ctx.font = (TAM_CUADROS / 3) + 'px Arial';
            ctx.fillStyle = '#b8b8b8';
            if (fichas_blancas === 0 || rendicion === 'negras') {
                if (mis_datos.rol !== 'espectador') {
                    if (mis_datos.color === 'blancas') {
                        ctx.fillText('¡Has perdido!', TAM_CUADROS / 2, TAM_TABLERO / 2);
                    } else {
                        ctx.fillText('¡Has ganado!', TAM_CUADROS / 2, TAM_TABLERO / 2);
                    }
                } else {
                    ctx.fillText('¡Han ganado las negras!', TAM_CUADROS / 2, TAM_TABLERO / 2);
                }
            } else if (fichas_negras === 0 || rendicion === 'blancas') {
                if (mis_datos.rol !== 'espectador') {
                    if (mis_datos.color === 'negras') {
                        ctx.fillText('¡Has perdido!', TAM_CUADROS / 2, TAM_TABLERO / 2);
                    } else {
                        ctx.fillText('¡Has ganado!', TAM_CUADROS / 2, TAM_TABLERO / 2);
                    }
                } else {
                    ctx.fillText('¡Han ganado las blancas!', TAM_CUADROS / 2, TAM_TABLERO / 2);
                }
            }
        } else if (estado === 'tablas') {
            guardaResultados();
            ctx.fillStyle = '#4b4e6e';
            ctx.fillRect(0, TAM_TABLERO / 2 - TAM_CUADROS / 3, TAM_TABLERO, TAM_CUADROS / 2);
            ctx.font = (TAM_CUADROS / 3) + 'px Arial';
            ctx.fillStyle = '#e2e2e2';
            ctx.fillText('La partida ha acabado en tablas.', TAM_CUADROS / 2, TAM_TABLERO / 2);
        }
    }
}

function dibujaTablero(){
    for(var i = 0 ; i < NUM_CASILLAS ; i++){
        for(var j = 0 ; j < NUM_CASILLAS ; j++){
            if (i % 2 === 0) {
                if(j % 2 === 0){
                    ctx.fillStyle = BLANCO;

                }
                else {
                    ctx.fillStyle = NEGRO;
                }
            }
            else {
                if(j % 2 === 0){
                    ctx.fillStyle = NEGRO;

                }
                else {
                    ctx.fillStyle = BLANCO;
                }
            }

            ctx.fillRect(i*TAM_CUADROS, j*TAM_CUADROS, TAM_CUADROS, TAM_CUADROS);
        }
    }
}

function actualizaJuego(){
    dibujaTablero();
    if(estado === 'no_jugando' || estado === 'tablas' || estado === 'resultados') {
        inicializaFichas();
    }
    dibujaFichas();
}

function inicializaJuego(){
    canvas[0].width = canvas.width();
    canvas[0].height = canvas.width();
    TAM_TABLERO = canvas[0].width;
    TAM_CUADROS = TAM_TABLERO/NUM_CASILLAS; //10 casillas
    ctx = canvas[0].getContext("2d");
    defineCasillas();
    limpiaEventos();
    defineEventos();
}

$(window).ready(function() {

    if ($('#juego').length > 0) {

        canvas = $('#tablero');

        if(canvas[0].getContext('2d')){

            ctx = canvas[0].getContext('2d');

            $(window).resize(function(){
                inicializaJuego();
                actualizaJuego();
            });

        }

    }

});

