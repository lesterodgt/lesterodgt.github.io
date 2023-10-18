$(function(){
    $("#btnGuardar").click(function(){
        var password = $("#password").val();
        var passwordConfirma = $("#password_confirma").val();
        if(password !== passwordConfirma){
            $(".alert-warning").toggleClass("d-none");
            return!1
        }
    });
}); 