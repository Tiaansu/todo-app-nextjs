import Tasks from "@/models/Tasks";
import { connectToDB } from "@/utils/database";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { id: string }}) => {
    try {
        await connectToDB();

        const tasks = await Tasks.find({ creator: params.id });

        return new Response(JSON.stringify(tasks), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify(`Failed to fetch all tasks of ${params.id}`), { status: 500 });
    }
}