<!DOCTYPE html>
<?php
include "bd_connect.php";
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
                </div>
            </div>
            <div class="ctrl-panel col-md-12">
                <div class="in-ctrl-panel">
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-4 vue-zone">
        <div class="connect-zone">
            <input type="text" name="login" placeholder="Nom d'utilisateur" id="login_log"/>
            <input type="password" name="mdp" placeholder="Mots de passe" id="password_log"/>
            <button id="button_log" onclick="login()">Valider</button>
        </div>
        <div class="container container_dice">
            <p class="descriptionChiffre" id="utilisateurAffiche">Billy</p>
            <p id="chiffre">20</p>
            <p class="descriptionChiffre" id="valeurMaxDe">Dé de 20</p>
        </div>
    </div>
    <div class="col-md-4">
        <div class="right-panel">
            <div class="ctrl-panel col-md-12">
                <div class="in-ctrl-panel">

                </div>
            </div>
            <div class="ctrl-panel col-md-12">
                <div class="in-ctrl-panel">
                    <div class="col-md-12 dice-line">
                        <button class="btn btn-default btn-dice" onclick="rollDice(20)">
                            <img src="img/d20.png" alt="d20" class="img-btn">
                        </button>
                        <button class="btn btn-default btn-dice" onclick="rollDice(10)">
                            <img src="img/d10.png" alt="d10" class="img-btn">
                        </button>
                        <input title="Valeur de dé désiré" type="number" class="select-dice" id="select-dice"/>
                        <input title="Sauvegarder en BD" type="checkbox" id="saveInDb"/>
                        <button class="btn btn-default btn-dice" onclick="rollDice($('#select-dice').val())">
                            Roll
                        </button>
                        <button class="btn btn-default" onClick="disconnect()">
                            Déconnecter
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <script>autoConnect();setInterval(updateDice, 500);</script>
<?php } ?>

</body>

</html>
