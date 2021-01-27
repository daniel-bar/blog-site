let isAuthenticated = false;
let username;

(async () => {
    // Retrieve username if logged-in
    try {
        const serverResponse = await fetch('api/auth/getUsername', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
            },
        });
        const serverResponseData = await serverResponse.json();

        if (serverResponseData.success) {
            isAuthenticated = true;
            username = serverResponseData.data.username;
        }
    } catch { } finally {
        $(document).ready(() => {
            // Username and auth buttons elements
            const $authButtonsContainerELM = $('#authButtonsContainer');
            const $usernameTextELM = $('#usernameText');

            if (isAuthenticated) {
                $authButtonsContainerELM.css('display', 'none');
                $usernameTextELM.css('display', 'block').html(username);
            } else {
                $authButtonsContainerELM.css('display', 'flex');
                $usernameTextELM.css('display', 'none');
            }
        });
    }
})();
