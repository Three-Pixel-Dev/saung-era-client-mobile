export const mockLogin = async (email: string, password: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === "test@example.com" && password === "password") {
        return {
            accessToken: "mock_access_token",
            refreshToken: "mock_refresh_token",
            user: { id: 1, email, firstName: "John", lastName: "Doe" },
        };
    } else {
        throw new Error("Invalid credentials");
    }
};

export const mockFetchProducts = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
        { id: 1, name: "Product 1", price: 10 },
        { id: 2, name: "Product 2", price: 20 },
        { id: 3, name: "Product 3", price: 30 },
    ];
};
