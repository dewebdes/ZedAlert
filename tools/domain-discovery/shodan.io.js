var dms = [];
var els = document.querySelectorAll('.text-danger');
for(var i=0;i<=els.length-1;i++){
dms[dms.length] = els[i].href;
}
console.log(dms);