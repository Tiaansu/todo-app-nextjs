'use client';

import { 
    Avatar, 
    Box, 
    Button, 
    Flex, 
    HStack, 
    Image, 
    Link, 
    Menu, 
    MenuButton, 
    MenuList} from '@chakra-ui/react';
import { useSession, signOut } from 'next-auth/react';
import { FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
    const { data: session } = useSession();

    return (
        <>
            <Box bg={'gray.900'} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <HStack spacing={8} alignItems={'center'}>
                        <Link href={'/'}>
                            <Box>
                                <Image 
                                    src={'/images/logo.png'}
                                    boxSize={'100px'}
                                />
                            </Box>
                        </Link>
                    </HStack>
                    <Flex alignItems={'center'}>
                        <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}
                            >
                                <Avatar 
                                    name={session?.user.name!}
                                    size={'sm'}
                                    src={`${session?.user.image!}`}
                                    referrerPolicy={'no-referrer'}
                                />
                            </MenuButton>
                            <MenuList>
                                <Button
                                    variant={'ghost'}
                                    leftIcon={<FaSignOutAlt />}
                                    width={'full'}
                                    padding={0}
                                    margin={0}
                                    onClick={() => signOut()}
                                >
                                    Sign out
                                </Button>
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>
            </Box>
        </>
    )
}

export default Navbar