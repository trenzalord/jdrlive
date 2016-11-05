function loginTest() {
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
    updateCharactersList();
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
    $('#selectCharacter').html('');
    $('#statsCharacters').html('');
    $('#characterPlayed').text("Joue avec : auncun personnage");
    $('#displayStatsButtons').hide();
    updateCharactersList();
}

function connect() {
    $('.connect-zone').hide();
    $('.right-panel').show();
    $('.left-panel').show();
    $('#displayStatsButtons').hide();
    updateCharactersList();
}

function rollDice(maxRoll, skill) {
    var userName = null;
    var login = null;
    var skillValue = 0;
    if(localStorage.getItem("user") != null) {
        var user = JSON.parse(localStorage.getItem("user"));
        login = user.login;
        if(localStorage.getItem("currentCharacter") != null) {
            var currentCharacter = JSON.parse(localStorage.getItem("currentCharacter"));
            skillValue = getValeOfSkill(skill, currentCharacter);
            userName = currentCharacter.firstname + " " + currentCharacter.lastname;
        }
    }
    var saveInBd = document.getElementById("saveInDb").checked;
    $.ajax
    ({
        url: 'ajax/update_dice.php',
        data: { maxRoll: maxRoll, name: userName, login: login, save: saveInBd, skill: skill, skillValue: skillValue},
        success: function (data) {
            console.log(data);
            var json = JSON.parse(data);
            if(json.max == json.value) {
                $('#chiffre').text(json.value);
                $('.container').addClass("container_success").removeClass("container_fail");
                $('#detailLance').text("Réussite critique");
            } else if (json.value == 1){
                $('#chiffre').text(json.value);
                $('.container').addClass("container_fail").removeClass("container_success");
                $('#detailLance').text("Échec critique");
            } else {
                if(json.skillValue != 0) {
                    $('#detailLance').text(json.value + " + " + json.skillValue);
                } else {
                    $('#detailLance').text("");
                }
                $('#chiffre').text(parseInt(json.value) + parseInt(json.skillValue));
                $('.container').removeClass("container_fail").removeClass("container_success")
            }
            $('#valeurMaxDe').text("Dé de " + json.max);
            var skillNameText = getSkillNameOfSkill(json.skill);
            if(skillNameText != "") {
                $('#typeLance').text("Test de " + skillNameText);
            } else {
                $('#typeLance').text("");
            }
            $('#utilisateurAffiche').text(json.user);
        }
    });
}

function getValeOfSkill(skill, character) {
    switch(skill) {
        case "0":
            return 0;
        case "strengh":
            return character.strengh;
        case "intelligence":
            return character.intelligence;
        case "dexterity":
            return character.dexterity;
        case "charism":
            return character.charism;
        case "precision":
            return character.precision;
        case "courage":
            return character.courage;
        case "speed":
            return character.speed;
        case "wisdom":
            return character.wisdom;
        case "endurance":
            return character.endurance;
        case "perception":
            return character.perception;
        default:
            return 0;
    }
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
        default:
            return "";
    }
}

