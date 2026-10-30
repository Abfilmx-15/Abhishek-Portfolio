<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$d=__DIR__.'/../data/';
readfile(is_file($d.'content.json')?$d.'content.json':$d.'default-content.json');
