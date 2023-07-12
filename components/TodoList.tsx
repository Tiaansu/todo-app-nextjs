'use client';

import { 
    AlertDialog,
    AlertDialogBody,
    AlertDialogCloseButton,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box, 
    Button, 
    Center, 
    Checkbox, 
    Flex, 
    FormControl, 
    FormLabel, 
    HStack, 
    Heading, 
    Input, 
    Modal, 
    ModalBody, 
    ModalCloseButton, 
    ModalContent, 
    ModalFooter, 
    ModalHeader, 
    ModalOverlay, 
    Spacer, 
    Text, 
    Tooltip} from "@chakra-ui/react";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, Suspense, useEffect, useRef, useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import { BaseTodoType } from "@/types/TodoTypes";

const Task = ({ task, setTodos }: { task: BaseTodoType, setTodos: Dispatch<SetStateAction<BaseTodoType[]>> }) => {
    const [checked, setChecked] = useState(task.isDone);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(false);
    const [editValue, setEditValue] = useState(task.task);
    const [editSubmitting, setEditSubmitting] = useState(false);
    const cancelRef = useRef(null);

    const handleCheckbox = async (e: ChangeEvent<HTMLInputElement>, taskId: string) => {
        setChecked(e.target.checked);
        task.isDone = e.target.checked;
        await axios.patch(`/api/task/${taskId}/finish`, {
            status: checked ? false : true 
        });
    };

    const handleDeleteTask = async (taskId: string) => {
        await axios.delete(`/api/task/${taskId}`);

        const response = await axios.get(`/api/task/by/${task.creator}`);
        const tasks = response.data;
        setTodos(tasks); 
    }

    const handleEdit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEditSubmitting(true);

        try {
            const response = await axios.patch(`/api/task/${task._id}`, {
                task: editValue
            });

            if (response.status === 200) {
                const response = await axios.get(`/api/task/by/${task.creator}`);
                const tasks = response.data;
                setTodos(tasks); 
            }
        } catch (error) {
            console.log(error);
        } finally {
            setEditValue('');
            setEditDialog(false);
            setEditSubmitting(false);
        }
    }

    return (
        <Flex pt={2}>
            <Checkbox position={'static'} defaultChecked={checked} onChange={(e) => handleCheckbox(e, task._id!)} />
            <Input 
                position={'static'}
                mx={2}
                textDecoration={checked ? 'line-through' : 'none'}
                variant={checked ? 'filled' : 'outline'}
                disabled={checked ? true : false}
                value={task.task}
                onChange={(e) => DOMRectReadOnly}
            />
            <Tooltip
                isDisabled={checked ? false : true}
                hasArrow
                label={'You must unchecked this task first to edit!'}
                placement={'left'}
            >
                <Button
                    position={'static'}
                    variant={'outline'}
                    colorScheme={'yellow'}
                    isDisabled={checked ? true : false}
                    onClick={(e) => setEditDialog(true)}
                >
                    Edit
                </Button>
            </Tooltip>
            <Button
                position={'static'}
                variant={'solid'}
                colorScheme={'red'}
                ml={1}
                onClick={(e) => setDeleteDialog(true)}
            >
                Delete
            </Button>

            <Modal
                isCentered
                onClose={() => setEditDialog(false)}
                isOpen={editDialog}
            >
                <form
                    onSubmit={handleEdit}
                >
                    <FormControl isRequired>
                        <ModalOverlay 
                            bg={'blackAlpha.100'}
                            backdropFilter={'blur(10px)'}
                        />

                        <ModalContent>
                            <ModalHeader>Edit task</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                <FormLabel>Task name</FormLabel>
                                <Input placeholder={'Task name'} defaultValue={task.task} onChange={(e) => setEditValue(e.target.value)} required={true} />
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                    colorScheme={'red'}
                                    variant={'outline'}
                                    onClick={(e) => setEditDialog(false)}
                                >
                                    <Center>
                                        <Text>
                                            Close
                                        </Text>
                                    </Center>
                                </Button>
                                <Button
                                    colorScheme={'green'}
                                    variant={'solid'}
                                    type={'submit'}
                                    ml={2}
                                    isLoading={editSubmitting ? true : false}
                                    loadingText={'Editing'}
                                    spinnerPlacement={'start'}
                                >
                                    <Center>
                                        <Text>
                                            Edit
                                        </Text>
                                    </Center>
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </FormControl>
                </form>
            </Modal>

            <AlertDialog
                motionPreset={'scale'}
                leastDestructiveRef={cancelRef}
                onClose={() => setDeleteDialog(false)}
                isOpen={deleteDialog}
                isCentered
            >
                <AlertDialogOverlay 
                    bg={'blackAlpha.100'}
                    backdropFilter={'blur(10px)'} 
                />

                <AlertDialogContent>
                    <AlertDialogHeader>Delete task?</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        Are you sure you want to delete this task?
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button
                            ref={cancelRef}
                            onClick={(e) => setDeleteDialog(false)}
                        >
                            No
                        </Button>
                        <Button
                            colorScheme={'red'}
                            ml={3}
                            onClick={(e) => {
                                setDeleteDialog(false);
                                handleDeleteTask(task._id!);
                                redirect('/');
                            }}
                        >
                            Yes
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Flex>
    )
}

