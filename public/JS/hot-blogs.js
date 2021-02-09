let isAuthenticated = false;
let username;
let hotPosts;

(async () => {
    const authenticationResponse = await authenticate();

    if (authenticationResponse.success) {
        isAuthenticated = true;
        username = authenticationResponse.data.username;
    }

    const getHotPostsResponse = await getHotPosts();

    if (!getHotPostsResponse.success) {
        return window.location.href = '/error.html';
    }

    hotPosts = getHotPostsResponse.data.posts;

    $(document).ready(() => {
        // Username and auth buttons elements
        const $authButtonsContainerELM = $('#authButtonsContainer');
        const $navUserContainerELM = $('#navUserContainer');
        const $usernameTextELM = $('#usernameText');
        const $logoutButtonELM = $('#logoutButton');
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

        $postsContainerELM.html(hotPosts.map((hotPost) => `
            <div class="postContainer">
                <a class="postContainer__title" href="/blog.html?id=${hotPost._id}">${hotPost.title}</a>
                <span class="postContainer__description">${hotPost.content}</span>
                <span class="postContainer__category">${hotPost.category}</span>
                <a class="postContainer__author" href="/profile.html?id=${hotPost.ownerID}">${hotPost.ownerUsername}</a>
            </div>
        `));
    });
})();