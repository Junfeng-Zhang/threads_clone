"use client";

import * as z from "zod";
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { CommentsValidation } from '@/lib/validations/thread';
// import { updateUser } from "@/lib/actions/user.action";
import { usePathname, useRouter } from "next/navigation";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.action";
// import { createThread } from "@/lib/actions/thread.action";

interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {

  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentsValidation),
    defaultValues: {
      thread: '',
    }
  });

  const onSubmit = async (values: z.infer<typeof CommentsValidation>) => {
    await addCommentToThread(threadId, values.thread, JSON.parse(currentUserId), pathname);

    form.reset(); // if you want to add yet another comment
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="comment-form">
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex items-center w-full gap-3'>
              <FormLabel>
                <Image src={currentUserImg} alt="Profile image" width={48} height={48} className="object-cover rounded-full" />
              </FormLabel>
              <FormControl className="bg-transparent border-none">
                <Input type="input"
                  placeholder="Comment.."
                  className="outline-none no-focus text-light-1"
                  {...field}
                />
              </FormControl>

            </FormItem>
          )}
        />

        <Button type="submit" className="comment-form_btn">Reply</Button>
      </form>
    </Form>
  )
}

export default Comment