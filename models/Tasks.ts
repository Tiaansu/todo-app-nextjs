import { Schema, model, models } from "mongoose";

export interface TaskType {
    userId: string;
    task: string;
    isDone: boolean;
};

const schema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    task: {
        type: String
    },
    isDone: {
        type: Boolean,
        default: false
    }
});

const Tasks = models.Tasks || model('Tasks', schema);

export default Tasks;