const Tasks = ({ tasks, setTodos }: { tasks: BaseTodoType[], setTodos: Dispatch<SetStateAction<BaseTodoType[]>> }) => (
    tasks.map((task) => (
        <Task task={task} key={task._id} setTodos={setTodos} />
    ))
)

const TodoList = () => {
    const [value, setValue] = useState('');
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [todos, setTodos] = useState<BaseTodoType[]>([]);

    async function fetchUserTasks() {
        const response = await axios.get(`/api/task/by/${session?.user.id}`);
        const tasks = response.data;
        setTodos(tasks);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await axios.post('/api/task/new', {
                userId: session?.user.id,
                task: value,
                isDone: false
            });

            if (response.status === 201) {
                await fetchUserTasks();
            }
        } catch (err) {
            console.log(err);
        } finally {
            setValue('');
            setIsOpen(false);
            setSubmitting(false);
        }
    };

    useEffect(() => {
        fetchUserTasks()
    }, []);

    return (
        <Box maxWidth={'8xl'} margin={'auto'} p={5}>
            <HStack>
                <Heading>Todo List</Heading>
                <Spacer />
                <Button
                    variant={'solid'}
                    colorScheme={'cyan'}
                    size={'md'}
                    leftIcon={<AddIcon />}
                    onClick={() => setIsOpen(true)}
                >
                    Create Task
                </Button>
            </HStack>

            <Modal
                isCentered
                onClose={() => setIsOpen(false)}
                isOpen={isOpen}
            >
                <form
                    onSubmit={handleSubmit}
                >
                    <FormControl isRequired>
                        <ModalOverlay 
                            bg={'blackAlpha.100'}
                            backdropFilter={'blur(10px)'}
                        />

                        <ModalContent>
                            <ModalHeader>Create new task</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                <FormLabel>Task name</FormLabel>
                                <Input placeholder={'Task name'} value={value} onChange={(e) => setValue(e.target.value)} required={true} />
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                    colorScheme={'red'}
                                    variant={'outline'}
                                    onClick={(e) => setIsOpen(false)}
                                >
                                    <Center>
                                        <Text>
                                            Close
                                        </Text>
                                    </Center>
                                </Button>
                                <Button
                                    colorScheme={'green'}
                                    variant={'solid'}
                                    type={'submit'}
                                    ml={2}
                                    isLoading={submitting ? true : false}
                                    loadingText={'Creating'}
                                    spinnerPlacement={'start'}
                                >
                                    <Center>
                                        <Text>
                                            Create
                                        </Text>
                                    </Center>
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </FormControl>
                </form>
            </Modal>

            <Suspense fallback={'Loading tasks...'}>
                <Tasks tasks={todos} setTodos={setTodos} />
            </Suspense>
        </Box>
    )
}

export default TodoList