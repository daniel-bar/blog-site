let isAuthenticated = false;
let ownUsername;

let username;
let email;
let postsCounter;
let commentsCounter;
let posts;

(async () => {
    const authenticationResponse = await authenticate();

    if (authenticationResponse.success) {
        isAuthenticated = true;
        ownUsername = authenticationResponse.data.username;
    }

    const queries = new URLSearchParams(window.location.search);

    const userDetailsResponse = await getUserDetails(queries.get('id'));

    if (userDetailsResponse.success) {
        username = userDetailsResponse.data.username;
        email = userDetailsResponse.data.email;
        postsCounter = userDetailsResponse.data.postsCounter;
        commentsCounter = userDetailsResponse.data.commentsCounter;
        posts = userDetailsResponse.data.posts;
    } else {
        return window.location.href = '/error.html';
    }

    $(document).ready(async () => {
        // Username and auth buttons elements
        const $authButtonsContainerELM = $('#authButtonsContainer');
        const $navUserContainerELM = $('#navUserContainer');
        const $usernameTextELM = $('#usernameText');
        const $logoutButtonELM = $('#logoutButton');

        $authButtonsContainerELM.css('display', 'none');
        $navUserContainerELM.css('display', 'flex');
        $usernameTextELM.html(ownUsername);

        $logoutButtonELM.on('click', () => {
            localStorage.removeItem('auth_token');
            return window.location.href = '/';
        });

        // Username and email elements
        const $profileUsernameTextELM = $('#profileUsernameText');
        const $profileEmailTextELM = $('#profileEmailText');
        const $profilePostsCounterELM = $('#profilePostsCounter');
        const $profileCommentsCounterELM = $('#profileCommentsCounter');
        const $postsContainerELM = $('#postsContainer');

        $profileUsernameTextELM.html(username);
        $profileEmailTextELM.html(email);
        $profilePostsCounterELM.html(`Posts created: ${postsCounter}`);
        $profileCommentsCounterELM.html(`Comments created: ${commentsCounter}`);

        console.log(authenticationResponse)

        $postsContainerELM.html(posts.map((post) => `
            <div class="postContainer">
                <a class="postContainer__title" href="/blog.html?id=${post._id}">${post.title}</a>
                <span class="postContainer__description">${post.content}</span>
                <span class="postContainer__category">${post.category}</span>
                <span class="postContainer__author">${username}</span>
            </div>
        `).join(''));
    });
})();
