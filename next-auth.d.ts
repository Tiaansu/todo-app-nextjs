import { DefaultSession, Profile } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            sub?: string | null | undefined;
            id?: string;
        } & DefaultSession['user']
    }
}

declare module 'next-auth' {
    interface Profile extends Profile {
        id?: number | string;
        username?: string;
        login?: string;
        picture?: string & {
            data: {
                height: number;
                is_silhouette: boolean;
                url: string;
                width: number;
            }
        },
        avatar_url?: string;
        image_url?: string;
    }
}