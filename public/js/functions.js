var socket = io();

var timer = null;
var elapsed = 0;

var BreakException = {};

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
    if(userId != null){
        socket.emit('reconnectUser', userId);
    }
    $('#statsCharacters').html('');
}

function rollDice(maxRoll, skill) {
    var characterId = localStorage.getItem("currentCharacter");
    var saveInBd = document.getElementById("saveInDb").checked;
    var diceParams = {max: maxRoll, skill: skill, characterId: characterId, saveInBd: saveInBd};
    socket.emit("roll dice", diceParams);
}

function selectCharacterClick(characterId) {
    var select = $('#selectCharacter');
    select.val(characterId);
    localStorage.setItem("currentCharacter", characterId);
    var name = select.find('option[value=' + characterId + ']').text();
    $('#characterPlayed').text("Joue avec : " + name);
    $('#displayStatsButtons').show();
}

function addStatsCharacter() {
    updateDisplayCharacter("add");
}

function removeStatsCharacter() {
    updateDisplayCharacter("remove");
}

function updateLifePoints(type, value) {
    updateStat("life_point", type, value);
}

function updateMana(type, value) {
    updateStat("mana", type, value);
}

function updateEphirium(type, value) {
    updateStat("ephirium_tolerance", type, value);
}

function updateStat(stat, type, value) {
    console.log("stat: " + stat + ", type: " + type + ", value: " + value);
    var characterId = localStorage.getItem("currentCharacter");
    if(characterId != null) {
        var statParam = {characterId: characterId, stat: stat, type: type, value: value};
        socket.emit("update character stat", statParam);
    }
}

function updateDisplayCharacter(action) {
    var characterId = localStorage.getItem("currentCharacter");
    if(characterId != null) {
        socket.emit(action + " character", characterId);
    }
}

function hidePanels() {
    $('.connect-zone').show();
    $('.right-panel').hide();
    $('.left-panel').hide();
    $('#displayStatsButtons').hide();
    $('#characterPlayed').text("Joue avec : aucun personnage");
}

function showPanels() {
    $('.connect-zone').hide();
    $('.right-panel').show();
    $('.left-panel').show();
}

function createStatsContainer(characterStats) {
    var html = '<div class="stats" id="stats-' + characterStats.characterId + '" data-id="' + characterStats.characterId + '">' +
        '<p class="nomStat">' + characterStats.name +'</p>' +
        '<div class="statBar healthBar"><div></div><span>' + characterStats.life_point + '/' + characterStats.life_point_max + '</span></div>' +
        '<div class="statBar manaBar"><div></div><span>' + characterStats.mana + '/' + characterStats.mana_max + '</span></div>' +
        '<div class="statBar ephiriumBar"><div></div><span>' + characterStats.ephirium_tolerance + '/' + characterStats.ephirium_tolerance_max + '</span></div>' +
        '</div>';
    $('#statsCharacters').append(html);
    updateStatsContainer($('#stats-' + characterStats.characterId),
        characterStats.life_point,
        characterStats.life_point_max,
        characterStats.mana,
        characterStats.mana_max,
        characterStats.ephirium_tolerance,
        characterStats.ephirium_tolerance_max);
}

function createCameraContainer(characterStats) {
    var cameraTemplate = '<div class="character-slot" id="character-slot-' + characterStats.characterId + '" data-id="' + characterStats.characterId + '">' +
        '<p class="character-name">' + characterStats.name +'</p>' +
        '<div class="camera"></div>' +
        '<div class="statBar healthBar healthBarStream"><div></div><span>' + characterStats.life_point + '/' + characterStats.life_point_max + '</span></div>' +
        '</div>';
    $('#cameraContainer').append(cameraTemplate);
    updateCameraContainer($('#character-slot-' + characterStats.characterId),
        characterStats.life_point,
        characterStats.life_point_max);
}

function updateCameraContainer(container, h, hm) {
    var healthBar = container.find('.healthBar');
    healthBar.find('span').text(h + '/' + hm);
    var prcH = (h*100)/hm;
    healthBar.find('div').css('width', prcH + '%');
}

function updateStatsContainer(container, h, hm, m, mm, e, em){
    var healthBar = container.find('.healthBar');
    healthBar.find('span').text(h + '/' + hm);
    var prcH = (h*100)/hm;
    healthBar.find('div').css('width', prcH + '%');
    var manaBar = container.find('.manaBar');
    manaBar.find('span').text(m + '/' + mm);
    var prcM = (m*100)/mm;
    manaBar.find('div').css('width', prcM + '%');
    var ephiriumBar = container.find('.ephiriumBar');
    ephiriumBar.find('span').text(e + '/' + em);
    var prcE = (e*100)/em;
    ephiriumBar.find('div').css('width', prcE + '%');
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

function startTimer(duration) {
    socket.emit("start timer", duration);
}

function createTimer(duration) {
    clearTimer();
    timer = setInterval(function () {updateTimer(duration)}, 1000);
}

function updateTimer(duration) {
    elapsed++;
    if(elapsed > duration) {
        clearTimer();
    } else {
        updateTimerBar(duration)
    }
}

function updateTimerBar(duration) {
    var value = duration - elapsed;
    var lvl = value * 100 / duration;
    $('#barre').css("width", lvl + "%");
    $('#tempsRestant').text(value + " s");
}

function clearTimer() {
    if(timer != null) {
        clearInterval(timer);
    }
    elapsed = 0;
}

/** SOCKET IO **/
socket.on('ready', function () {
    console.log('Socket.io ready');
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
    //console.log(userAndCharacters);
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
    var characterId = localStorage.getItem("currentCharacter");
    if(characterId != null) {
        selectCharacterClick(characterId);
    } else {
        $('#displayStatsButtons').hide();
    }
});

socket.on("invalid credentials", function () {
    console.log("Login/Mot de passe incorrect");
});

socket.on("add character", function (characterStats) {
    createStatsContainer(characterStats);
    createCameraContainer(characterStats);
});

socket.on("remove character", function (characterId) {
    $('#stats-' + characterId).remove();
    $('#character-slot-' + characterId).remove();
});

socket.on("update character stats", function (characterStats) {
   updateStatsContainer($('#stats-' + characterStats.characterId),
       characterStats.life_point,
       characterStats.life_point_max,
       characterStats.mana,
       characterStats.mana_max,
       characterStats.ephirium_tolerance,
       characterStats.ephirium_tolerance_max);
    updateCameraContainer($('#character-slot-' + characterStats.characterId),
        characterStats.life_point,
        characterStats.life_point_max);
});

socket.on("start timer", function (duration) {
    createTimer(parseInt(duration));
});


