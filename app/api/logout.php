<?php
session_start();

if ($_SESSION["auth"]) {
    $_SESSION["auth"] = false;
    unset($_SESSION["auth"]);
    session_destroy();
}