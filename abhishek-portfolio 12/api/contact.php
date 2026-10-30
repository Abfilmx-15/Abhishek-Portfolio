<?php
require __DIR__.'/sheet.php';
header('Content-Type: application/json');header('Cache-Control: no-store');
function o($a,$c=200){http_response_code($c);echo json_encode($a);exit;}
function cut($s,$n){$s=trim((string)$s);return function_exists('mb_substr')?mb_substr($s,0,$n):substr($s,0,$n);}
if($_SERVER['REQUEST_METHOD']!=='POST')o(['error'=>'Invalid request.'],405);
$d=json_decode(file_get_contents('php://input'),true);
if(!is_array($d))o(['error'=>'Invalid request.'],400);
if(!empty($d['website']))o(['ok'=>1]);
$url=settings()['sheet']??'';
if(!$url)o(['fallback'=>1]);
$p=['name'=>cut($d['name']??'',120),'email'=>cut($d['email']??'',160),'type'=>cut($d['type']??'',120),'budget'=>cut($d['budget']??'',80),'message'=>cut($d['message']??'',4000)];
if($p['name']===''||!filter_var($p['email'],FILTER_VALIDATE_EMAIL)||$p['message']==='')o(['error'=>'Please fill in your name, a valid email and a message.'],400);
$rf=sys_get_temp_dir().'/cf_'.md5($_SERVER['REMOTE_ADDR']??'x');
if(is_file($rf)&&time()-filemtime($rf)<20)o(['error'=>'Please wait a few seconds before sending another message.'],429);
touch($rf);
sheetSend($url,$p)?o(['ok'=>1]):o(['error'=>'Your message could not be saved right now. Please email me directly.'],502);
