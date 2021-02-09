const postBlog = async (data) => {
    const serverResponse = await fetch('api/blog/postBlog', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify(data),
    });

    return serverResponse.json();
};

const getCategories = async () => {
    const serverResponse = await fetch('api/blog/getCategories', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    return serverResponse.json();
};

const getCategoryPosts = async (data) => {
    const serverResponse = await fetch(`api/blog/getCategoryPosts?category=${data}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    return serverResponse.json();
}

const getPosts = async () => {
    const serverResponse = await fetch('api/blog/getPosts', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    return serverResponse.json();
};

const getPost = async (data) => {
    const serverResponse = await fetch(`api/blog/getPost?postID=${data}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    return serverResponse.json();
};

const postComment = async (data) => {
    const serverResponse = await fetch('api/blog/postComment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify(data),
    });

    return serverResponse.json();
}

const getUserStatistics = async (data) => {
    const serverResponse = await fetch(`api/blog/getUserStatistics?postOwnerID=${data}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    return serverResponse.json();
};

const getHotPosts = async () => {
    const serverResponse = await fetch('api/blog/getHotPosts', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    return serverResponse.json();
}