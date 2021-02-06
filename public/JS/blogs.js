let isAuthenticated = false;
let username;
let posts = [];
let categories = [];

(async () => {
    const authenticationResponse = await getSelfDetails();

    if (authenticationResponse.success) {
        isAuthenticated = true;
        username = authenticationResponse.data.username;
    }

    const getPostsResponse = await getPosts();

    if (!getPostsResponse.success) {
        return window.location.href = '/error.html';
    }

    posts = getPostsResponse.data.posts;

    const getCategoriesResponse = await getCategories();

    if (!getCategoriesResponse.success) {
        return window.location.href = '/error.html';
    }

    categories = getCategoriesResponse.data.categories;

    if (authenticationResponse.success) {
        isAuthenticated = true;
        username = authenticationResponse.data.username;
    }

    $(document).ready(() => {
        // Elements
        const $authButtonsContainerELM = $('#authButtonsContainer');
        const $navUserContainerELM = $('#navUserContainer');
        const $usernameTextELM = $('#usernameText');
        const $logoutButtonELM = $('#logoutButton');
        const $pageHeaderContainerELM = $('#pageHeaderContainer');
        const $postsContainerELM = $('#postsContainer');
        const $infoContainerLinksContainerELM = $('#infoContainerLinksContainer');

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

        $pageHeaderContainerELM.html(categories.map((category) => `
        <div class="pageHeaderContainer__header">${category}</div>
        `).join(''));

        $postsContainerELM.html(posts.map((post) => `
            <div class="postContainer">
                <a class="postContainer__title" href="/blog.html?id=${post._id}">${post.title}</a>
                <span class="postContainer__description">${post.content}</span>
                <span class="postContainer__category">${post.category}</span>
                <span class="postContainer__author">${post.ownerUsername}</span>
            </div>
        `).join(''));
    });
})();
