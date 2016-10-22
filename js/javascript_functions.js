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
            if(json.max == json.value) {
                $('.container').addClass("container_success").removeClass("container_fail");
            } else if (json.value == 1){
                $('.container').addClass("container_fail").removeClass("container_success");
            } else {
                $('.container').removeClass("container_fail").removeClass("container_success")
            }
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
    if(type == 0) {
        character.life_point = parseInt(character.life_point) + parseInt(value);
    } else {
        character.life_point = parseInt(character.life_point) - parseInt(value);
    }
    localStorage.setItem("currentCharacter", JSON.stringify(character));
    addCharacter('1', '');
}

function updateMana(value, type) {
    var character = JSON.parse(localStorage.getItem("currentCharacter"));
    if(type == 0) {
        character.mana = parseInt(character.mana) + parseInt(value);
    } else {
        character.mana = parseInt(character.mana)- parseInt(value);
    }
    localStorage.setItem("currentCharacter", JSON.stringify(character));
    addCharacter('1', '');
}

function updateEphirium(value, type) {
    var character = JSON.parse(localStorage.getItem("currentCharacter"));
    if(type == 0) {
        character.ephirium_tolerance = parseInt(character.ephirium_tolerance) + parseInt(value);
    } else {
        character.ephirium_tolerance = parseInt(character.ephirium_tolerance) - parseInt(value);
    }
    localStorage.setItem("currentCharacter", JSON.stringify(character));
    addCharacter('1', '');
}