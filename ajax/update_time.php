<?php
$duration = isset($_REQUEST['duration'])? $_REQUEST['duration'] : 0;
$start = isset($_REQUEST['start'])? $_REQUEST['start'] : null;
$content = file_get_contents("time.json");

if($start != null && $content != null) {
    $object = json_decode($content);
    if($duration != 0) {
        //Update json file
        $object->start = $start;
        $object->duration = $duration;
        $encoded = json_encode($object);
        if(false !== file_put_contents("time.json", $encoded)){
            $content = $encoded;
        }
    }

    echo $content;
}