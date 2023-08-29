<?php
session_start();
if(!$_SESSION["auth"]){
    header("HTTP/1.0 403 Forbidden");
    die;
}

$_POST = json_decode(file_get_contents("php://input"), true);
$file = $_POST["pageName"];
$newHTML = $_POST["html"];

$dir = "../backups"; 
if(!is_dir($dir)) {
    mkdir($dir, 0777, true);
}

$backups = json_decode(file_get_contents("../backups/backups.json"));
if(!is_array($backups)){
    $backups = [];
}

if($file && $newHTML ){
    $backupFN = uniqid().".html";
    copy("../../".$file, "../backups/".$backupFN);
    array_push($backups, ["page" => $file, "file" => $backupFN, "time" => date("d/m/y H:i:s")]);
    file_put_contents("../backups/backups.json", json_encode($backups));
    file_put_contents("../../".$file, $newHTML);
} else {
    header("HTTP/1.0 400 Bad Request");
}