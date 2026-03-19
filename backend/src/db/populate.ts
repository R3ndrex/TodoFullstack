import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
async function main() {
    try {
        console.log("started seeding");
        await prisma.user.deleteMany();
        await prisma.todo.deleteMany();
        const bob = await prisma.user.create({
            data: {
                name: "Bob",
                email: "bob@gmail.com",
                password: await bcrypt.hash("BobTheBuilder123", 10),
            },
        });
        await prisma.todo.create({
            data: {
                title: "Design database",
                content: "Users and todos with relations",
                done: true,
                userId: bob.id,
            },
        });
        await prisma.todo.create({
            data: {
                title: "Build frontend",
                content: "React with React Query",
                done: false,
                userId: bob.id,
            },
        });
        console.log("seeding ended");
    } catch (e) {
        console.error(e);
    } finally {
        prisma.$disconnect();
    }
}
main();
