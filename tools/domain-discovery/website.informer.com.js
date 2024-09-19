var dms = [];
var els = document.querySelectorAll('h4');
for(var i=0;i<=els.length-1;i++){
dms[dms.length] = els[i].innerText.split(' - ')[0].trim();
}
console.log(dms);
