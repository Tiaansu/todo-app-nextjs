import { NextRequest } from "next/server";
import { connectToDB } from "@/utils/database";
import Tasks, { TaskType } from "@/models/Tasks";

export const POST = async (req: NextRequest) => {
    const { userId, task, isDone } = await req.json() as TaskType;

    try {
        await connectToDB();

        const newTask = new Tasks({
            creator: userId,
            task,
            isDone
        });

        await newTask.save();

        return new Response(JSON.stringify(newTask), { status: 201 });
    } catch (error) {
        return new Response('Failed to create a new task', { status: 500 });
    }
}