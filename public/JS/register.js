/* הרשמהה זה אחרת:
1. אתה מוודא את הUSERNAME מבחינת אורך
2. אתה מוודא את הEMAIL מבחינת אורך ומבחינת SYNTAX
3. אתה מוודא סיסמה על ידי אורך

ואתה לא נותן למשתמש לשלוח את הטופס של ההרשמה כל עוד הכל לא תקין */

$(document).ready(() => {
    const $registerFormOBJ = $('#registerForm');
    // עכשיו אני רוצה את הערכים שהמשתמש הכניס בשדות
    const $formUsernameOBJ = $('#formUsername');
    const $formEmailOBJ = $('#formEmail');
    const $formPasswordOBJ = $('#formPassword');

    $registerFormOBJ.on('submit', (event) => {
        event.preventDefault();

        // VALIDATE FORM

        // SENDING to server..
        $.ajax({
            url: 'http://localhost:3000/api/auth/handleRegister',
            method: 'POST',
            data: {
                username: $formUsernameOBJ.val(),
                email: $formEmailOBJ.val(),
                password: $formPasswordOBJ.val(),
            },
            error: (e) => {
                console.log(e);
                //alert('Failed to send the request');
                // DESIGN NICE ERROR MESSAGE.. instead of alert..
            },
            success: (response) => {
                localStorage.setItem('auth_token', response.data.token);
            },
            timeout: 10000,
        });
    });
});