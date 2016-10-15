function login() {
    //console.log($('#login_log').value)
    //alert($('#login_log').val() + ' ' + $('#password_log').val());

    $.ajax
    ({
        url: 'ajax/connect_user.php',
        data: { login: $('#login_log').val() , password: $('#password_log').val() },
        success: function (data) {
            if(data != 0){
                localStorage.setItem("user", data);
                connect();
            }
        }
    });
}

function autoConnect() {
    var user = JSON.parse(localStorage.getItem("user"));
    if(user != null){
        connect();
    }else{
        disconnect();
    }
}

function disconnect() {
    localStorage.clear();
    $('.connect-zone').show();
    $('.right-panel').hide();
    $('.left-panel').hide();
}

function connect() {
    $('.connect-zone').hide();
    $('.right-panel').show();
    $('.left-panel').show();
}

function rollDice(maxRoll) {
    var userName = JSON.parse(localStorage.getItem("user")).name;
    $.ajax
    ({
        url: 'ajax/update_dice.php',
        data: { maxRoll: maxRoll, name: userName},
        success: function (data) {
            console.log(data);
            var json = JSON.parse(data);
            $('#valeurMaxDe').text("Dé de " + json.max);
            $('#chiffre').text(json.value);
            $('#utilisateurAffiche').text(json.user);
        }
    });
}

function updateDice() {
    rollDice(0);
}
