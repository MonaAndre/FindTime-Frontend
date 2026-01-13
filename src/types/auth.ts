export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePictureLink?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterRequest {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    birthDate: string;
}

export interface AuthResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePictureLink?: string;
}


