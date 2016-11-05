<!DOCTYPE html>
<?php
include "bd_connect.php";

$query = "SELECT * FROM users;";
$stm = $bd->prepare($query);
$stm->execute();
$res = $stm->get_result();
$users = [];
while ($row = $res->fetch_assoc()){
    $users[$row['id_user']] = $row;
}
$success = false;
$error = false;

if(isset($_POST['firstname'])) {
    $firstname = $_POST['firstname'];
    $lastname = $_POST['lastname'];
    $old = $_POST['old'];
    $nickname = empty($_POST['nickname'])? null : $_POST['nickname'];
    $race = $_POST['race'];
    $class = empty($_POST['class'])? null : $_POST['class'];
    $level = $_POST['level'];
    $bonusHealth = $_POST['bonusHealth'];
    $bonusMana = $_POST['bonusMana'];
    $bonusEphirium = $_POST['bonusEphirium'];
    $bonusResistanceEphirium = $_POST['bonusResistanceEphirium'];
    $bonusResistanceDamage = $_POST['bonusResistanceDamage'];
    $bonusMeleeDamage = $_POST['bonusMeleeDamage'];
    $bonusMagicDamage = $_POST['bonusMagicDamage'];
    $bonusRangeDamage = $_POST['bonusRangeDamage'];
    $strengh = $_POST['strengh'];
    $agility = $_POST['agility'];
    $intelligence = $_POST['intelligence'];
    $dexterity = $_POST['dexterity'];
    $charism = $_POST['charism'];
    $precision = $_POST['precision'];
    $courage = $_POST['courage'];
    $speed = $_POST['speed'];
    $wisdom = $_POST['wisdom'];
    $endurance = $_POST['endurance'];
    $perception = $_POST['perception'];
    $constitution = $_POST['constitution'];
    $character_owner_id = $_POST['user'];

    $healthMax = 100 + $endurance + $bonusHealth;
    $health = $healthMax;
    $ephiriumMax = 100 + $bonusEphirium;
    $ephirium = $ephiriumMax;
    $manaMax = 0 + $bonusMana;
    $mana = 0;
    $resistanceEphirium = 0 + $constitution / 2 + $bonusResistanceEphirium;
    $resistanceDamage = 0 + $endurance / 2 + $bonusResistanceDamage;
    $bonusMeleeDamage = 5 + $strengh / 2 + $bonusMeleeDamage;
    $bonusRangeDamage = 3 + $precision / 2 + $bonusRangeDamage;
    $bonusMagicDamage = 0 + $intelligence / 2 + $bonusMagicDamage;

    $query = "INSERT INTO characters(
                firstname, 
                lastname, 
                old, 
                nickname, 
                race, 
                class, 
                life_point_max, 
                life_point, 
                ephirium_tolerance_max, 
                ephirium_tolerance, 
                mana_max, 
                mana, 
                ephirium_resistance, 
                damage_resistance, 
                strengh, 
                agility, 
                intelligence, 
                dexterity, 
                charism, 
                `precision`, 
                courage, 
                speed,
                wisdom, 
                endurance, 
                perception,
                constitution,
                character_owner_id, 
                bonus_melee_damage, 
                bonus_magic_damage, 
                bonus_range_damage, 
                level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    $stm = $bd->prepare($query);
    if(!$stm->bind_param("ssisssiiiiiiiiiiiiiiiiiiiiiiiii",
        $firstname,
        $lastname,
        $old,
        $nickname,
        $race,
        $class,
        $healthMax,
        $health,
        $ephiriumMax,
        $ephirium,
        $manaMax,
        $mana,
        $resistanceEphirium,
        $resistanceDamage,
        $strengh,
        $agility,
        $intelligence,
        $dexterity,
        $charism,
        $precision,
        $courage,
        $speed,
        $wisdom,
        $endurance,
        $perception,
        $constitution,
        $character_owner_id,
        $bonusMeleeDamage,
        $bonusMagicDamage,
        $bonusRangeDamage,
        $level)) {
        $error = true;
    } else {
        if(!$stm->execute()) {
            $error = true;
        } else {
            $success = true;
        }
    }
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
</head>

<body>
<?php if($bdConnected){ ?>
    <?php if($error) { ?>
        <div class="alert alert-error" role="alert">
            Erreur d'insertion
        </div>
    <?php }?>
    <?php if($success) { ?>
        <div class="alert alert-success" role="alert">
            Inséré
        </div>
    <?php }?>

    <h2 style="margin-left: 15px;">Ajouter un personnage</h2>
    <form method="post">
        <div class="col-md-4">
            <div class="form-group">
                <label for="user">Utilisateur</label>
                <select id="user" class="form-control" name="user">
                    <?php foreach ($users as $user) { ?>
                        <option value="<?= $user['id_user'] ?>"><?= $user['login'] ?></option>
                    <?php } ?>
                </select>
            </div>
            <div class="form-group">
                <label for="lastname">Nom</label>
                <input id="lastname" class="form-control" type="text" name="lastname" required/>
            </div>
            <div class="form-group">
                <label for="firstname">Prénom</label>
                <input id="firstname" class="form-control" type="text" name="firstname" required/>
            </div>
            <div class="form-group">
                <label for="old">Age</label>
                <input id="old" class="form-control" type="number" step="1" min="0" name="old" required/>
            </div>
            <div class="form-group">
                <label for="nickname">Surnom</label>
                <input id="nickname" class="form-control" type="text" name="nickname" />
            </div>
            <div class="form-group">
                <label for="race">Race</label>
                <input id="race" class="form-control" type="text" name="race" required/>
            </div>
            <div class="form-group">
                <label for="class">Classe</label>
                <input id="class" class="form-control" type="text" name="class" />
            </div>
            <div class="form-group">
                <label for="level">Niveau</label>
                <input id="level" class="form-control" type="number" step="1" min="1" value="1" name="level" />
            </div>
            <button class="btn btn-success pull-right">
                Ajouter
            </button>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label for="bonusHealth">Bonus vie</label>
                <input id="bonusHealth" class="form-control" type="number" step="1" name="bonusHealth" required/>
            </div>
            <div class="form-group">
                <label for="bonusMana">Mana</label>
                <input id="bonusMana" class="form-control" type="number" step="1" name="bonusMana" required/>
            </div>
            <div class="form-group">
                <label for="bonusEphirium">Bonus ephirium</label>
                <input id="bonusEphirium" class="form-control" type="number" step="1" name="bonusEphirium" required/>
            </div>
            <div class="form-group">
                <label for="bonusResistanceEphirium">Bonus résistance ephirium</label>
                <input id="bonusResistanceEphirium" class="form-control" type="number" step="1" name="bonusResistanceEphirium" required/>
            </div>
            <div class="form-group">
                <label for="bonusResistanceDamage">Bonus résistance dégats</label>
                <input id="bonusResistanceDamage" class="form-control" type="number" step="1" name="bonusResistanceDamage" required/>
            </div>
            <div class="form-group">
                <label for="bonusMeleeDamage">Bonus dégats CàC</label>
                <input id="bonusMeleeDamage" class="form-control" type="number" step="1" name="bonusMeleeDamage" required/>
            </div>
            <div class="form-group">
                <label for="bonusRangeDamage">Bonus dégats distance</label>
                <input id="bonusRangeDamage" class="form-control" type="number" step="1" name="bonusRangeDamage" required/>
            </div>
            <div class="form-group">
                <label for="bonusMagicDamage">Bonus dégats magique</label>
                <input id="bonusMagicDamage" class="form-control" type="number" step="1" name="bonusMagicDamage" required/>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label for="strengh">Force</label>
                <input id="strengh" class="form-control" type="number" step="1" name="strengh" required/>
            </div>
            <div class="form-group">
                <label for="agility">Agilité</label>
                <input id="agility" class="form-control" type="number" step="1" name="agility" required/>
            </div>
            <div class="form-group">
                <label for="intelligence">Intelligence</label>
                <input id="intelligence" class="form-control" type="number" step="1" name="intelligence" required/>
            </div>
            <div class="form-group">
                <label for="dexterity">Dexterité</label>
                <input id="dexterity" class="form-control" type="number" step="1" name="dexterity" required/>
            </div>
            <div class="form-group">
                <label for="charism">Charisme</label>
                <input id="charism" class="form-control" type="number" step="1" name="charism" required/>
            </div>
            <div class="form-group">
                <label for="precision">Précision</label>
                <input id="precision" class="form-control" type="number" step="1" name="precision" required/>
            </div>
            <div class="form-group">
                <label for="courage">Courage</label>
                <input id="courage" class="form-control" type="number" step="1" name="courage" required/>
            </div>
            <div class="form-group">
                <label for="speed">Vitesse</label>
                <input id="speed" class="form-control" type="number" step="1" name="speed" required/>
            </div>
            <div class="form-group">
                <label for="wisdom">Sagesse</label>
                <input id="wisdom" class="form-control" type="number" step="1" name="wisdom" required/>
            </div>
            <div class="form-group">
                <label for="endurance">Endurance</label>
                <input id="endurance" class="form-control" type="number" step="1" name="endurance" required/>
            </div>
            <div class="form-group">
                <label for="perception">Perception</label>
                <input id="perception" class="form-control" type="number" step="1" name="perception" required/>
            </div>
            <div class="form-group">
                <label for="constitution">Constitution</label>
                <input id="constitution" class="form-control" type="number" step="1" name="constitution" required/>
            </div>
        </div>
    </form>
<?php } ?>
</body>
