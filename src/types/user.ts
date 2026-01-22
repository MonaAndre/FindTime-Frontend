export interface UserDto {
    email: string;
    firstName: string;
    lastName: string;
    birthday?: string | null;
    profilePicLink?: string | null;
    phoneNumber?: string | null;
}