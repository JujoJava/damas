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
var FICHA_MOV = new Image();
FICHA_MOV.src = "img/ficha_mov.png";
var CUADRO_SELECT = new Image();
CUADRO_SELECT.src = "img/cuadro_select.png";

// variables //
var estado = 'no_jugando';
var fichas = []; //array con las posiciones de las fichas
var movimientos = []; //array de objetos
var casillas = []; //diccionario de las casillas y sus posiciones reales en el cliente
var canvas;
var ctx;
var mis_datos = null; //objeto con mis datos
var anfitrion = false;
var visitante = false;
var turno = '';

var posibles_movimientos = [];
var ficha_seleccionada = false;
var raton_down = false;
var cuadro_hover = false;
var movimientos_generados = false;
var mousePos = {};

var fichas_blancas = 12;
var fichas_negras = 12;

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

function getMovDer(orientacion, posicion){
    var numPos = generaNumPosicion(posicion);
    if (orientacion === 'blancas') {
        if(typeof fichas[numPos.y-1][numPos.x+1] !== 'undefined'){
            return fichas[numPos.y-1][numPos.x+1];
        }
    } else {
        if(typeof fichas[numPos.y+1][numPos.x-1] !== 'undefined'){
            return fichas[numPos.y+1][numPos.x-1];
        }
    }
    return false;
}
function getMovIzq(orientacion, posicion){
    var numPos = generaNumPosicion(posicion);
    if (orientacion === 'blancas') {
        if(typeof fichas[numPos.y-1][numPos.x-1] !== 'undefined') {
            return fichas[numPos.y - 1][numPos.x - 1];
        }
    } else {
        if(typeof fichas[numPos.y+1][numPos.x+1]) {
            return fichas[numPos.y+1][numPos.x+1];
        }
    }
    return false;
}

function comidaEnCadenaIzq(fichaMov, fichaComer, movimientos, comidas, orientacion){
    var casillaLibre, mov;
    casillaLibre = getMovIzq(fichaMov.color, fichaComer.posicion);
    if(casillaLibre) {
        if (casillaLibre.numFicha === -1) { //se la puede comer

            comidas.push(fichaComer);
            movimientos.push({comidas: comidas, movimiento: casillaLibre});

            mov = getMovIzq(fichaMov.color, casillaLibre.posicion);
            if (mov) {
                if (mov.color !== fichaMov.color && mov.numFicha !== -1) { //posibilidad de comerse otra ficha
                    comidas.push(fichaComer);
                    movimientos.push({comidas: comidas, movimiento: casillaLibre});
                    movimientos = comidaEnCadenaIzq(fichaMov, mov, movimientos, comidas, 'ambos');
                }
            }
            if(orientacion === 'ambos') {
                mov = getMovDer(fichaMov.color, casillaLibre.posicion);
                if (mov) {
                    if (mov.color !== fichaMov.color && mov.numFicha !== -1) { //posibilidad de comerse otra ficha
                        movimientos = comidaEnCadenaDer(fichaMov, mov, movimientos, comidas, 'ambos');
                    }
                }
            }
        }
    }
    return movimientos;
}
function comidaEnCadenaDer(fichaMov, fichaComer, movimientos, comidas, orientacion){
    var casillaLibre, mov;
    casillaLibre = getMovDer(fichaMov.color, fichaComer.posicion);
    if(casillaLibre) {
        if (casillaLibre.numFicha === -1) { //se la puede comer

            comidas.push(fichaComer);
            movimientos.push({comidas: comidas, movimiento: casillaLibre});

            if(orientacion === 'ambos') {
                mov = getMovIzq(fichaMov.color, casillaLibre.posicion);
                if (mov) {
                    if (mov.color !== fichaMov.color && mov.numFicha !== -1) { //posibilidad de comerse otra ficha
                        comidas.push(fichaComer);
                        movimientos.push({comidas: comidas, movimiento: casillaLibre});
                        movimientos = comidaEnCadenaIzq(fichaMov, mov, movimientos, comidas, 'ambos');
                    }
                }
            }
            mov = getMovDer(fichaMov.color, casillaLibre.posicion);
            if (mov) {
                if (mov.color !== fichaMov.color && mov.numFicha !== -1) { //posibilidad de comerse otra ficha
                    movimientos = comidaEnCadenaDer(fichaMov, mov, movimientos, comidas, 'ambos');
                }
            }
        }
    }
    return movimientos;
}

