'use client'

import MessageCard from '@/app/_userComponents/messageCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Message } from '@/model/User';
import { acceptMessageSchema } from '@/schema/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';


export default function dashboardPage() {

    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitching, setIsSwithching] = useState(false)

    // Delete Message Functionality
    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }

    const { data: session } = useSession();
    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
        defaultValues: {
            acceptMessages: false,
        }
    })

    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages')


    const fetchAcceptMessages = useCallback(async () => {

        setIsSwithching(true)
        try {
            const response = await axios.get<ApiResponse>(`/api/accept-messages`)
            setValue('acceptMessages', response.data.isAcceptingMessages as boolean)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || 'Failed to fetch message settings')
        }
    }, [setValue, toast])

    // Fetch all messages
    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        setIsSwithching(false);

        try {
            const response = await axios.get<ApiResponse>(`/api/get-messages`)
            setMessages(response.data.messages || []);

            if (refresh) {
                toast.loading('Refreshed Messages')
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || 'Failed to fetch Messages')
        } finally {
            setIsLoading(false);
            setIsSwithching(false);
        }

    }, [setIsLoading, toast, setMessages])

    // Fetch initial state from the server
    useEffect(() => {
        if (!session || !session.user) return;

        fetchMessages();

        fetchAcceptMessages();
    }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages,
            });
            setValue('acceptMessages', !acceptMessages);
            toast.success(response.data.message)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || 'Failed to update message settings')
        }
    };

    if (!session || !session.user) {
        return <div></div>;
    }

    const { username } = session.user;

    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/you/${username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast.success('URL Copied')
    };

    return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto w-full max-w-6xl">
      <div className="bg-[#0f1724] border border-white/5 rounded-2xl shadow-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">User Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage messages and profile settings</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
              }}
              className="px-3 py-2 rounded-md bg-linear-to-r from-indigo-500 to-violet-500 text-white shadow-md"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6">
          <div className="bg-[#081425] border border-white/3 rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white">Your profile link</h2>
              <p className="text-gray-400 text-sm mt-1">Share this link so people can leave you anonymous messages.</p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="w-full md:w-96 bg-[#071a2a] text-white rounded-md p-2 border border-white/6"
              />
              <Button onClick={copyToClipboard} className="px-4 py-2 rounded-md bg-linear-to-r from-indigo-500 to-violet-500 text-white">
                Copy
              </Button>
            </div>
          </div>

          <div className="bg-[#081425] border border-white/3 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Switch
                {...register('acceptMessages')}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitching}
              />
              <div>
                <p className="text-sm text-white">Accept Messages</p>
                <p className="text-xs text-gray-400">{acceptMessages ? 'On — anyone can send you messages' : 'Off — messages are disabled'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Messages</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <MessageCard
                    key={message._id}
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                  />
                ))
              ) : (
                <p className="text-gray-400">No messages to display.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}