export async function apiFetch(url, options = {}) {
    const res = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });

    if (res.status === 401) {
        const refreshed = await fetch('/refresh', {
            method: 'POST',
            credentials: 'include',
        });

        if (refreshed.ok) {
            return await fetch(url, {
                ...options,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...(options.headers || {}),
                },
            });
        }
    }

    return res;
}
