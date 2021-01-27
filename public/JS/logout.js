$(document).ready(() => {
    const $logoutELM = $('#logoutButton');

    // Handle login action
    $logoutELM.on('submit', async, (event) => {
        event.preventDefault();

        if (serverResponseData.success) {
            localStorage.setItem('auth_token', serverResponseData.token);
            window.location.href = '/';
        }
    });
});