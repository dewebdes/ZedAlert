//https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=joomla
//https://www.google.com/search?q=CVE-2024-5737+github&oq=CVE-2024-5737+github
var dms = [];
var els = document.querySelectorAll('#TableWithRules a');
for(var i=0;i<=els.length-1;i++){
dms[dms.length] = els[i].innerText;
}
console.log(dms);