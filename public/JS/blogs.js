let isAuthenticated = false;
let username;
let categoryPosts;

(async () => {
    const authenticationResponse = await authenticate();

    if (authenticationResponse.success) {
        isAuthenticated = true;
        username = authenticationResponse.data.username;
    }

    const queries = new URLSearchParams(window.location.search);
    const category = queries.get('category');

    const getCategoryResponse = await getCategoryPosts(category);

    if (!getCategoryResponse.success) {
        return window.location.href = '/error.html';
    }

    categoryPosts = getCategoryResponse.data.posts;

    $(document).ready(() => {
        // Elements
        const $authButtonsContainerELM = $('#authButtonsContainer');
        const $navUserContainerELM = $('#navUserContainer');
        const $usernameTextELM = $('#usernameText');
        const $logoutButtonELM = $('#logoutButton');
        const $pageHeaderContainerELM = $('#pageHeaderContainer');
        const $postsContainerELM = $('#postsContainer');

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

        $pageHeaderContainerELM.html(category);

        $postsContainerELM.html(categoryPosts.map((post) => `
            <div class="postContainer">
                <a class="postContainer__title" href="/blog.html?id=${post._id}">${post.title}</a>
                <span class="postContainer__description">${post.content}</span>
                <span class="postContainer__category">${category}</span>
                <a class="postContainer__author" href="/profile.html?id=${post.ownerID}">${post.ownerUsername}</a>
            </div>
        `).join(''));
    });
})();
