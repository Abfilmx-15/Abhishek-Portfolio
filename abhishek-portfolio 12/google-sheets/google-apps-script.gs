// Paste this into Extensions > Apps Script in your Google Sheet, then deploy as a Web app.
function clean(v){v=String(v==null?'':v);return /^[=+\-@]/.test(v)?"'"+v:v;} // stops spreadsheet formula injection
function doPost(e){
  try{
    var d=JSON.parse(e.postData.contents);
    var sh=SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if(sh.getLastRow()===0) sh.appendRow(['Date','Name','Email','Project type','Budget','Message']);
    sh.appendRow([new Date(),clean(d.name),clean(d.email),clean(d.type),clean(d.budget),clean(d.message)]);
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  }catch(err){
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}
