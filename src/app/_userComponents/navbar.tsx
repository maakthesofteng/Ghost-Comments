'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from '@/components/ui/button';

function Navbar() {
    const { data: session } = useSession();
    const user: User = session?.user;

    return (
        <nav className="w-full bg-[#071026] text-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-violet-400">
                        Ghost Comments
                    </span>
                </Link>

                <div className="flex items-center gap-3">
                    {session ? (
                        <>
                            <span className="hidden sm:inline-block text-sm text-gray-300 mr-2">
                                Welcome, {user?.username || user?.email}
                            </span>
                            <Button
                                onClick={() => signOut()}
                                className="px-4 py-2 rounded-md bg-linear-to-r from-indigo-500 to-violet-500 text-sm text-white shadow-lg hover:opacity-95"
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/sign-in" className="hidden sm:inline-block">
                                <Button className="px-4 py-2 rounded-md border border-white/20 text-sm text-white hover:bg-white/5">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button className="px-4 py-2 rounded-full bg-linear-to-r from-indigo-500 to-violet-500 text-sm font-medium text-white shadow-lg">
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;