/* או שאתה מקבל שגיאה מהשרת או שלא.
במקרה של שגיאה ממש לא אכפת לך מה קרה - לא אכפת לך אם הסיסמה תואמת או לא, לא אכפת לך אם המייל קיים או לא - אתה פשוט אומר: Authentication failed - כי אתה לא אמור לחשוף מידע ללקוח מה הבעיה בהתחברות. אתה לא אמור להגיד לו - סיסמה לא נכונה או מייל לא נכון
כי זה יכול לאפשר לאנשים להבין איזה מייל קיים בDB ואיזה לא.
אם אין שגיאה מהשרת - חיבור הצליח 
אם יש - להציג פשוט הודעת שגיאה מעוצבת משלך - Authentication failed */
// const jwt = require('jsonwebtoken');

$(document).ready(() => {
    const $loginFormOBJ = $('#loginForm');

    const $formEmailOBJ = $('#formEmail');
    const $formPasswordOBJ = $('#formPassword');

    $loginFormOBJ.on('submit', (event) => {
        event.preventDefault();

        $.ajax({
            url: 'http://localhost:3000/api/auth/handleLogin',
            method: 'POST',
            data: {
                email: $formEmailOBJ.val(),
                password: $formPasswordOBJ.val(),
            },
            // headers: {
            //     Authorization: 'Bearer ' + token
            // },
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", "Basic " + btoa($formEmailOBJ + ":" + $formPasswordOBJ));
                // האם - data.email אמור לעבוד? כי לא עבד לי
            },
            error: (e) => {
                console.log(e);
                // DESIGN NICE ERROR MESSAGE.. instead of alert..
            },
            success: (response) => {
                console.log(response)
                localStorage.setItem('auth_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHScEfxjoYZgeFONFh7HgQ');
            },
            timeout: 10000,
        });
    });
});


// const auth = (username, password) => {
//     const token = email + ':' + password;
//     const hash = Base64.encode(token);
//     return "Basic " + hash;
// }