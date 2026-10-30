<?php
require __DIR__.'/lib.php';
$a=$_GET['a']??'';
$raw=file_get_contents('php://input');
$in=json_decode($raw,true)?:[];
if($a==='status')out(['in'=>!empty($_SESSION['ok']),'csrf'=>$_SESSION['csrf']??'','def'=>!empty($_SESSION['def'])]);
if($a==='login'){
 if(($_SESSION['lock']??0)>time())out(['error'=>'Too many attempts. Please wait a few minutes and try again.'],429);
 $au=auth();
 if(hash_equals((string)$au['user'],(string)($in['u']??''))&&password_verify((string)($in['p']??''),$au['hash'])){
  session_regenerate_id(true);
  $_SESSION['ok']=1;$_SESSION['csrf']=bin2hex(random_bytes(16));$_SESSION['def']=!empty($au['default']);$_SESSION['fails']=0;
  out(['ok'=>1,'csrf'=>$_SESSION['csrf'],'def'=>$_SESSION['def']]);
 }
 $_SESSION['fails']=($_SESSION['fails']??0)+1;
 if($_SESSION['fails']>=5){$_SESSION['lock']=time()+300;$_SESSION['fails']=0;}
 usleep(700000);
 out(['error'=>'Wrong username or password.'],401);
}
if($a==='logout'){$_SESSION=[];session_destroy();out(['ok'=>1]);}
need();
if($a==='settings')out(['sheet'=>settings()['sheet']??'']);
if($a==='setsheet'){
 $u=trim((string)($in['url']??''));
 if($u!==''&&!preg_match('#^https://script\.google\.com/.+/exec$#',$u))out(['error'=>'That does not look like a Google Apps Script web app address. It should start with https://script.google.com/ and end with /exec'],400);
 if(!is_writable(DATA))out(['error'=>'The "data" folder is not writable. Set its permissions to 755 (or 775).'],500);
 file_put_contents(DATA.'/settings.php','<?php return '.var_export(['sheet'=>$u],true).';');
 out(['ok'=>1]);
}
if($a==='testsheet'){
 $u=settings()['sheet']??'';
 if(!$u)out(['error'=>'Save the Google Sheets address first.'],400);
 if(!sheetSend($u,['name'=>'Test row','email'=>'test@example.com','type'=>'Test','budget'=>'-','message'=>'This is a test from your Admin Panel.']))out(['error'=>'The sheet did not accept the test. Check the steps: deploy as Web app, access set to Anyone, and the address ends in /exec.'],502);
 out(['ok'=>1]);
}
if($a==='save'){
 if(strlen($raw)>3000000)out(['error'=>'Content is too large.'],413);
 if(!is_array($in)||!isset($in['texts']))out(['error'=>'Invalid content.'],400);
 if(!is_dir(DATA)||!is_writable(DATA))out(['error'=>'The "data" folder is not writable. In your hosting file manager, set its permissions to 755 (or 775).'],500);
 $f=DATA.'/content.json';
 if(is_file($f))@copy($f,DATA.'/content.bak.json');
 $tmp=DATA.'/content.tmp';
 if(file_put_contents($tmp,json_encode($in,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT))===false||!rename($tmp,$f))out(['error'=>'Could not save. Check the permissions of the "data" folder.'],500);
 out(['ok'=>1]);
}
if($a==='upload'){
 $f=$_FILES['file']??null;
 if(!$f)out(['error'=>'No file received.'],400);
 if(in_array($f['error'],[1,2]))out(['error'=>'This image is larger than your server allows ('.ini_get('upload_max_filesize').'). Please use a smaller image.'],413);
 if($f['error']!==0||$f['size']>8*1048576)out(['error'=>'Upload failed. Please use an image under 8 MB.'],400);
 $i=@getimagesize($f['tmp_name']);
 $ext=[IMAGETYPE_JPEG=>'jpg',IMAGETYPE_PNG=>'png',IMAGETYPE_WEBP=>'webp',IMAGETYPE_GIF=>'gif'][$i[2]??0]??null;
 if(!$ext)out(['error'=>'Please upload a JPG, PNG, WEBP or GIF image.'],400);
 $dir=ROOT.'/uploads';
 if(!is_dir($dir)||!is_writable($dir))out(['error'=>'The "uploads" folder is not writable. Set its permissions to 755 (or 775).'],500);
 $n='uploads/'.date('Ymd-His').'-'.bin2hex(random_bytes(3)).'.'.$ext;
 if(!move_uploaded_file($f['tmp_name'],ROOT.'/'.$n))out(['error'=>'Could not store the image.'],500);
 out(['path'=>$n]);
}
if($a==='password'){
 $au=auth();$np=(string)($in['new']??'');$nu=trim((string)($in['user']??''))?:$au['user'];
 if(!password_verify((string)($in['cur']??''),$au['hash']))out(['error'=>'Your current password is not correct.'],400);
 if(strlen($np)<8)out(['error'=>'The new password must be at least 8 characters.'],400);
 if($np==='Admin@123')out(['error'=>'Please choose a password different from the default one.'],400);
 if(!is_writable(DATA))out(['error'=>'The "data" folder is not writable. Set its permissions to 755 (or 775).'],500);
 file_put_contents(DATA.'/auth.php','<?php return '.var_export(['user'=>$nu,'hash'=>password_hash($np,PASSWORD_DEFAULT)],true).';');
 $_SESSION['def']=0;
 out(['ok'=>1]);
}
out(['error'=>'Unknown action.'],400);
