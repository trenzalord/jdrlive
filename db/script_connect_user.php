<?php include "../bd_connect.php";

if ($bdConnected) {
    $query = "SELECT login, password FROM users WHERE login='" + $_GET['login'];
    $res = $bd->query($query);
    if ($row = $res->fetch_assoc()){
        ?> <script>console.log("test")</script> <?php
    }
}
