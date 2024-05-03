"use client";

import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import * as ytdl from "ytdl-core";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Download, Loader2 } from "lucide-react";
import Image from "next/image";
import TableDemo from "@/components/custom/table";

/*
https://www.youtube.com/watch?v=R_1AutOoOUg
*/

const formSchema = z.object({
  videoUrl: z.string().url({
    message: "Please enter a valid URL for the video.",
  }),
});

type Props = {};

function Page({}: Props) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      startTransition(async () => {
        const response = await fetch("/api", {
          method: "POST",
          body: JSON.stringify({ url: values.videoUrl }),
        });
        const info = await response.json();
        setFormats(info.formats);
      });
    } catch (error) {
      console.error("Error fetching video information:", error);
    }
  }

  console.log(isPending, "isPending");

  const [formats, setFormats] = useState<ytdl.videoFormat[]>([]);

  const extractVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2]) {
      return match[2];
    } else {
      return null;
    }
  };

  const videoUrl = form.getValues("videoUrl");
  const videoId = extractVideoId(videoUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  return (
    <div className="container">
     
      <div>
        <div className=" text-center mt-10 md:mt-48 mb-16 md:mb-36">
          <h1 className="flex  justify-between text-5xl md:text-7xl font-semibold">
            <Image
              src="/play.png"
              className="hidden lg:block w-40 h-20 -translate-y-14"
              width={200}
              height={100}
              alt="youtube icon"
            ></Image>
            <span>
              YouTube Video
              <span className="inline-block relative">
                <span className="-rotate-3 border-b-8 rounded-3xl border-blue-500 absolute bottom-0 left-0 right-0 -translate-y-2"></span>
                <span className="relative z-10 ml-4">Downloader</span>
              </span>
            </span>
            <Image
              src="/youtube.png"
              className="hidden lg:block w-20 h-20 -translate-y-14"
              width={200}
              height={100}
              alt="youtube icon"
            ></Image>
          </h1>
          <p className="flex justify-center text-gray-600 text-lg md:text-2xl md:leading-9 mt-10 md:tracking-wide dark:text-gray-300">
            <span>
              Try this unique tool for quick, hassle-free downloads from
              <br className="hidden md:block" />
              YouTube. Transform your offline video collection with this
              <br className="hidden md:block" />
              reliable and efficient downloader.
            </span>
            <Image
              src="/music.png"
              className="hidden lg:block w-20 h-20 translate-y-24 translate-x-24"
              width={200}
              height={100}
              alt="youtube icon"
            ></Image>
          </p>
        </div>
        <div className="md:px-40">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full items-center p-[12px] rounded-[21px] shadow-custom dark:shadow-custom-white dark:border-[#101e2e] dark:border-2"
            >
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        type="search"
                        id="default-search"
                        className="h-12 border-none text-md md:text-xl bg-transparent"
                        placeholder="example : https://www.youtube.com/watch?v=iU03_U34823I8"
                      />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="flex items-center justify-between md:space-x-2 bg-blut rounded-[9px] py-6 md:px-10 dark:text-white dark:hover:bg-blut dark:hover:brightness-75"
                disabled={isPending}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <span className="hidden md:block">Download</span>
                <Download className="block md:hidden"></Download>
              </Button>
            </form>
          </Form>
        </div>

        <div className="banner bg-gray-800 rounded-2xl py-10 text-center my-20">
          <p className="text-white text-md md:text-xl ">
            WE DO NOT ALLOW/SUPPORT THE DOWNLOAD OF COPYRIGHTED MATERIAL!
          </p>
        </div>
      </div>

      {!!formats.length && (
        <>
          <div className="rounded-lg overflow-hidden my-20">
            <iframe
              className="d-flex w-full h-[200px] md:h-[600px]"
              src={embedUrl || ""}
            ></iframe>
          </div>
          <div className="mt-10 mb-20">
            <TableDemo data={formats}></TableDemo>
          </div>
        </>
      )}
    </div>
  );
}

export default Page;
