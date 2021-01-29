let isAuthenticated = false;
let username;

(async () => {
    const authenticationResponse = await authenticate();

    if (authenticationResponse.success) {
        isAuthenticated = true;
        username = authenticationResponse.data.username;
    } else if (authenticationResponse.data.not_auth) {
        return window.location.href = '/login.html';
    } else {
        return window.location.href = '/';
    }

    $(document).ready(() => {
        // Username and auth buttons elements
        const $authButtonsContainerELM = $('#authButtonsContainer');
        const $navUserContainerELM = $('#navUserContainer');
        const $usernameTextELM = $('#usernameText');
        const $logoutButtonELM = $('#logoutButton');

        if (isAuthenticated) {
            $authButtonsContainerELM.css('display', 'none');
            $navUserContainerELM.css('display', 'flex');
            $usernameTextELM.html(username);
        } else {
            $authButtonsContainerELM.css('display', 'flex');
            $navUserContainerELM.css('display', 'none');
        }

        $logoutButtonELM.on('click', () => {
            localStorage.removeItem('auth_token');
            return window.location.href = '/';
        });

        // Form elements
        const $postBlogFormELM = $('#postBlogForm')
        const $postBlogFormTitleInputELM = $('#postBlogFormTitleInput');
        const $postBlogFormContentInputELM = $('#postBlogFormContentInput');

        // Error element
        const $errorELM = $('#error');

        let onSendRequest = false;

        // Handle posting action
        $postBlogFormELM.on('submit', async (event) => {
            event.preventDefault();

            if (!onSendRequest) {
                onSendRequest = true;
            }

            const data = {
                description: $descriptionELM.val(),
                text: $textELM.val(),
            }

            try {
                const serverResponseData = await postBlog(data);

                if (serverResponseData.success) {
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