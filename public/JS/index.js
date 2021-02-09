let isAuthenticated = false;
let username;
let posts = [];
let categories = [];

(async () => {
    const authenticationResponse = await authenticate();

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

        $postsContainerELM.html(posts.map((post) => `
            <div class="postContainer">
                <a class="postContainer__title" href="/blog.html?id=${post._id}">${post.title}</a>
                <span class="postContainer__description">${post.content}</span>
                <span class="postContainer__category">${post.category}</span>
                <a class="postContainer__author" href="${username === post.ownerUsername ? '/me.html' : `/profile.html?id=${post.ownerID}`}">${post.ownerUsername}</a>
            </div>
        `).join(''));

        $infoContainerLinksContainerELM.html(categories.map((category, idx) => `
            <a class="infoContainerLinksContainer__link" href="/blogs.html?category=${category}">${category}${idx !== categories.length - 1 ? ',' : ''}</a>
        `).join(''));
    });
})();
