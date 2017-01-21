module.exports = function (io, db) {

    //var bcrypt = require('bcrypt');
    var random = require('random-js')();

    /** Variables **/
    var users = [];
    var characters = [];

    var dice = {value: 0, max: 20, characterName: "", skill: "", skillValue: 0};
    var displayedCharacters = [];

    /** Functions **/
    function logMYSQL(msg) {
        console.log('MYSQL ' + msg);
    }

    function logSOCKETIO(msg) {
        console.log('SOCKET.IO ' + msg);
    }

    function randomIntInclusive(low, high) {
        return random.integer(low, high);
    }

    function testRandom() {
        var numbers = [];
        for(var j = 1; j <= 20; j++) {
            numbers[j-1] = 0;
        }
        logSOCKETIO(numbers);
        for(var i = 0; i < 100000; i++) {
            var rand = randomIntInclusive(1, 20);
            numbers[rand-1] += 1;
        }
        logSOCKETIO(numbers);
    }

    function getAllCharactersOfUser(userId) {
        var userCharacters = [];
        var i = 0;
        characters.forEach(function (element) {
            if(element.character_owner_id == userId) {
                userCharacters[i] = {id: element.id_character, name: element.firstname + ' ' +element.lastname};
                i++;
            }
        });
        return userCharacters;
    }

    function saveDiceRollInDb(dice, userId) {
        var critFail = dice.value == 1 ? 1 : 0;
        var critSuccess = dice.value == dice.max ? 1 : 0;
        var query = 'UPDATE users SET cpt_dice_roll = cpt_dice_roll + 1, ' +
            'cpt_critical_success = cpt_critical_success + ?, ' +
            'cpt_critical_fail = cpt_critical_fail + ? WHERE id_user = ?';
        db.query(query, [critSuccess, critFail, userId], function(err) {
            if(err) {
                logMYSQL('Error saving dice roll:' + err.stack);
            } else {
                logMYSQL('Saved dice roll');
            }
        });
    }

    function saveStatInDb(statName, statChanged, characterId) {
        characterId = parseInt(characterId);
        var query = 'UPDATE characters SET ?? = ? WHERE id_character = ?';
        db.query(query,[statName, statChanged, characterId], function (err) {
            if(err) {
                logMYSQL('Error updating stat: ' + err.stack);
            } else {
                logMYSQL('Updated stat');
            }
        });
    }

    function getValueOfStat(stat, statMax, statRes, type, value) {
        type = parseInt(type);
        switch(type) {
            case 0:
                var resultAdd = parseInt(stat) + parseInt(value);
                if(resultAdd > statMax) {
                    return statMax;
                } else {
                    return resultAdd;
                }
            case 1:
                return stat - value;
            case 2:
                var resultSub = 0;
                if(value > statRes) {
                    resultSub = value - statRes;
                }
                return stat - resultSub;
            default:
                return stat;
        }
    }

    function getStatResistance(statName) {
        switch(statName) {
            case 'life_point':
                return 'damage_resistance';
            case 'ephirium_tolerance':
                return 'ephirium_resistance';
        }
    }

    /** SOCKET IO */
    io.on("connection", function(socket) {
        logSOCKETIO("User connected");
        socket.emit('ready');
        socket.emit("roll dice", dice);
        displayedCharacters.forEach(function(e) {
           socket.emit('add character', e);
        });

        socket.on("disconnect", function () {
            logSOCKETIO("User disconnected");
        });

        socket.on("roll dice", function (diceParams) {
            logSOCKETIO("Received roll dice request");
            var character = characters[diceParams.characterId];
            var skillValue = 0;
            var characterName = 'Personne';

            if(character != null) {
                skillValue = character[diceParams.skill];
                characterName = character.firstname + ' ' + character.lastname;
            }

            dice.skillValue = diceParams.skill == "" ? 0 : skillValue != null ? skillValue : 0;
            dice.value = randomIntInclusive(1, diceParams.max);
            dice.max = diceParams.max;
            dice.skill = diceParams.skill;
            dice.characterName = characterName;

            if(diceParams.saveInBd && character != null) {
                saveDiceRollInDb(dice, character.character_owner_id);
            }

            io.sockets.emit("roll dice", dice);
            var savedMsg = diceParams.saveInBd ? ' and saved in database' : '';
            logSOCKETIO("New rolled dice sent: " + dice.value + "+" + dice.skillValue + "/"
                + dice.max + ' (' + dice.skill + ") by " + dice.characterName
                + savedMsg
            );
        });

        socket.on("login", function (loginParams) {
            var userId = 0;
            logSOCKETIO("Received login request");
            users.forEach(function (element) {
                if(loginParams.login == element.login) {
                    logSOCKETIO("Found user");
                    userId = element.id_user;
                }
            });
            if(userId != 0) {
                logSOCKETIO("User connected: " + users[userId].login);
                var userAndCharacters = {userId: userId, characters: getAllCharactersOfUser(userId)};
                socket.emit("login", userAndCharacters);
                // bcrypt.compare(loginParams.password, users[userId].password, function (err, res) {
                //     if (res) {
                //         logSOCKETIO("User connected: " + users[userId].login);
                //         var userAndCharacters = {userId: userId, characters: getAllCharactersOfUser(userId)};
                //         socket.emit("login", userAndCharacters);
                //     } else {
                //         logSOCKETIO("Wrong password");
                //         socket.emit("invalid credentials");
                //     }
                // });
            } else {
                logSOCKETIO("Wrong login");
                socket.emit("invalid credentials");
            }
        });

        socket.on("reconnectUser", function (userId) {
            logSOCKETIO("Received reconnect");
            if(users[userId] != null) {
                logSOCKETIO("User reconnected: " + users[userId].login);
                var userAndCharacters = {userId: userId, characters: getAllCharactersOfUser(userId)};
                socket.emit("login", userAndCharacters);
            }
        });

        socket.on("add character", function (characterId) {
            logSOCKETIO("Received add character");
            if(displayedCharacters[characterId] == null) {
                var character = characters[characterId];
                if(character != null) {
                    var characterStats = {
                        characterId: characterId,
                        name: character.firstname + ' ' + character.lastname,
                        life_point: character.life_point,
                        life_point_max: character.life_point_max,
                        mana: character.mana,
                        mana_max: character.mana_max,
                        ephirium_tolerance: character.ephirium_tolerance,
                        ephirium_tolerance_max: character.ephirium_tolerance_max
                    };
                    displayedCharacters[characterId] = characterStats;
                    io.sockets.emit("add character", characterStats);
                    logSOCKETIO("Added character " + characterStats.name + " to the display");
                }
            }
        });

        socket.on("remove character", function (characterId) {
            logSOCKETIO("Received remove character");
            if(displayedCharacters[characterId] != null) {
                displayedCharacters.splice(characterId, 1);
                io.sockets.emit("remove character", characterId);
                logSOCKETIO("Removed character " +
                    characters[characterId].firstname + " " + characters[characterId].lastname + " from the display");
            }
        });

        socket.on("update character stat", function (statParam) {
            logSOCKETIO("Received character stat update");
            var character = characters[statParam.characterId];
            if(character != null) {
                var statChanged = getValueOfStat(
                    character[statParam.stat],
                    character[statParam.stat + '_max'],
                    character[getStatResistance(statParam.stat)],
                    statParam.type,
                    statParam.value);
                character[statParam.stat] = statChanged;
                saveStatInDb(statParam.stat, statChanged, statParam.characterId);
                var displayedCharacter = displayedCharacters[statParam.characterId];
                if(displayedCharacter != null) {
                    displayedCharacter[statParam.stat] = statChanged;
                    io.sockets.emit("update character stats", displayedCharacter);
                    logSOCKETIO("Updated character stats for " + displayedCharacter.name);
                }
            }
        });

        socket.on("start timer", function (duration) {
            logSOCKETIO("Received start timer");
            io.sockets.emit("start timer", duration);
        })
    });

    /** Server actions **/
    //testRandom();

    db.connect(function (err) {
        if (err) {
            logMYSQL('Error connecting: ' + err.stack);
            return;
        }

        logMYSQL('Connected');
    });

    db.query('SELECT * FROM users', function (err, results) {
        if (err) {
            logMYSQL('Could not get users: ' + err.stack);
            return [];
        }
        logMYSQL("Retrieved users");
        results.forEach(function (e) {
            users[e.id_user] = e;
        });
    });

    db.query('SELECT * FROM characters', function (err, results) {
        if (err) {
            logMYSQL('Could not get characters: ' + err.stack);
            return [];
        }
        logMYSQL("Retrieved characters");
        results.forEach(function (e) {
            characters[e.id_character] = e;
        });
    });
};