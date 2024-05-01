"use client";

import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import * as ytdl from "ytdl-core";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { raleway } from "@/fonts";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { Check, Download, Loader2, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

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
        const sortedFormats = info.formats.sort((a: any, b: any) =>
          //@ts-ignore
          Number(a.mimeType < b.mimeType)
        );
        setFormats(sortedFormats);
      });
    } catch (error) {
      console.error("Error fetching video information:", error);
    }
  }

  console.log(isPending, "isPending");

  const [formats, setFormats] = useState<ytdl.videoFormat[]>([]);
  const router = useRouter();

  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const isActive = theme === "dark";

  return (
    <div className="container">
      <div className="flex justify-between py-6">
        <div
          className={cn(
            raleway.className,
            "logo text-xl md:text-4xl font-extrabold"
          )}
        >
          downloader.<span className="text-blut">online</span>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="airplane-mode"
            checked={isActive}
            onCheckedChange={toggleTheme}
          />
          <Label htmlFor="airplane-mode" className="text-sm md:text-2xl">
            Dark Mode
          </Label>
        </div>
      </div>
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
                <span className="border-b-8 rounded-lg border-blue-500 absolute bottom-0 left-0 right-0 -translate-y-2"></span>
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
              Try this unique tool for quick, hassle-free downloads from{" "}
              <br className="hidden md:block" />
              YouTube. Transform your offline video collection with this{" "}
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
              className="flex w-full items-center p-[12px] rounded-[21px] shadow-custom dark:shadow-custom-white"
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
                        placeholder="example : https://www.youtube.com/watch?v=iU03_Ub85I8"
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
              className="d-flex w-full md:h-[600px]"
              src={`https://www.youtube.com/embed/${
                form.getValues("videoUrl").split("v=")[1]
              }`}
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

function TableDemo({ data }: { data: ytdl.videoFormat[] }) {
  const router = useRouter();

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const urlObject = window.URL.createObjectURL(blob);

      // Create an anchor element
      const link = document.createElement("a");
      link.href = urlObject;
      link.download = "audio.mp4"; // Specify the filename here
      document.body.appendChild(link);
      link.click();

      // Clean up
      window.URL.revokeObjectURL(urlObject);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Type</TableHead>
          <TableHead>Encoding</TableHead>
          <TableHead>Quality</TableHead>
          <TableHead className="text-right">Audio</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item) => (
          <TableRow
            key={item.url}
            onClick={() => {
              // handleDownload(item.url);
              router.push(item.url);
            }}
            className="cursor-pointer"
          >
            <TableCell className="font-medium">
              {item?.mimeType?.split(";")[0].split("/")[0]}
            </TableCell>
            <TableCell>{item?.mimeType?.split(";")[0].split("/")[1]}</TableCell>
            <TableCell>{item.hasVideo ? item.height + "p" : ""}</TableCell>
            <TableCell className="flex justify-end">
              {!item.hasAudio ? (
                <X color="red" strokeWidth={3} />
              ) : (
                <Check color="#7ccf1d" strokeWidth={3} />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
