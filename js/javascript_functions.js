function login() {
    //console.log($('#login_log').value)
    //alert($('#login_log').val() + ' ' + $('#password_log').val());

    $.ajax
    ({
        type: "GET",
        async: true,
        url: '../db/script_connect_user.php',
        data: { login: $('#login_log').val() , password: $('#password_log').val() }
    });
}

function rollDice(maxRoll) {
    $.ajax
    ({
        url: 'ajax/update_dice.php',
        data: { maxRoll: maxRoll},
        success: function (data) {
            console.log(data);
            var json = JSON.parse(data);
            $('#valeurMaxDe').text("Dé de " + json.max);
            $('#chiffre').text(json.value);
        }
    });
}

function updateDice() {
    rollDice(0);
}
