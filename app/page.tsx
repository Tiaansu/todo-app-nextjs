'use client';
import { AbsoluteCenter, Box, Button, Center, Text } from '@chakra-ui/react';
import { BuiltInProviderType } from 'next-auth/providers';
import { ClientSafeProvider, LiteralUnion, getProviders, signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import HomePage from '@/components/HomePage';

export default function Home() {
    const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null);
    const { status, data: session } = useSession();

    useEffect(() => {
        const setupProviders = async () => {
            const response = await getProviders();

            setProviders(response);
        }

        setupProviders();
    }, []);
    
    return (
        <Box position={'relative'} h={'100vh'}>
            {status !== 'authenticated'
                ? (
                    <AbsoluteCenter axis={'both'}>
                        {providers &&
                            Object.values(providers).map((provider) => (
                                <Button
                                    variant={'solid'}
                                    colorScheme={'gray'}
                                    leftIcon={<FcGoogle />}
                                    key={provider.name}
                                    boxShadow={'lg'}
                                    onClick={() => signIn(provider.id)}
                                >
                                    <Center>
                                        <Text>
                                            Sign in with {provider.name}
                                        </Text>
                                    </Center>
                                </Button>
                            ))}
                    </AbsoluteCenter>
                )
                : (
                    <HomePage />
                )
            }
        </Box>
    )
}
