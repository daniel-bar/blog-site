const updateProfile = async (data) => {
    const serverResponse = await fetch('/api/user/editProfile', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify(data),
    });

    return serverResponse.json();
};

const getUserDetails = async (data) => {
    const serverResponse = await fetch(`/api/user/getUserDetails?id=${data}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return serverResponse.json();
};