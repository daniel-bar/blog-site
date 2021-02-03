let username;
let email;

(async () => {
    const authenticationResponseData = await getSelfDetails();

    if (authenticationResponseData.success) {
        username = authenticationResponseData.data.username;
        email = authenticationResponseData.data.email;
    } else {
        return window.location.href = '/';
    }

    $(document).ready(() => {
        // Username and auth buttons elements
        const $authButtonsContainerELM = $('#authButtonsContainer');
        const $navUserContainerELM = $('#navUserContainer');
        const $usernameTextELM = $('#usernameText');
        const $logoutButtonELM = $('#logoutButton');

        $authButtonsContainerELM.css('display', 'none');
        $navUserContainerELM.css('display', 'flex');
        $usernameTextELM.html(username);

        $logoutButtonELM.on('click', () => {
            localStorage.removeItem('auth_token');
            return window.location.href = '/';
        });

        // Form elements
        const $editProfileFormELM = $('#editProfileForm');
        const $currentPasswordELM = $('#currentPassword');
        const $newEmailELM = $('#newEmail');
        const $newPasswordELM = $('#newPassword');
        const $newPasswordRepeatELM = $('#newPasswordRepeat');

        $newEmailELM.val(email);

        // Error element
        const $errorELM = $('#error');

        let onSendRequest = false;

        // Handle updating action
        $editProfileFormELM.on('submit', async (event) => {
            event.preventDefault();

            if ($currentPasswordELM.val() === '') {
                return;
            }

            if (!onSendRequest) {
                onSendRequest = true;
            }

            const data = {
                currentPassword: $currentPasswordELM.val(),
                newEmail: $newEmailELM.val(),
                newPassword: $newPasswordELM.val(),
                newPasswordRepeat: $newPasswordRepeatELM.val(),
            }

            if (data.newPassword !== data.newPasswordRepeat) {
                $errorELM.html('New password does not match');

                $errorELM.show({ duration: 1000 });
                await sleep(2000);
                $errorELM.hide({ duration: 1000 });

                onSendRequest = false;

                return;
            }

            try {
                const serverResponseData = await updateProfile(data);

                if (serverResponseData.success) {
                    return window.location.href = '/me.html';
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
