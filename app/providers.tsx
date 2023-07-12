'use client';

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import SessionProvider from '@/components/SessionProvider';
import theme from "@/components/theme";

export function Providers({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <SessionProvider>
            <CacheProvider>
                <ChakraProvider theme={theme}>
                    {children}
                </ChakraProvider>
            </CacheProvider>
        </SessionProvider>
    )
}