function updateDice() {
    rollDice(0, "0");
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

function updateCharactersList() {
    var user = JSON.parse(localStorage.getItem("user"));
    var userID = "";
    if(user != null) {
        userID = user.id_user;
    }
    var select = $('#selectCharacter');
    $.ajax({
        url: 'ajax/get_characters.php',
        success: function (data) {
            var json = JSON.parse(data);
            $.each(json, function (i, item) {
                if(item.character_owner_id == userID) {
                    select.append($('<option>', {
                        value: item.id_character,
                        text: item.firstname + ' ' + item.lastname
                    }));
                }
            });
            localStorage.setItem("characters", data);
        }
    });
    updatePlayWith();
}

function selectCharacterClick(index) {
    var characters = JSON.parse(localStorage.getItem("characters"));
    localStorage.setItem("currentCharacter", JSON.stringify(characters[index]));
    updatePlayWith();
}

function updatePlayWith() {
    if(localStorage.getItem("currentCharacter") != null) {
        var currentCharacter = JSON.parse(localStorage.getItem("currentCharacter"));
        var characters = JSON.parse(localStorage.getItem("characters"));
        $('#characterPlayed').text("Joue avec : " + characters[currentCharacter.id_character].firstname + ' ' + characters[currentCharacter.id_character].lastname);
        $('#displayStatsButtons').show();
    }
}

function addCharacter(update, remove) {
    var character = JSON.parse(localStorage.getItem("currentCharacter"));
    var charId = "";
    var lifePoint = "";
    var mana = "";
    var ephirium = "";
    if(character != null){
        charId = character.id_character;
        lifePoint = character.life_point;
        mana = character.mana;
        ephirium = character.ephirium_tolerance;
    }
    $.ajax({
        url: 'ajax/update_characters.php',
        data: {indexCharacter: charId, health: lifePoint, mana: mana, ephirium: ephirium, update: update, remove: remove},
        success: function (data) {
            var json = JSON.parse(data);
            $.each(json.characters, function (i, item) {
                var container = $('#stats-' + i);
                if(container.length != 0) {
                    updateContainer(container, i, item);
                } else {
                    createContainer(i, item);
                }
            });
            $.each($('.stats'), function (i, item) {
                var id = $(item).data("id");
                if(typeof json.characters[id] === 'undefined') {
                    $('#stats-' + id).remove();
                }
            });
        }
    });
}

function updateStats(){
    addCharacter('', '');
}

function updateContainer(container, i, item) {
    var character = JSON.parse(localStorage.getItem("characters"))[i];
    updateBarsForCharacter($('#stats-' + i), item.health, character.life_point_max, item.mana, character.mana_max, item.ephirium, character.ephirium_tolerance_max);
}

function createContainer(i, item) {
    var character = JSON.parse(localStorage.getItem("characters"))[i];
    html = '<div class="stats" id="stats-' + i + '" data-id="' + i + '">' +
        '<p class="nomStat">' + character.firstname + ' ' + character.lastname +'</p>' +
        '<div class="statBar healthBar"><div></div><span>' + item.health + '/' + character.life_point_max + '</span></div>' +
        '<div class="statBar manaBar"><div></div><span>' + item.mana + '/' + character.mana_max + '</span></div>' +
        '<div class="statBar ephiriumBar"><div></div><span>' + item.ephirium + '/' + character.ephirium_tolerance_max + '</span></div>' +
        '</div>';
    $('#statsCharacters').append(html);
    updateBarsForCharacter($('#stats-' + i), item.health, character.life_point_max, item.mana, character.mana_max, item.ephirium, character.ephirium_tolerance_max);
}

function updateBarsForCharacter(container, h, hm, m, mm, e, em){
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

function updateHealth(value, type) {
    var character = JSON.parse(localStorage.getItem("currentCharacter"));
    switch (type) {
        case "0":
            var ajout = parseInt(character.life_point) + parseInt(value);
            if (ajout > parseInt(character.life_point_max)) {
                character.life_point = character.life_point_max;
            } else {
                character.life_point = ajout;
            }
            break;
        case "1":
            character.life_point = parseInt(character.life_point) - parseInt(value);
            break;
        case "2":
            var valueInt = parseInt(value);
            var resistance = parseInt(character.damage_resistance);
            var valeurFinale = 0;
            if (valueInt > resistance) {
                valeurFinale = valueInt - resistance;
            } else {
                valeurFinale = 0;
            }
            character.life_point = parseInt(character.life_point) - valeurFinale;
            break;
    }
    localStorage.setItem("currentCharacter", JSON.stringify(character));
    addCharacter('1', '');
}

function updateMana(value, type) {
    var character = JSON.parse(localStorage.getItem("currentCharacter"));
    if(type == 0) {
        var ajout = parseInt(character.mana) + parseInt(value);
        if (ajout > parseInt(character.mana_max)) {
            character.mana = character.mana_max;
        } else {
            character.mana = ajout;
        }
    } else {
        character.mana = parseInt(character.mana)- parseInt(value);
    }
    localStorage.setItem("currentCharacter", JSON.stringify(character));
    addCharacter('1', '');
}

function updateEphirium(value, type) {
    var character = JSON.parse(localStorage.getItem("currentCharacter"));
    switch (type) {
        case "0":
            var ajout = parseInt(character.ephirium_tolerance) + parseInt(value);
            if(ajout > parseInt(character.ephirium_tolerance_max)) {
                character.ephirium_tolerance = parseInt(character.ephirium_tolerance_max);
            } else {
                character.ephirium_tolerance = ajout;
            }
            break;
        case "1":
            character.ephirium_tolerance = parseInt(character.ephirium_tolerance) - parseInt(value);
            break;
        case "2":
            var valueInt = parseInt(value);
            var resistance = parseInt(character.ephirium_resistance);
            var valeurFinale = 0;
            if (valueInt > resistance) {
                valeurFinale = valueInt - resistance;
            } else {
                valeurFinale = 0;
            }
            character.ephirium_tolerance = parseInt(character.ephirium_tolerance) - valeurFinale;
            break
    }
    localStorage.setItem("currentCharacter", JSON.stringify(character));
    addCharacter('1', '');
}