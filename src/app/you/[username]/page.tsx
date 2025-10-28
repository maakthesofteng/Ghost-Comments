'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schema/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
    return messageString.split(specialChar);
};

const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
    const params = useParams<{ username: string }>();
    const username = params.username;

    // Ai message suggestions
    const [suggestions, setSuggestions] = useState<string[]>(parseStringMessages(initialMessageString));
    const [isSuggestLoading, setIsSuggestLoading] = useState(false);

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
    });

    const messageContent = form.watch('content');

    const handleMessageClick = (message: string) => {
        form.setValue('content', message);
    };

    const [isLoading, setIsLoading] = useState(false);

    //   Send Message to backend
    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.post<ApiResponse>('/api/send-message', {
                ...data,
                username,
            });
            toast.success(response.data.message);
            form.reset({ ...form.getValues(), content: '' });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || 'Failed to send message');
        } finally {
            setIsLoading(false);
        }
    };

    //   Ai suggestion from github models
    const fetchSuggestedMessages = async () => {
        setIsSuggestLoading(true);
        try {
            const response = await axios.post('/api/suggest-ai-message');
            const questionsString = response.data.questions;
            const parsed = parseStringMessages(questionsString);
            setSuggestions(parsed);
            toast.success('AI suggested messages updated!');
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to fetch suggested messages');
        } finally {
            setIsSuggestLoading(false);
        }
    };

    return (
        <div className="min-h-screen mx-auto my-12 p-6 bg-[#071026] rounded-2xl max-w-4xl text-white">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-center text-white">
                Public Profile
            </h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm text-gray-200">Send an anonymous message to <span className="font-medium">@{username}</span></FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Write your anonymous message here"
                                        className="resize-none bg-[#081425] text-white placeholder-gray-400"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center">
                        {isLoading ? (
                            <Button disabled className="px-6 py-3 rounded-full bg-linear-to-r from-indigo-500 to-violet-500">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isLoading || !messageContent} className="px-6 py-3 rounded-full bg-linear-to-r from-indigo-500 to-violet-500">
                                Send It
                            </Button>
                        )}
                    </div>
                </form>
            </Form>

            <div className="space-y-4 my-8">
                <div className="space-y-2">
                    <Button
                        onClick={fetchSuggestedMessages}
                        className="my-4 px-4 py-2 rounded-md bg-linear-to-r from-indigo-500 to-violet-500 text-white font-medium!"
                        disabled={isSuggestLoading}
                    >
                        {isSuggestLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                            </>
                        ) : (
                            'Suggest Messages'
                        )}
                    </Button>
                    <p className="text-gray-300">Click on any suggested message below to select it.</p>
                </div>
                <Card className="bg-[#081425] border border-white/6">
                    <CardHeader>
                        <h3 className="text-lg font-semibold text-white">Messages</h3>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-4">
                        {suggestions.length > 0 ? (
                            suggestions.map((message, index) => (
                                <Button
                                    key={index}
                                    className="mb-2 text-white px-4 py-2 rounded-md bg-linear-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 transition-colors duration-200 shadow-sm"
                                    onClick={() => handleMessageClick(message)}
                                >
                                    {message}
                                </Button>
                            ))
                        ) : (
                            <p className="text-gray-400">No messages to display.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Separator className="my-6" />
            <div className="text-center">
                <div className="mb-4">Get Your Message Board</div>
                <Link href={'/sign-up'}>
                    <Button>Create Your Account</Button>
                </Link>
            </div>
        </div>
    );
}
