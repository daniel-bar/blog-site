const authenticate = async () => {
    try {
        const serverResponse = await fetch('/api/auth/getUsername', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
            },
        });
        const serverResponseData = await serverResponse.json();

        if (serverResponseData.success) {
            return {
                success: true,
                data: {
                    username: serverResponseData.data.username,
                },
            };
        } else {
            return {
                success: false,
                data: {
                    not_auth: true,
                },
            };
        }
    } catch {
        return {
            success: false,
            data: {
                not_auth: false,
            }
        };
    }
};

const handleLogin = async (data) => {
    const serverResponse = await fetch('api/auth/handleLogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    return serverResponse.json();
};

const handleRegister = async (data) => {
    const serverResponse = await fetch('api/auth/handleRegister', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    return serverResponse.json();
};

const getSelfDetails = async () => {
    const serverResponse = await fetch('/api/auth/getSelfDetails', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
    });

    return serverResponse.json();
};