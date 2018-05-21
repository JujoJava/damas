function botonRueda(elem) {
    $(elem).css({
        'min-width': $(elem).outerWidth()
    });
    $(elem).html("<i class='fas fa-spinner fa-spin'></i>");
    $(elem).attr("disabled", true);
}

function botonNormal(elem,texto) {
    $(elem).html("<span>"+texto+"</span>");
    $(elem).attr("disabled", false);
}

function mostrarError(elem, texto) {
    var el = elem.siblings('div.invalid-feedback');
    el.html(texto);
    el.show(300);
}

function ocultarError(elem){
    elem.siblings('div.invalid-feedback').hide(300);
}

function existeError(elem){
    return elem.siblings('div.invalid-feedback').html() !== '';
}

function ocultarErrores(){
    $('div.invalid-feedback').hide();
}