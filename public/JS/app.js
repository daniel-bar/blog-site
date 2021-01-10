/* הרשמהה זה אחרת:
1. אתה מוודא את הUSERNAME מבחינת אורך
2. אתה מוודא את הEMAIL מבחינת אורך ומבחינת SYNTAX
3. אתה מוודא סיסמה על ידי אורך

ואתה לא נותן למשתמש לשלוח את הטופס של ההרשמה כל עוד הכל לא תקין */

const validator = require('validator');

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = data.get('username');
    if (username.length < 3 || username.length > 30) {
        alert('username should be between 3 to 30 characters!')
    }

    const email = data.get('email');
    if (email.length > 320 || !validator.isEmail(email)) {
        alert('email is too long!');
    }

    const password = data.get('password');
    if (password.length < 7 || password.length > 24) {
        alert('password is too short!');
    }


})
