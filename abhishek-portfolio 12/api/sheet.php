<?php
function settings(){$f=__DIR__.'/../data/settings.php';return is_file($f)?(include $f):[];}
function sheetSend($url,$p){
 $body=json_encode($p,JSON_UNESCAPED_UNICODE);$r=false;
 if(function_exists('curl_init')){
  $c=curl_init($url);
  curl_setopt_array($c,[CURLOPT_POST=>1,CURLOPT_POSTFIELDS=>$body,CURLOPT_HTTPHEADER=>['Content-Type: text/plain;charset=utf-8'],CURLOPT_RETURNTRANSFER=>1,CURLOPT_FOLLOWLOCATION=>1,CURLOPT_TIMEOUT=>20]);
  $r=curl_exec($c);curl_close($c);
 }else{
  $ctx=stream_context_create(['http'=>['method'=>'POST','header'=>"Content-Type: text/plain;charset=utf-8\r\n",'content'=>$body,'timeout'=>20]]);
  $r=@file_get_contents($url,false,$ctx);
 }
 $j=json_decode((string)$r,true);
 return is_array($j)&&!empty($j['ok']);
}
