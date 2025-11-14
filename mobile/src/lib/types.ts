export type User = {
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null | undefined;
    createdAt: string | Date;
    updatedAt: string | Date;
    id: string;
};
