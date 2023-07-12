import Tasks from "@/models/Tasks";
import { connectToDB } from "@/utils/database";
import { NextRequest } from "next/server";

export const PATCH = async (req: NextRequest, { params }: { params: { id: string }}) => {
    const { task } = await req.json();
    try {
        await connectToDB();

        await Tasks.findByIdAndUpdate(params.id, {
            task
        });

        return new Response(`Successfully updated task ${params.id}`, { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(`Failed to update task ${params.id}`, { status: 500 });
    }
}

export const DELETE = async (req: NextRequest, { params }: { params: { id: string }}) => {
    try {
        await connectToDB();

        await Tasks.findByIdAndRemove(params.id);

        return new Response(`Successfully deleted task ${params.id}`, { status: 200 });
    } catch (error) {
        console.log({ error });
        return new Response(`Failed to delete ${params.id}`, { status: 500 });
    }
}