<?php
$content = file_get_contents("dice.json");
$maxRoll = isset($_REQUEST['maxRoll'])? $_REQUEST['maxRoll'] : 0;

if($content !== false){
    $object = json_decode($content);
    if($maxRoll != 0){
        $object->max = $maxRoll;
        $object->value = rand(1, $maxRoll);
        $encoded = json_encode($object);
        if(false !== file_put_contents("dice.json", $encoded)){
            $content = $encoded;
        }
    }
    echo $content;
}