import Tasks from "@/models/Tasks";
import { connectToDB } from "@/utils/database";
import { NextRequest } from "next/server";

export const PATCH = async (req: NextRequest, { params }: { params: { id: string }}) => {
    const { status } = await req.json();
    try {
        await connectToDB();

        await Tasks.findByIdAndUpdate(params.id, {
            isDone: status
        });

        return new Response(`Successfully set task to ${status ? 'done' : 'not done'}`, { status: 200 });
    } catch (error) {
        console.log({ error });
        return new Response(`Failed to set task ${params.id} to ${status ? 'done' : 'not done'}.`, { status: 500 });
    }
}