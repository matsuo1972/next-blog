import { PrismaClient } from "@prisma/client";
import * as brypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    // クリーンアップ
    await prisma.user.deleteMany();
    await prisma.post.deleteMany();

    const hashedPassword = await brypt.hash("password123", 12);

    // ダミー画像
    const dummyImage = ["https://picsum.photos/seed/post1/600/400", "https://picsum.photos/seed/post2/600/400"];

    const user = await prisma.user.create({
            data: {
                email: "text@example.com",
                name: "John Doe",
                password: hashedPassword,
                posts: {
                    create: [
                        {
                            title: "My first post",
                            content: "Hello world!",
                            topImage: dummyImage[0], 
                            published: true,               
                        },  
                        {
                            title: "My second post",
                            content: "Hello again!",
                            topImage: dummyImage[1],    
                            published: true,
                        },
                    ],
                },
            },
        });            
    console.log({ user });
}   

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }
);