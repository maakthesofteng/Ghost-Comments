'use client'

import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs'
import { X } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/ApiResponse';
import { Card, CardContent, CardHeader} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Message } from '@/model/User';

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
};

export default function MessageCard({ message, onMessageDelete }: MessageCardProps) {

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(
                `/api/delete-message/${message._id}`
            );
            toast.success(response.data.message)
            onMessageDelete(message._id);

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || 'Failed to delete message')
        }
    };

    return (
        <Card className="bg-linear-to-r from-indigo-900 via-indigo-800 to-violet-700 border border-white/6 rounded-lg shadow-xl overflow-hidden">
            <CardHeader className="px-4 py-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-r from-indigo-500 to-violet-500 text-white shadow-md">
                            <span className="text-xl">👻</span>
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-white">Anonymous message</div>
                            <div className="text-xs text-indigo-200">{dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" className="p-2 rounded-md text-rose-300 hover:bg-white/5">
                                    <X className="w-4 h-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete
                                        this message.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteConfirm}>
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-4 pb-4 pt-2">
                <p className="text-white/95 leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </CardContent>
        </Card>
    );
}