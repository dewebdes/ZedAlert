<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('memory_limit', '-1');


$ip = $_SERVER['REMOTE_ADDR'];

if($ip != '127.0.0.1'){
    die(':(');
}else {
	//...
}


$servername = "localhost";
$username = "root";
$password = "...";
$dbname = "zalert";
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = urldecode($_REQUEST['query']);
$sql = str_replace("\'", "'", $sql);
$result = $conn->query($sql);

if ((strpos($sql, 'select') === 0) or (strpos($sql, 'SELECT') === 0)) {
    $emparray = array();
    while($row = mysqli_fetch_assoc($result))
    {
        $emparray[] = $row;
    }

    $outp = json_encode($emparray);
    try{
    $ctrls = range(chr(0), chr(31));
    $ctrls[] = chr(127);
 
    $clean_string = str_replace($ctrls, "", $outp);
    die($clean_string);
    } catch (Exception $e) {
    die($outp);
    }
}

if ((strpos($sql, 'insert') === 0) or (strpos($sql, 'INSERT') === 0)) {
    $last_id = mysqli_insert_id($conn);
   
    die($last_id . '');
}

die('ok');

?>