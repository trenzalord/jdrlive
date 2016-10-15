<?php include "../bd_connect.php";

$login = isset($_REQUEST['login'])? $_REQUEST['login'] : null;
$password = isset($_REQUEST['password'])? $_REQUEST['password'] : null;

if ($bdConnected) {
    $query = "SELECT * FROM users WHERE login=?";
    $stm = $bd->prepare($query);
    $stm->bind_param("s", $login);
    $stm->execute();
    $res = $stm->get_result();
    if ($row = $res->fetch_assoc()){
        if(password_verify($password, $row['password'])) {
            echo json_encode($row);
        } else {
            echo 0;
        }
    }
}
