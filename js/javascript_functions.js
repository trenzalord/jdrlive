function loggin() {
    //console.log($('#login_log').value)
    //alert($('#login_log').val() + ' ' + $('#password_log').val());

    $.ajax
    ({
        type: "GET",
        async: true,
        url: 'http://localhost/nemesia_v3/db/script_connect_user.php',
        data: { login: $('#login_log').val() , password: $('#password_log').val() },
        success: function () { },
        failure: function() { }
    });
}
