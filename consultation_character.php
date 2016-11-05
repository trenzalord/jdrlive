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

if(isset($_REQUEST['id_character'])) {
    $character = $characters[$_REQUEST['id_character']];
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

    <link rel="stylesheet" media="screen" type="text/css" href="css/fonts.css">
    <link rel="stylesheet" media="screen" type="text/css" href="css/global.css">
</head>

<body>
<?php if($bdConnected){ ?>
    <div class="col-md-4">
    </div>
    <div class="col-md-4">
        <h2>Personnage</h2>
        <form method="get">
            <select onchange="this.form.submit()" title="Personnages" class="form-control" id="selectPersonnage" name="id_character">
                <?php foreach($characters as $char) { ?>
                    <option value="<?= $char['id_character'] ?>"><?= $char['firstname'] . " " . $char['lastname'] ?></option>
                <?php } ?>
            </select>
        </form>
        <table class="table table-bordered" id="characterStatsTable">
            <thead>
                <tr class="headTableRow">
                    <td colspan="2"><h2 style="margin: 0"><?= $character['firstname'] . " " . $character['lastname'] ?></h2></td>
                </tr>
            </thead>
            <tbody>
            <tr class="subTableRow">
                <td colspan="2">Fiche générale</td>
            </tr>
            <tr>
                <td>Level</td>
                <td><?= $character['level'] ?></td>
            </tr>
            <tr>
                <td>Âge</td>
                <td><?= $character['old'] ?></td>
            </tr>
            <tr>
                <td>Surnom</td>
                <td><?= $character['nickname'] ?></td>
            </tr>
            <tr>
                <td>Race</td>
                <td><?= $character['race'] ?></td>
            </tr>
            <tr>
                <td>Classe</td>
                <td><?= $character['class'] ?></td>
            </tr>
            <tr>
                <td>Point de vie</td>
                <td><?= $character['life_point'] . '/' .  $character['life_point_max']?></td>
            </tr>
            <tr>
                <td>Mana</td>
                <td><?= $character['mana'] . '/' .  $character['mana_max']?></td>
            </tr>
            <tr>
                <td>Tolerance à l'ephirium</td>
                <td><?= $character['ephirium_tolerance'] . '/' .  $character['ephirium_tolerance_max']?></td>
            </tr>
            <tr>
                <td>Résistance à l'ephirium</td>
                <td><?= $character['ephirium_resistance']?></td>
            </tr>
            <tr>
                <td>Résistance aux dégats</td>
                <td><?= $character['damage_resistance']?></td>
            </tr>
            <tr>
                <td>Bonus aux dégats CàC</td>
                <td><?= $character['bonus_melee_damage']?></td>
            </tr>
            <tr>
                <td>Bonus aux dégats distance</td>
                <td><?= $character['bonus_range_damage']?></td>
            </tr>
            <tr>
                <td>Bonus aux dégats magiques</td>
                <td><?= $character['bonus_magic_damage']?></td>
            </tr>
            <tr class="headTableRow">
                <td colspan="2">Fiche stats</td>
            </tr>
            <tr class="subTableRow">
                <td>Nom</td>
                <td>Valeur</td>
            </tr>
            <tr>
                <td>Force</td>
                <td><?= $character['strengh']?></td>
            </tr>
            <tr>
                <td>Agilité</td>
                <td><?= $character['agility']?></td>
            </tr>
            <tr>
                <td>Intelligence</td>
                <td><?= $character['intelligence']?></td>
            </tr>
            <tr>
                <td>Dexterité</td>
                <td><?= $character['dexterity']?></td>
            </tr>
            <tr>
                <td>Charisme</td>
                <td><?= $character['charism']?></td>
            </tr>
            <tr>
                <td>Précision</td>
                <td><?= $character['precision']?></td>
            </tr>
            <tr>
                <td>Courage</td>
                <td><?= $character['courage']?></td>
            </tr>
            <tr>
                <td>Rapidité</td>
                <td><?= $character['speed']?></td>
            </tr>
            <tr>
                <td>Sagesse</td>
                <td><?= $character['wisdom']?></td>
            </tr>
            <tr>
                <td>Endurance</td>
                <td><?= $character['endurance']?></td>
            </tr>
            <tr>
                <td>Perception</td>
                <td><?= $character['perception']?></td>
            </tr>
            <tr>
                <td>Constitution</td>
                <td><?= $character['constitution']?></td>
            </tr>
            </tbody>
        </table>
    </div>
    <div class="col-md-4">
    </div>
<?php } ?>
</body>
<script>
    $('#selectPersonnage').val(<?= $character['id_character']?>);
</script>
</html>
