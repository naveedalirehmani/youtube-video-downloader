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
import { Check, X } from "lucide-react";
import SheetDemo from "./sheet";

function TableDemo({ data }: { data: ytdl.videoFormat[] }) {
  console.log(data, "data");
  const [progress, setProgress] = useState<number>(0);
  const [downloadStatus, setDownloadStatus] = useState<
    "started" | "finished" | "failed"
  >("finished");
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);

  const [file, setFile] = useState<{ type: string; encoding: string } | null>(
    null
  );
  const handleDownload = async (
    url: string,
    type: string,
    encoding: string
  ) => {
    setFile({
      type,
      encoding,
    });
    try {
      setDownloadStatus("started");
      setSheetOpen(true); // Open sheet when download starts
      const response = await axios({
        url,
        method: "GET",
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentCompleted = Math.round((loaded * 100) / total);
          setProgress(percentCompleted);
        },
      });

      const urlObject = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = urlObject;
      link.download = "downloader-online-" + type + "." + encoding;
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
      setSheetOpen(false); // Close sheet when download finishes or fails
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
                handleDownload(
                  item.url,
                  item?.mimeType?.split(";")[0].split("/")[0],
                  item?.mimeType?.split(";")[0].split("/")[1]
                );
              }}
              className="cursor-pointer"
            >
              <TableCell className="font-medium">
                {item?.mimeType?.split(";")[0].split("/")[0]}
              </TableCell>
              <TableCell>
                {item?.mimeType?.split(";")[0].split("/")[1]}
              </TableCell>
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
    </>
  );
}

export default TableDemo;
