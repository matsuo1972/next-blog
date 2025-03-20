import { prisma } from '@/lib/prisma';

export async function getPosts() {
    return await prisma.post.findMany({
        where: {
            published: true,
        },
        include: {
            author: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

// 1件取得
export async function getPost(id: string) {
    return await prisma.post.findUnique({
        where: { id },
        include: { author: { select: { name: true } } },
    });
}

export async function searchPosts(keyword: string) {
    console.log(`Searching ${keyword}`);
    // URL からパラメータをデコードして正規化
    const decodedKeyword = decodeURIComponent(keyword);
    console.log(`Decoded keyword: ${decodedKeyword}`);
    // スペース、全角スペースを単空白に置き換えて trim する
    const normalizedKeyword = decodedKeyword.replace(/[\s　]+/g, ' ').trim();
    console.log(`Normalized keyword: ${normalizedKeyword}`);
    // 単語に分割して空白を除去
    const searchKeywords = normalizedKeyword.split(' ').filter(Boolean);
    console.log(`Search keywords: ${searchKeywords}`);

    const filters = searchKeywords.map((keyword) => ({
        OR: [
            { title: { contains: keyword } },
            { content: { contains: keyword } },
        ],
    }));
    console.log(`Filters: ${JSON.stringify(filters)}`);
    return await prisma.post.findMany({
        where: {
            AND: filters, // 複数のキーワードにマッチするデータを取得
            published: true,
        },
        include: {
            author: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}