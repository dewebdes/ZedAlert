//https://github.com/php/php-src/security/advisories/GHSA-7fj2-8x79-rjf4
//BCrypt hashes erroneously validate if the salt is cut short by `$`
//php -v < 8

<?php
echo "<hr>";
var_dump(password_verify("foo", '$2y$04$00000000$')); // bool(true)

$hash = '$2y$10$.vGA1O9wmRjrwAVXD98HNOgsNpDczlqm3Jq7KnEd1rVAGv3Fykk1a';
$hash = '$2y$10$.vGA1O9w$';

echo "<hr>";

if (password_verify('rasmuslerdorf', $hash)) {
    echo 'Password is valid!';
} else {
    echo 'Invalid password.';
}
?>