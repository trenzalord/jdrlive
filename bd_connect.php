<?php
$bdConnected = true;

$bd = new mysqli("localhost", "root", "" , "nemesia");
if ($bd->connect_errno) {
    echo "Echec lors de la connexion à MySQL : (" . $bd->connect_errno . ") " . $bd->connect_error;
    $bdConnected = false;
}
