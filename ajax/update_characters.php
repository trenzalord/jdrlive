<?php
$content = file_get_contents("characters.json");
$indexCharacter = isset($_REQUEST['indexCharacter'])? $_REQUEST['indexCharacter'] : null;
$health = isset($_REQUEST['health'])? $_REQUEST['health'] : null;
$mana = isset($_REQUEST['mana'])? $_REQUEST['mana'] : null;
$ephirium = isset($_REQUEST['ephirium'])? $_REQUEST['ephirium'] : null;
$remove = isset($_REQUEST['remove'])? $_REQUEST['remove'] : null;
$update = isset($_REQUEST['update'])? $_REQUEST['update'] : null;

if($content !== false){
    $object = json_decode($content, true);
    if($update != null && $update != "") {
        if ($remove != "1") {
            $object["characters"][$indexCharacter]["health"] = $health;
            $object["characters"][$indexCharacter]["mana"] = $mana;
            $object["characters"][$indexCharacter]["ephirium"] = $ephirium;
        } else {
            $temp = [];
            foreach ($object["characters"] as $key=>$character) {
                if($key != $indexCharacter) {
                    $temp[$key] = $character;
                }
            }
            $object["characters"] = $temp;
        }
        $encoded = json_encode($object);
        if(false !== file_put_contents("characters.json", $encoded)){
            $content = $encoded;
        }
    }
    echo $content;
}