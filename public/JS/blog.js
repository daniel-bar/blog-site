let isAuthenticated = false;
let username;
let post;

(async () => {
    const authenticationResponse = await authenticate();

    if (authenticationResponse.success) {
        isAuthenticated = true;
        username = authenticationResponse.data.username;
    }

    const queries = new URLSearchParams(window.location.search);

    const getPostResponse = await getPost(queries.get('id'));

    if (!getPostResponse.success) {
        return window.location.href = '/error.html';
    }

    post = getPostResponse.data.post;
    const comments = getPostResponse.data.post.comments;

    $(document).ready(() => {
        // Elements
        const $authButtonsContainerELM = $('#authButtonsContainer');
        const $navUserContainerELM = $('#navUserContainer');
        const $usernameTextELM = $('#usernameText');
        const $logoutButtonELM = $('#logoutButton');
        const $blogTitleELM = $('#blogTitle');
        const $blogContentELM = $('#blogContent');
        const $blogAuthorELM = $('#blogAuthor');
        const $commentFormContentELM = $('#commentFormContent');
        const $commentFormELM = $('#commentForm');
        const $commentsContainer = $('#commentsContainer');


        if (isAuthenticated) {
            $authButtonsContainerELM.css('display', 'none');
            $navUserContainerELM.css('display', 'flex');
            $usernameTextELM.html(username);
        } else {
            $authButtonsContainerELM.css('display', 'flex');
            $navUserContainerELM.css('display', 'none');
        }

        $blogTitleELM.html(post.title);
        $blogContentELM.html(post.content);
        $blogAuthorELM.html(post.ownerUsername);

        $commentsContainer.html(comments.map((comment) => `
            <div class="commentContainer">
                <p class="commentContainer__content">${comment.content}</p>
                <span class="commentContainer__author">${comment.username}</span>
                <hr class="commentContainer__divider">
            </div>
        `).join(''));

        $logoutButtonELM.on('click', () => {
            localStorage.removeItem('auth_token');
            return window.location.href = '/';
        });

        // Error element
        const $errorELM = $('#error');

        let onSendRequest = false;

        if (!isAuthenticated) {
            $commentFormELM.css('display', 'none')
        }

        $commentFormELM.on('submit', async (event) => {
            event.preventDefault();

            if (!onSendRequest) {
                onSendRequest = true;
            }

            const data = {
                postID: queries.get('id'),
                content: $commentFormContentELM.val(),
            }

            try {
                const serverResponseData = await postComment(data);

                if (serverResponseData.success) {
                    return window.location.reload();
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