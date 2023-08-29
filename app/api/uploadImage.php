<?php
session_start();
if(!$_SESSION["auth"]){
    header("HTTP/1.0 403 Forbidden");
    die;
}

$file = $_FILES["image"]["tmp_name"];

if(file_exists($file) && is_uploaded_file($file)){
    $fileExt = explode("/", $_FILES["image"]["type"])[1];
    $fileName = uniqid().".".$fileExt;
    if (!is_dir("../../img/")) {
        mkdir("../../img/");
    }
    move_uploaded_file($file, "../../img/".$fileName);
    echo json_encode(array("src" => $fileName));
}