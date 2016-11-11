module.exports = function (io, db) {

    var bcrypt = require('bcrypt');

    /** Variables **/
    var users = [];
    var characters = [];

    var dice = {value: 0, max: 20, characterName: "", skill: "", skillValue: 0};

    /** Functions **/
    function logMYSQL(msg) {
        console.log('MYSQL ' + msg);
    }

    function logSOCKETIO(msg) {
        console.log('SOCKET.IO ' + msg);
    }

    function randomIntInclusive(low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
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

    /** Server actions **/
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

    io.on("connection", function(socket) {
        logSOCKETIO("User connected");
        socket.emit('ready');
        socket.emit("roll dice", dice);

        socket.on("disconnect", function () {
            logSOCKETIO("User disconnected");
        });

        socket.on("roll dice", function (diceParams) {
            logSOCKETIO("Received roll dice request");
            dice.value = randomIntInclusive(1, diceParams.max);
            dice.max = diceParams.max;
            dice.skill = diceParams.skill;
            dice.skillValue = diceParams.skill == "" ? 0 : dice.skillValue;
            io.sockets.emit("roll dice", dice);
            logSOCKETIO("New rolled dice sent (" + dice.value + "/" + dice.max + ")");
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
                bcrypt.compare(loginParams.password, users[userId].password, function (err, res) {
                    if (res) {
                        logSOCKETIO("User connected: " + users[userId].login);
                        var userAndCharacters = {userId: userId, characters: getAllCharactersOfUser(userId)};
                        socket.emit("login", userAndCharacters);
                    } else {
                        logSOCKETIO("Wrong password");
                        socket.emit("invalid credentials");
                    }
                });
            } else {
                logSOCKETIO("Wrong login");
                socket.emit("invalid credentials");
            }
        });

        socket.on("reconnectUser", function (userId) {
            logSOCKETIO("Received reconnect");
            users.forEach(function (e) {
               if(e.id_user == userId) {
                   logSOCKETIO("User reconnected: " + users[userId].login);
                   var userAndCharacters = {userId: userId, characters: getAllCharactersOfUser(userId)};
                   socket.emit("login", userAndCharacters);
               }
            });
        })
    });
};