<?php
\ = 'admin@1234';
\ = password_hash(\, PASSWORD_DEFAULT);
echo \
Password:
\$password
\nHash:
\$hash
\n\;
echo password_verify(\, \) ? 'Verification successful' : 'Verification failed';
?>
