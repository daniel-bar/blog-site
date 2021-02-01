(async () => {
    const authenticationResponse = await authenticate();

    if (authenticationResponse.success) {
        return window.location.href = '/';
    }

    $(document).ready(() => {
        // Form elements
        const $loginFormELM = $('#loginForm');
        const $formEmailELM = $('#formEmail');
        const $formPasswordELM = $('#formPassword');

        // Error element
        const $errorELM = $('#error');

        let onSendRequest = false;

        // Handle login action
        $loginFormELM.on('submit', async (event) => {
            event.preventDefault();

            if (!onSendRequest) {
                onSendRequest = true;
            }

            const data = {
                email: $formEmailELM.val(),
                password: $formPasswordELM.val(),
            }

            try {
                const serverResponseData = await handleLogin(data);

                if (serverResponseData.success) {
                    localStorage.setItem('auth_token', serverResponseData.data.token);
                    return window.location.href = '/';
                } else {
                    $errorELM.html(serverResponseData.message);

                    $errorELM.show({ duration: 1000 });
                    await sleep(2000);
                    $errorELM.hide({ duration: 1000 });

                    onSendRequest = false;
                }
            } catch {
                $errorELM.html('Unexpected error');

                $errorELM.show({ duration: 1000 });
                await sleep(2000);
                $errorELM.hide({ duration: 1000 });

                onSendRequest = false;
            }
        });
    });
})();
