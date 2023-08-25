"use client";

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from '@/lib/validations/user';
import * as z from "zod";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing"
import { updateUser } from "@/lib/actions/user.action";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  user: {
    id: string,
    objectId: string,
    username: string,
    name: string,
    bio: string,
    image: string
  };
  btnTitle: string
}


const AccountProfile = ({ user, btnTitle }: Props) => {

  const [files, setFiles] = useState<File[]>([]);

  const { startUpload } = useUploadThing("media"); // define upload as a hook

  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    }
  });

  const onSubmit = async (values: z.infer<typeof UserValidation>) => { // This FN is going to re-upload the new image, and update the user in DB
    const blob = values.profile_photo;

    const hasImageChanged = isBase64Image(blob); // this FN from utils
    if (hasImageChanged) {
      const imgRes = await startUpload(files); // uploaded image
      if (imgRes && imgRes[0].fileUrl) {
        values.profile_photo = imgRes[0].fileUrl;
      }
    };

    // TODO: Call backend to update user profile
    await updateUser({
      name: values.name,
      path: pathname,
      username: values.username,
      userId: user.id,
      bio: values.bio,
      image: values.profile_photo,
    });

    pathname === '/profile/edit' ? router.back() : router.push('/');
  };

  const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
    e.preventDefault(); // prevent the browser reload

    const fileReader = new FileReader(); // Initializing a fileReader
    if (e.target.files && e.target.files.length > 0) { // Checking whether the files actually exist; >0 fixed icon display change
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes('image')) return;

      // If not the case
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || '';
        fieldChange(imageDataUrl); // which allows us to update that by passing the imageDataUrl
      };

      fileReader.readAsDataURL(file); // this should allow us to change image, buy not changed in display
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10 space-y-8">
        <FormField
          control={form.control}
          name='profile_photo'
          render={({ field }) => (
            <FormItem className='flex items-center gap-4'>
              <FormLabel className='account-form_image-label'>
                {/* This works only if we have a profie folder to show */}
                {field.value ? (
                  <Image src={field.value} alt='profile photo' width={96} height={96} priority className='object-contain rounded-full' />
                ) : (
                  <Image src='/assets/profile.svg' alt='profile photo' width={24} height={24} className='object-contain' />
                )}
              </FormLabel>
              <FormControl className='flex-1 text-gray-200 text-base-semibold'>
                <Input
                  type='file'
                  accept='image/*'
                  placeholder='Add profile photo'
                  className='account-form_image-input'
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='flex flex-col w-full gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Name
              </FormLabel>
              <FormControl>
                <Input type="text"
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='flex flex-col w-full gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Userame
              </FormLabel>
              <FormControl className='flex-1 text-gray-200 text-base-semibold'>
                <Input type="text"
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem className='flex flex-col w-full gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Bio
              </FormLabel>
              <FormControl className='flex-1 text-gray-200 text-base-semibold'>
                <Textarea rows={10}
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">Submit</Button>
      </form>
    </Form>
  )
}

export default AccountProfile;