let isAuthenticated = false;
let username;

(async () => {
    const authenticationResponse = await authenticate();

    if (authenticationResponse.success) {
        isAuthenticated = true;
        username = authenticationResponse.data.username;
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
    });
})();