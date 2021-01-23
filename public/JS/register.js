$(document).ready(() => {
    // Form elements
    const $registerFormELM = $('#registerForm');
    const $formUsernameELM = $('#formUsername');
    const $formEmailELM = $('#formEmail');
    const $formPasswordELM = $('#formPassword');

    // Error element
    const $errorELM = $('#error');

    let onSendRequest = false;

    // Handle registration action
    $registerFormELM.on('submit', (event) => {
        event.preventDefault();

        if (!onSendRequest) {
            onSendRequest = true;
        }

        $.ajax({
            url: 'api/auth/handleRegister',
            method: 'POST',
            data: {
                username: $formUsernameELM.val(),
                email: $formEmailELM.val(),
                password: $formPasswordELM.val(),
            },
            error: async ({ responseJSON: { message } }) => {
                $errorELM.html(message || 'Unexpected error');

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
    });
});