function generaPosiblesMovimientos(){
    var mov;
    if(ficha_seleccionada){
        if(ficha_seleccionada.tipo === 'normal'){ //si es un peón...
            mov = getMovIzq(ficha_seleccionada.color, ficha_seleccionada.posicion);
            if(mov) {
                if (mov.numFicha !== -1) { //hay una ficha enfrente
                    if (mov.color !== ficha_seleccionada.color) { //posibilidad de comerse una ficha
                        mov = comidaEnCadenaIzq(ficha_seleccionada, mov, [], [], '');
                        for (var i = 0; i < mov.length; i++) {
                            posibles_movimientos.push(mov[i]);
                        }
                    }
                } else { //hay un espacio enfrente
                    posibles_movimientos.push({comidas: [], movimiento: mov})
                }
            }

            mov = getMovDer(ficha_seleccionada.color, ficha_seleccionada.posicion);
            if(mov) {
                if (mov.numFicha !== -1) { //hay una ficha enfrente
                    if (mov.color !== ficha_seleccionada.color) { //posibilidad de comerse una ficha
                        mov = comidaEnCadenaDer(ficha_seleccionada, mov, [], [], '');
                        for (var j = 0; j < mov.length; j++) {
                            posibles_movimientos.push(mov[j]);
                        }
                    }
                } else { //hay un espacio enfrente
                    posibles_movimientos.push({comidas: [], movimiento: mov})
                }
            }

        }
    }
}

