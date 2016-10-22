<?php include "../bd_connect.php";

if ($bdConnected) {
    $query = "SELECT * FROM characters";
    $stm = $bd->prepare($query);
    $stm->execute();
    $res = $stm->get_result();
    $characters = [];
    while ($row = $res->fetch_assoc()){
        $characters[$row['id_character']] = $row;
    }
    echo json_encode($characters);
}
