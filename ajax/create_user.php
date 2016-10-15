<?php include "../bd_connect.php";

$login = $_REQUEST['login'];
$password = $_REQUEST['password'];
$name = $_REQUEST['name'];

$password = password_hash($password, PASSWORD_DEFAULT);

$query = "INSERT INTO users(login, password, name) VALUES (?,?,?)";
$stm = $bd->prepare($query);
$stm->bind_param("sss", $login, $password, $name);

if($stm->execute()) {
    echo "Success";
} else {
    echo "Error: " . $bd->error;
}