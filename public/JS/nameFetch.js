$(document).ready(() => {
    // Username and buttons elements
    const $buttonsELM = $('#buttonsContainerID');
    const $usernameELM = $('#usernameContainer');


    // Name fetch action
    $.ajax({
        api: 'api/auth/handleUsername',
        method: 'GET',
        success: (serverResponse) => {
            console.log(serverResponse)
            $buttonsELM.css('display', 'none');
            $usernameELM.css('display', 'block');
        },
        error: () => {
            $buttonsELM.css('display', 'none');
        },
        timeout: 10000,
    });
});