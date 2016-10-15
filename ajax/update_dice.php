<?php
$content = file_get_contents("dice.json");
$maxRoll = isset($_REQUEST['maxRoll'])? $_REQUEST['maxRoll'] : 0;
$name = isset($_REQUEST['name'])? $_REQUEST['name'] : null;
$login = isset($_REQUEST['login'])? $_REQUEST['login'] : null;
$saveInDB = isset($_REQUEST['save'])? $_REQUEST['save'] : null;

if($content !== false){
    $object = json_decode($content);
    if($maxRoll != 0 && $name != null && $saveInDB != null && $login != null){
        $object->max = $maxRoll;
        $object->value = rand(1, $maxRoll);
        $object->user = $name;
        if($saveInDB != "false" && $maxRoll == 20) {
            include "../bd_connect.php";
            if($bdConnected) {
                $succesCrit = $object->value == (int) $object->max ? 1 : 0;
                $echecCrit = $object->value == 1? 1 : 0;
                $updateCptDiceRoll = "UPDATE users SET cpt_dice_roll = cpt_dice_roll + 1, 
                    cpt_critical_success = cpt_critical_success + ?, 
                    cpt_critical_fail = cpt_critical_fail + ? 
                    WHERE login = ?";
                $stm = $bd->prepare($updateCptDiceRoll);
                $stm->bind_param("iis", $succesCrit, $echecCrit, $login);
                $stm->execute();
            }
        }

        $encoded = json_encode($object);
        if(false !== file_put_contents("dice.json", $encoded)){
            $content = $encoded;
        }
    }
    echo $content;
}