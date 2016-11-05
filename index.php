<!DOCTYPE html>
<?php
include "bd_connect.php";
$query = "SELECT * FROM characters;";
$stm = $bd->prepare($query);
$stm->execute();
$res = $stm->get_result();
$characters = [];
while ($row = $res->fetch_assoc()){
    $characters[$row['id_character']] = $row;
}
?>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Nemesia</title>

    <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8="  crossorigin="anonymous"></script>

    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
          integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
          crossorigin="anonymous">

    <!-- Optional theme -->
    <link rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css"
          integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp"
          crossorigin="anonymous">

    <!-- Latest compiled and minified JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
            integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa"
            crossorigin="anonymous"></script>

    <link rel="stylesheet" media="screen" type="text/css" href="css/global.css">
    <link rel="stylesheet" media="screen" type="text/css" href="css/fonts.css">
    <link rel="stylesheet" media="screen" type="text/css" href="css/all.css">
    <link rel="stylesheet" media="screen" type="text/css" href="css/de.css">
    <script src="js/javascript_functions.js"></script>
</head>

<body>
<?php if($bdConnected){ ?>

    <div class="col-md-4">
        <div class="left-panel">
            <div class="ctrl-panel col-md-12">
                <div class="in-ctrl-panel">
                    <form target="_blank" action="consultation_character.php" method="get">
                        <select onchange="this.form.submit()" title="Personnages" class="form-control" id="selectPersonnage" name="id_character">
                            <?php foreach($characters as $char) { ?>
                                <option value="<?= $char['id_character'] ?>"><?= $char['firstname'] . " " . $char['lastname'] ?></option>
                            <?php } ?>
                        </select>
                    </form>
                </div>
            </div>
            <div class="ctrl-panel col-md-12">
                <div class="in-ctrl-panel">
                    <form class="form-inline">
                        <input class="form-control" title="Temps désiré" type="number" min="0" id="timerTime"/>
                        <button class="btn btn-default" type="button" onclick="startTimer($('#timerTime').val())">Démarrer</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-4 vue-zone">
        <div class="connect-zone">
            <form class="form-inline">
                <input type="text" class="form-control" name="login" placeholder="Nom d'utilisateur" id="login_log"/>
                <input type="password" class="form-control" name="mdp" placeholder="Mots de passe" id="password_log"/>
                <button id="button_log" type="button" class="btn btn-default" onclick="loginTest()">Valider</button>
            </form>
        </div>
        <div id="timerBar">
            <div id="barre"></div>
            <span id="tempsRestant">64 s</span>
        </div>
        <div class="container container_dice">
            <p class="descriptionChiffre" id="utilisateurAffiche">Billy</p>
            <p class="sousDescriptionChiffre" id="typeLance">Lancé de Dexterité</p>
            <p id="chiffre">20</p>
            <p class="sousDescriptionChiffre" id="detailLance">10+2</p>
            <p class="descriptionChiffre" id="valeurMaxDe">Dé de 20</p>
        </div>
        <div id="statsCharacters">

        </div>
    </div>
    <div class="col-md-4">
        <div class="right-panel">
            <div class="ctrl-panel col-md-12">
                <div class="in-ctrl-panel">
                    <form class="form-inline">
                        <select class="form-control" title="Personnage" id="selectCharacter">
                        </select>
                        <button class="btn btn-default" type="button" onclick="selectCharacterClick($('#selectCharacter').val())">
                            Sélectionner
                        </button>
                    </form>
                    <div style="position: absolute; right: 40px; top: 40px;">
                        <button class="btn btn-default" onClick="disconnect()">
                            Déconnecter
                        </button>
                    </div>
                    <br>
                    <p id="characterPlayed">Joue avec : aucun personnage</p>
                    <br>
                    <div id="displayStatsButtons">
                        <button class="btn btn-default" onclick="addCharacter('1', '0')">Afficher les stats</button>
                        <button class="btn btn-default" onclick="addCharacter('1', '1')">Cacher les stats</button>
                        <form class="form-inline">
                            <input class="form-control" title="Vie" min="0" type="number" id="valeurHealth" placeholder="Vie"/>
                            <select class="form-control" title="type" id="selectHealth">
                                <option value="0">Ajouter</option>
                                <option value="1">Retirer</option>
                                <option value="2">Retirer avec resistance</option>
                            </select>
                            <button type="button" class="btn btn-default" onclick="updateHealth($('#valeurHealth').val(), $('#selectHealth').val())">
                                OK
                            </button>
                        </form>
                        <form class="form-inline">
                            <input class="form-control" title="Mana" min="0" type="number" id="valeurMana" placeholder="Mana"/>
                            <select class="form-control" title="type" id="selectMana">
                                <option value="0">Ajouter</option>
                                <option value="1">Retirer</option>
                            </select>
                            <button type="button" class="btn btn-default" onclick="updateMana($('#valeurMana').val(), $('#selectMana').val())">
                                OK
                            </button>
                        </form>
                        <form class="form-inline">
                            <input class="form-control" title="Ephirium" min="0" type="number" id="valeurEphirium" placeholder="Ephirium"/>
                            <select class="form-control" title="type" id="selectEphirium">
                                <option value="0">Ajouter</option>
                                <option value="1">Retirer</option>
                                <option value="2">Retirer avec resistance</option>
                            </select>
                            <button type="button" class="btn btn-default" onclick="updateEphirium($('#valeurEphirium').val(), $('#selectEphirium').val())">
                                OK
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="ctrl-panel col-md-12">
                <div class="in-ctrl-panel">
                    <div class="col-md-12 dice-line">
                        <form class="form-inline">
                            <select title="Sélectionner votre compétence" id="selectCompetence" class="form-control">
                                <option value="0">Aucune</option>
                                <option value="strengh">Force</option>
                                <option value="intelligence">Intelligence</option>
                                <option value="dexterity">Dexterité</option>
                                <option value="charism">Charisme</option>
                                <option value="precision">Précision</option>
                                <option value="courage">Courage</option>
                                <option value="speed">Rapidité</option>
                                <option value="wisdom">Sagesse</option>
                                <option value="endurance">Endurance</option>
                                <option value="perception">Perception</option>
                                <option value="constitution">Constitution</option>
                            </select>
                            <input title="Sauvegarder en BD" type="checkbox" id="saveInDb"/>
                            <button type="button" class="btn btn-default btn-dice" onclick="rollDice(20, $('#selectCompetence').val())">
                                <img src="img/d20.png" alt="d20" class="img-btn">
                            </button>
                        </form>
                    </div>
                    <div class="col-md-12 dice-line">
                        <button class="btn btn-default btn-dice" onclick="rollDice(10, '0')">
                            <img src="img/d10.png" alt="d10" class="img-btn">
                        </button>
                        <input title="Valeur de dé désiré" type="number" class="select-dice" id="select-dice"/>
                        <button class="btn btn-default btn-dice" onclick="rollDice($('#select-dice').val(), '0')">
                            Roll
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        autoConnect();
        setInterval(updateStats, 500);
        setInterval(updateTimer, 500);
        setInterval(updateDice, 500);
    </script>
<?php } ?>

</body>

</html>
