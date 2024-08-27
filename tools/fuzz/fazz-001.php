<script>
    function stoperror() {
   return true;
}
window.onerror = stoperror;
var res = [];
</script>

<?php

$start = 0x0000; // Start at Unicode code point U+0000
$end = 0x10FFFF; // End at Unicode code point U+10FFFF

ob_start();
for ($codepoint = $start; $codepoint <= $end; $codepoint++) {
    $char = mb_chr($codepoint, 'UTF-8');

    //if($codepoint == 34){continue;}
    //if($codepoint == 38){continue;}
    
    //echo $char . PHP_EOL;
    //echo "<script></script" . $char . "<script>res[res.length]=" . $codepoint . "</script" . $char . PHP_EOL;
    echo '<input type="text" value="yo2ld3ah' . $char . ' onfocus=console.log(' . $codepoint . ') autofocus at=' . $char . '">' . PHP_EOL;

    ob_flush();
    flush();
  
}

?>