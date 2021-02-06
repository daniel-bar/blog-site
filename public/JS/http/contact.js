const contact = async (data) => {
    const serverResponse = await fetch('/api/contact/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify(data),
    });

    return serverResponse.json();
};