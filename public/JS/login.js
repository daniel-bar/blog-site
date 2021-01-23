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