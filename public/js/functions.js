var socket = io();

/** FUNCTIONS**/
function userConnect() {
    var loginParams = { login: $('#login_log').val() , password: $('#password_log').val() };
    socket.emit('login', loginParams);
}

function userDisconnect() {
    localStorage.clear();
    hidePanels();
}

function userReconnect() {
    var userId = localStorage.getItem("userId");
    console.log('Reconnecting with id ' + userId + '...');
    if(userId != null){
        console.log('userID != null');
        socket.emit('reconnectUser', userId);
    }
}

function rollDice(maxRoll, skill) {
    var diceParams = {max: maxRoll, skill: skill};
    socket.emit("roll dice", diceParams);
}

function hidePanels() {
    $('.connect-zone').show();
    $('.right-panel').hide();
    $('.left-panel').hide();
}

function showPanels() {
    $('.connect-zone').hide();
    $('.right-panel').show();
    $('.left-panel').show();
}

function getSkillNameOfSkill(skill) {
    switch (skill) {
        case "0":
            return "";
        case "strengh":
            return "Force";
        case "intelligence":
            return "Intelligence";
        case "dexterity":
            return "Dexterité";
        case "charism":
            return "Charisme";
        case "precision":
            return "Précision";
        case "courage":
            return "Courage";
        case "speed":
            return "Rapidité";
        case "wisdom":
            return "Sagesse";
        case "endurance":
            return "Endurance";
        case "perception":
            return "Perception";
        case "constitution":
            return "Constitution";
        default:
            return "";
    }
}

/** SOCKET IO **/
socket.on('ready', function () {
    console.log('ready');
    userReconnect();
});
socket.on("roll dice", function(dice) {
    if(dice.max == dice.value) {
        $('#chiffre').text(dice.value);
        $('.container').addClass("container_success").removeClass("container_fail");
        $('#detailLance').text("Réussite critique");
    } else if (dice.value == 1){
        $('#chiffre').text(dice.value);
        $('.container').addClass("container_fail").removeClass("container_success");
        $('#detailLance').text("Échec critique");
    } else {
        if(dice.skillValue != 0) {
            $('#detailLance').text(dice.value + " + " + dice.skillValue);
        } else {
            $('#detailLance').text("");
        }
        $('#chiffre').text(parseInt(dice.value) + parseInt(dice.skillValue));
        $('.container').removeClass("container_fail").removeClass("container_success")
    }
    $('#valeurMaxDe').text("Dé de " + dice.max);
    var skillNameText = getSkillNameOfSkill(dice.skill);
    if(skillNameText != "") {
        $('#typeLance').text("Test de " + skillNameText);
    } else {
        $('#typeLance').text("");
    }
    $('#utilisateurAffiche').text(dice.characterName);
});

socket.on("login", function(userAndCharacters) {
    console.log("Connecté");
    console.log(userAndCharacters);
    localStorage.setItem("userId", userAndCharacters.userId);
    var select = $('#selectCharacter');
    select.html('');
    userAndCharacters.characters.forEach(function (element) {
        select.append($('<option>', {
            value: element.id,
            text: element.name
        }));
    });
    showPanels();
});

socket.on("invalid credentials", function () {
    console.log("Login/Mot de passe incorrect");
});