function defineEventos(){
    canvas.on('selectstart', function(e) { e.preventDefault(); return false; }, false);
    canvas.on('mouseleave', function(){
        raton_down = false;
        cuadro_hover = false;
        actualizaJuego();
    });
    canvas.on('mousemove', function(e) {
        cuadro_hover = false;
        for(var i = 0 ; i < NUM_CASILLAS ; i++){
            for(var j = 0 ; j < NUM_CASILLAS ; j++){
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
    canvas.on('mousedown', function() {
        var otra_ficha = true;
        if(miTurno()) {
            if (ficha_seleccionada) {
                for (var k = 0; k < posibles_movimientos.length; k++) {
                    if (posibles_movimientos[k].movimiento.posicion === obtieneCasilla(mousePos.x, mousePos.y)) {
                        addMovimiento(posibles_movimientos[k].comidas, posibles_movimientos[k].movimiento, ficha_seleccionada);
                        cambiaTurno();
                        ajaxMovimiento(posibles_movimientos[k], ficha_seleccionada);
                        ficha_seleccionada = false;
                        posibles_movimientos = [];
                        otra_ficha = false;
                    }
                }
            }
            if(otra_ficha) {
                ficha_seleccionada = false;
                posibles_movimientos = [];
                for (var i = 0; i < NUM_CASILLAS; i++) {
                    for (var j = 0; j < NUM_CASILLAS; j++) {
                        if (fichas[i][j].posicion === obtieneCasilla(mousePos.x, mousePos.y)) {
                            if (fichas[i][j].color === mis_datos.color) {
                                ficha_seleccionada = fichas[i][j];
                                generaPosiblesMovimientos();
                                raton_down = true;
                            }
                        }
                    }
                }
            }
            actualizaJuego();
        }
    });
    canvas.on('mouseup', function() {
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
    for(var i = 0 ; i < fichas.length ; i++){
        for(var j = 0 ; j < fichas[i].length ; j++){
            if(fichas[i][j].numFicha == numficha && fichas[i][j].color === color){
                return fichas[i][j];
            }
        }
    }
    return false;
}

function hayNuevoMovimiento(mov){
    var comidas;
    var color_comida = '';
    movimientos = []; //vaciamos el array para volverlo a llenar
    for(var i = 0 ; i < mov.length ; i++){
        comidas = mov[i].comidas;
        var ficha = obtieneFicha(Number(mov[i].numficha), mov[i].color);
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
    var ficha_aux = '';
    for(var i = 0 ; i < NUM_CASILLAS ; i++){
        for(var j = 0 ; j < NUM_CASILLAS ; j++){
            ficha_aux = fichas[i][j];
            if(ficha_aux.posicion === ficha.posicion){
                fichas[i][j] = espacioVacio(ficha.posicion);
            }
            if(ficha_aux.posicion === movimiento.posicion){
                fichas[i][j].color = ficha.color;
                fichas[i][j].tipo = ficha.tipo;
                fichas[i][j].numFicha = ficha.numFicha;
            }
            for(var k = 0 ; k < comidas.length ; k++){
                if(ficha_aux.posicion === comidas[k].posicion){
                    restaFicha(ficha_aux.color);
                    fichas[i][j] = espacioVacio(comidas[k].posicion);
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

function cambiaTurno(){
    switch(turno){
        case 'blancas':
            turno = 'negras';
            break;
        case 'negras':
            turno = 'blancas';
            break;
    }
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

function dibujaFicha(color, x, y, w, h){
    switch(color){
        case 'blancas':
            ctx.drawImage(FICHA_BLANCA, x, y, w, h);
            break;
        case 'negras':
            ctx.drawImage(FICHA_NEGRA, x, y, w, h);
            break;
    }
}

function dibujaFichas(){
    var ficha_drag = false;
    for(var i = 0 ; i < NUM_CASILLAS ; i++){
        for(var j = 0 ; j < NUM_CASILLAS ; j++){
            // dibujos sobre todas las fichas, excepto la que esté siendo arrastrada //
            if(ficha_seleccionada && raton_down){
                if(ficha_seleccionada.color !== fichas[i][j].color || ficha_seleccionada.numFicha !== fichas[i][j].numFicha){
                    dibujaFicha(fichas[i][j].color, j*TAM_CUADROS, i*TAM_CUADROS, TAM_CUADROS, TAM_CUADROS);
                }
            } else {
                dibujaFicha(fichas[i][j].color, j*TAM_CUADROS, i*TAM_CUADROS, TAM_CUADROS, TAM_CUADROS);
            }

            // dibujos sobre la ficha seleccionada //
            if(ficha_seleccionada) {
                if(ficha_seleccionada.numFicha === fichas[i][j].numFicha && fichas[i][j].color === ficha_seleccionada.color){
                    if(!raton_down){
                        ctx.drawImage(FICHA_SELECT, j*TAM_CUADROS, i*TAM_CUADROS, TAM_CUADROS, TAM_CUADROS);
                    } else {
                        ficha_drag = fichas[i][j];
                    }
                }
            }
            // dibujos sobre los posibles movimientos de una ficha seleccionada //
            for(var k = 0 ; k < posibles_movimientos.length ; k++){
                if(posibles_movimientos[k].movimiento.posicion === fichas[i][j].posicion){
                    ctx.drawImage(FICHA_MOV, j*TAM_CUADROS, i*TAM_CUADROS, TAM_CUADROS, TAM_CUADROS);
                    if(cuadro_hover){
                        if(fichas[i][j].posicion === cuadro_hover.posicion){
                            ctx.drawImage(CUADRO_SELECT, j*TAM_CUADROS, i*TAM_CUADROS, TAM_CUADROS, TAM_CUADROS);
                        }
                    }
                }
            }
        }
    }
    // dibujo de arrastre de la ficha seleccionada //
    if(ficha_drag) {
        var diferencia = (TAM_CUADROS/2);
        dibujaFicha(ficha_drag.color, mousePos.x - diferencia, mousePos.y - diferencia, TAM_CUADROS, TAM_CUADROS);
        ctx.drawImage(FICHA_SELECT, mousePos.x - diferencia, mousePos.y - diferencia, TAM_CUADROS, TAM_CUADROS);
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
    switch (estado) {
        case 'no_jugando':
            inicializaFichas();
            break;
        case 'jugando':
            break;
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
    defineEventos();
}

$(window).ready(function() {

    if ($('#juego').length > 0) {

        canvas = $('#tablero');

        if(canvas[0].getContext('2d')){

            ctx = canvas[0].getContext('2d');

            $(window).resize(function(){
                if(mis_datos !== null && estado === 'jugando') {
                    inicializaJuego();
                    actualizaJuego();
                }
            });

        }

    }

});

