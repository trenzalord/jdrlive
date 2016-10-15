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
    var userName = null;
    var login = null;
    if(localStorage.getItem("user") != null) {
        var user = JSON.parse(localStorage.getItem("user"));
        userName = user.name;
        login = user.login;
    }
    var saveInBd = document.getElementById("saveInDb").checked;
    $.ajax
    ({
        url: 'ajax/update_dice.php',
        data: { maxRoll: maxRoll, name: userName, login: login, save: saveInBd},
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

function updateBarre(lvl, value) {
    $('#barre').css("width", lvl + "%");
    $('#tempsRestant').text(value + " s");
}

function updateTimer() {
    startTimer(0);
}

function startTimer(duration) {
    var start = $.now();
    $.ajax
    ({
        url: 'ajax/update_time.php',
        data: { duration: duration, start: start},
        success: function (data) {
            var json = JSON.parse(data);
            var currentDate = new Date();
            var startDate = new Date();
            startDate.setTime(json.start);
            var seconds = (currentDate.getTime() - startDate.getTime())/1000;
            seconds = json.duration - seconds;
            if(seconds < 0) {
                seconds = 0;
            }
            seconds = Math.round(seconds);
            var pourcentage = (seconds * 100)/json.duration;
            updateBarre(pourcentage, seconds);
        }
    });
}
