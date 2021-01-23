/* או שאתה מקבל שגיאה מהשרת או שלא.
במקרה של שגיאה ממש לא אכפת לך מה קרה - לא אכפת לך אם הסיסמה תואמת או לא, לא אכפת לך אם המייל קיים או לא - אתה פשוט אומר: Authentication failed - כי אתה לא אמור לחשוף מידע ללקוח מה הבעיה בהתחברות. אתה לא אמור להגיד לו - סיסמה לא נכונה או מייל לא נכון
כי זה יכול לאפשר לאנשים להבין איזה מייל קיים בDB ואיזה לא.
אם אין שגיאה מהשרת - חיבור הצליח 
אם יש - להציג פשוט הודעת שגיאה מעוצבת משלך - Authentication failed */
// const jwt = require('jsonwebtoken');

$(document).ready(() => {
    // Form elements
    const $loginFormELM = $('#loginForm');
    const $formEmailELM = $('#formEmail');
    const $formPasswordELM = $('#formPassword');

    // Error element
    const $errorELM = $('#error');

    let onSendRequest = false;

    // Handle login action
    $loginFormELM.on('submit', (event) => {
        event.preventDefault();

        if (!onSendRequest) {
            onSendRequest = true;

            $.ajax({
                url: 'api/auth/handleLogin',
                method: 'POST',
                data: {
                    email: $formEmailELM.val(),
                    password: $formPasswordELM.val(),
                },
                error: async () => {
                    $errorELM.html('Failed to authenticate');

                    $errorELM.show({ duration: 1000 });
                    await sleep(2000);
                    $errorELM.hide({ duration: 1000 });

                    onSendRequest = false;
                },
                success: ({ data: { token } }) => {
                    localStorage.setItem('auth_token', token);

                    window.location.href = '/';
                },
                timeout: 10000,
            });
        }
    });
});