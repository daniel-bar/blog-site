let username;
let email;

(async () => {
    const authenticationResponse = await getSelfDetails();

    if (authenticationResponse.success) {
        username = authenticationResponse.data.username;
        email = authenticationResponse.data.email;
    } else {
        return window.location.href = '/login.html';
    }

    $(document).ready(async () => {
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

        // Username and email elements
        const $profileUsernameTextELM = $('#profileUsernameText');
        const $profileEmailTextELM = $('#profileEmailText');

        $profileUsernameTextELM.html(username);
        $profileEmailTextELM.html(email);
    });
})();
