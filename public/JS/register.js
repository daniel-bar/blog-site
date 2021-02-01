(async () => {
    const authenticationResponse = await authenticate();

    if (authenticationResponse.success) {
        return window.location.href = '/';
    }

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
        $registerFormELM.on('submit', async (event) => {
            event.preventDefault();

            if (!onSendRequest) {
                onSendRequest = true;
            }

            const data = {
                username: $formUsernameELM.val(),
                email: $formEmailELM.val(),
                password: $formPasswordELM.val(),
            }

            try {
                const serverResponseData = await handleRegister(data);

                if (serverResponseData.success) {
                    localStorage.setItem('auth_token', serverResponseData.data.token);
                    window.location.href = '/';
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
