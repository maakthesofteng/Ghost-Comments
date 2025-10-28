"use client"

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { verifySchema } from '@/schema/verifySchema';

export default function VerifyCode() {
    const router = useRouter();
    const params = useParams<{ username: string }>();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues : {
            code : ''
        }
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {

        try {
            const response = await axios.post<ApiResponse>(`/api/verify-code`, {
                username: params.username,
                code: data.code,
            })

            toast.success(response.data.message || "Successfully Verified")
            router.replace('/sign-in')
        } catch (error) {
            console.error('Error during Verify Code:', error);
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage =
                axiosError.response?.data.message ||
                'Problem occured in verifying code / Wrong code Enter';
            toast.error(errorMessage);
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#071026] px-4 py-12">
            <div className="w-full max-w-md p-8 space-y-8 bg-[#0f1724] border border-white/5 rounded-2xl shadow-2xl text-white">
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
                        Verify your account
                    </h1>
                    <p className="text-gray-300 mb-4">Enter the verification code we sent to your email address.</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Verification Code</FormLabel>
                                    <Input {...field} className="bg-[#081425] text-white" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="bg-linear-to-r from-indigo-500 to-violet-500">Verify</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}