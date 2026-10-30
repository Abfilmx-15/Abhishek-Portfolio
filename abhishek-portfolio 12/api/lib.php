<?php
session_set_cookie_params(['httponly'=>true,'samesite'=>'Strict','secure'=>!empty($_SERVER['HTTPS'])]);
session_start();
require __DIR__.'/sheet.php';
define('ROOT',dirname(__DIR__));
define('DATA',ROOT.'/data');
function out($a,$c=200){http_response_code($c);header('Content-Type: application/json');header('Cache-Control: no-store');echo json_encode($a);exit;}
function auth(){$f=DATA.'/auth.php';if(is_file($f))return include $f;return ['user'=>'admin','hash'=>password_hash('Admin@123',PASSWORD_DEFAULT),'default'=>true];}
function need(){
 if(empty($_SESSION['ok']))out(['error'=>'Your session ended. Please log in again.'],401);
 if(!hash_equals($_SESSION['csrf']??'',$_SERVER['HTTP_X_CSRF']??''))out(['error'=>'Session expired. Reload the page and log in again.'],403);
}
