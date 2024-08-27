<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('memory_limit', '-1');
set_time_limit(0);


$ip = $_SERVER['REMOTE_ADDR'];

if($ip != '185.217.143.152'){
   // die(':('. $ip);
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

$tbl = ($_REQUEST['tbl']);
//program
$cmd = ($_REQUEST['cmd']);
//rand,fix,spider
$param1 = ($_REQUEST['param1']);
//id,periority

function select($sql){
    global $conn;
    $result = $conn->query($sql);
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

switch($tbl){
    case 'program':
        switch($cmd){
            case 'rand':
                    $sql = "SELECT * FROM program WHERE (status='na') and (flag='capok') ORDER BY periority desc,RAND() limit 1";
                    select($sql);
                break;
            case 'fix':
                    $sql = "SELECT * FROM program WHERE id=" . $param1;
                    select($sql);
                break;
            case 'spider':
                    $sql = "update program set status='spider-ready' WHERE id=" . $param1;
                    $result = $conn->query($sql);
                    die('ok');
                break;
        }           
        break;
    case 'endpoint':
            switch($cmd){
                case 'rand':
                        $sql = "SELECT tbl2.*,(SELECT page from program tbl1 WHERE tbl1.id=tbl2.programid) as page,(SELECT name from program tbl1 WHERE tbl1.id=tbl2.programid) as name FROM endpoints tbl2 WHERE (tbl2.status='ok') ORDER BY periority desc,RAND() limit 1";
                        select($sql);
                    break;
                case 'fix':
                        $sql = "SELECT tbl2.*,(SELECT page from program tbl1 WHERE tbl1.id=tbl2.programid) as page,(SELECT name from program tbl1 WHERE tbl1.id=tbl2.programid) as name FROM endpoints tbl2 WHERE tbl2.id=" . $param1;
                        select($sql);
                    break;
                case 'waybak':
                        $sql = "SELECT * FROM endpoints WHERE FROM_BASE64(addr) LIKE '%" . $param1 . "%' order by FROM_BASE64(addr) desc";
                        //die($sql);
                        $result = $conn->query($sql);
                        $emparray = '';
                        while($row = mysqli_fetch_assoc($result))
                        {
                            $emparray = $emparray . base64_decode($row['addr']) . PHP_EOL;
                        }
                        $filename="waybak.txt";
                        header("Content-type: application/octet-stream");
                        header("Content-disposition: attachment;filename=$filename");
                        echo $emparray;

                    break;
            }           
            break;
    case 'targetshot':
                switch($cmd){
                    case 'rand':
                            $sql = "SELECT tbl2.*,(SELECT page from program tbl1 WHERE tbl1.id=tbl2.programid) as page,(SELECT name from program tbl1 WHERE tbl1.id=tbl2.programid) as name FROM targets tbl2 WHERE (tbl2.status='ok') ORDER BY periority desc,RAND() limit 1";
                            select($sql);
                        break;
                    case 'fix':
                            $sql = "SELECT tbl2.*,(SELECT page from program tbl1 WHERE tbl1.id=tbl2.programid) as page,(SELECT name from program tbl1 WHERE tbl1.id=tbl2.programid) as name FROM targets tbl2 WHERE tbl2.id=" . $param1;
                            select($sql);
                        break;
                    
                }           
                break;
}


die('null');

?>