"use client";
import React, { useState } from "react";
import axios from "axios";
import * as ytdl from "ytdl-core";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AudioLines,
  Check,
  Headphones,
  Music,
  Presentation,
  Video,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import SheetDemo from "./sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function TableDemo({ data }: { data: ytdl.videoFormat[] }) {
  const [progress, setProgress] = useState<number>(0);
  const [downloadStatus, setDownloadStatus] = useState<
    "started" | "finished" | "failed"
  >("finished");
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);

  const [file, setFile] = useState<{ encoding: string } | null>(null);
  const handleDownload = async (url: string, encoding: string) => {
    setFile({
      encoding,
    });
    try {
      setDownloadStatus("started");
      setSheetOpen(true);

      const encodedUrl = encodeURIComponent(url);

      const response = await axios.get(`/api/download?url=${encodedUrl}`, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          //@ts-ignore
          const percentCompleted = Math.round((loaded * 100) / total);
          setProgress(percentCompleted);
        },
      });

      const urlObject = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = urlObject;
      link.download = "downloader-online-" + "." + encoding;
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(urlObject);
      document.body.removeChild(link);

      setProgress(0);
      setDownloadStatus("finished");
    } catch (error) {
      console.error("Error downloading file:", error);
      setProgress(0);
      setDownloadStatus("failed");
    } finally {
      setSheetOpen(false);
    }
  };

  return (
    <>
      <SheetDemo
        sheetOpen={sheetOpen}
        progress={progress}
        downloadStatus={downloadStatus}
        file={file}
      />
      <Tabs defaultValue="All">
        <TabsList className="grid w-full grid-cols-3 mb-10">
          <TabsTrigger value="All">All</TabsTrigger>
          <TabsTrigger value="Video">Video</TabsTrigger>
          <TabsTrigger value="Audio">Audio</TabsTrigger>
        </TabsList>
        <TabsContent value="All">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-gray-900">
                <TableHead className="w-[200px]">Type</TableHead>
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
                    handleDownload(
                      item.url,
                      //@ts-ignore
                      item?.mimeType?.split(";")[0].split("/")[1]
                    );
                  }}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium flex flex-row gap-2 justify-start">
                    {item?.mimeType?.split(";")[0].split("/")[0] === "video" ? (
                      <span>
                        <Video></Video>
                      </span>
                    ) : (
                      <span>
                        <Music></Music>
                      </span>
                    )}
                    <span>{item?.mimeType?.split(";")[0].split("/")[0]}</span>
                  </TableCell>
                  <TableCell className="font-medium">
                    {item?.mimeType?.split(";")[0].split("/")[1]}
                  </TableCell>
                  <TableCell>
                    {item.hasVideo ? item.height + "p" : ""}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    {!item.hasAudio ? (
                      <VolumeX color="red" />
                    ) : (
                      <Volume2 color="#7ccf1d" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="Video">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-gray-900">
                <TableHead className="w-[200px]">Type</TableHead>
                <TableHead>Encoding</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead className="text-right">Audio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((item) => {
                if (!(item?.mimeType?.split(";")[0].split("/")[0] === "video"))
                  return;
                return (
                  <TableRow
                    key={item.url}
                    onClick={() => {
                      handleDownload(
                        item.url,
                        //@ts-ignore
                        item?.mimeType?.split(";")[0].split("/")[1]
                      );
                    }}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium flex flex-row gap-2 justify-start">
                      {item?.mimeType?.split(";")[0].split("/")[0] ===
                      "video" ? (
                        <span>
                          <Video></Video>
                        </span>
                      ) : (
                        <span>
                          <Music></Music>
                        </span>
                      )}
                      <span>{item?.mimeType?.split(";")[0].split("/")[0]}</span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {item?.mimeType?.split(";")[0].split("/")[1]}
                    </TableCell>
                    <TableCell>
                      {item.hasVideo ? item.height + "p" : ""}
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      {!item.hasAudio ? (
                        <VolumeX color="red" />
                      ) : (
                        <Volume2 color="#7ccf1d" />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="Audio">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-gray-900">
                <TableHead className="w-[200px]">Type</TableHead>
                <TableHead>Encoding</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead className="text-right">Audio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((item) => {
                if (!(item?.mimeType?.split(";")[0].split("/")[0] === "audio"))
                  return;
                return (
                  <TableRow
                    key={item.url}
                    onClick={() => {
                      handleDownload(
                        item.url,
                        //@ts-ignore
                        item?.mimeType?.split(";")[0].split("/")[1]
                      );
                    }}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium flex flex-row gap-2 justify-start">
                      {item?.mimeType?.split(";")[0].split("/")[0] ===
                      "video" ? (
                        <span>
                          <Video></Video>
                        </span>
                      ) : (
                        <span>
                          <Music></Music>
                        </span>
                      )}
                      <span>{item?.mimeType?.split(";")[0].split("/")[0]}</span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {item?.mimeType?.split(";")[0].split("/")[1]}
                    </TableCell>
                    <TableCell>
                      {item.hasVideo ? item.height + "p" : ""}
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      {!item.hasAudio ? (
                        <VolumeX color="red" />
                      ) : (
                        <Volume2 color="#7ccf1d" />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </>
  );
}

export default TableDemo;
