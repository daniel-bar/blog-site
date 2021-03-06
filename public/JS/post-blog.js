let isAuthenticated = false;
let username;
let categories = [];

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

    const categoriesResponse = await getCategories();

    if (!categoriesResponse.success) {
        return window.location.href = '/error.html';
    }

    categories = categoriesResponse.data.categories;

    $(document).ready(() => {
        // Username and auth buttons elements
        const $authButtonsContainerELM = $('#authButtonsContainer');
        const $navUserContainerELM = $('#navUserContainer');
        const $usernameTextELM = $('#usernameText');
        const $logoutButtonELM = $('#logoutButton');
        const $postBlogCategorySelectorELM = $('#postBlogCategorySelector');

        $postBlogCategorySelectorELM.html(categories.map((category) => `<option value="${category}">${category}</option>`).join(('')));

        $authButtonsContainerELM.css('display', 'none');
        $navUserContainerELM.css('display', 'flex');
        $usernameTextELM.html(username);

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
                title: $postBlogFormTitleInputELM.val(),
                content: $postBlogFormContentInputELM.val(),
                category: $postBlogCategorySelectorELM.val(),
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