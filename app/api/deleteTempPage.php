<?php
session_start();
if(!$_SESSION["auth"]){
    header("HTTP/1.0 403 Forbidden");
    die;
}

$_POST = json_decode(file_get_contents("php://input"), true);
$file = "../../" . $_POST["name"];

if(file_exists($file)){
    unlink($file);
}