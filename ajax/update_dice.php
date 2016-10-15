<?php
$content = file_get_contents("dice.json");
$maxRoll = isset($_REQUEST['maxRoll'])? $_REQUEST['maxRoll'] : 0;
$name = isset($_REQUEST['name'])? $_REQUEST['name'] : null;

if($content !== false){
    $object = json_decode($content);
    if($maxRoll != 0 && $name != null){
        $object->max = $maxRoll;
        $object->value = rand(1, $maxRoll);
        $object->user = $name;
        $encoded = json_encode($object);
        if(false !== file_put_contents("dice.json", $encoded)){
            $content = $encoded;
        }
    }
    echo $content;
}