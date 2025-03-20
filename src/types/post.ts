export type Post = {
    id: string;
    title: string;
    content: string;
    topImage: string | null;
    published: boolean;
    createdAt: Date;
    author: {
        id: string;
        name: string;
    }
};

export type PostCardProps = { post: Post };