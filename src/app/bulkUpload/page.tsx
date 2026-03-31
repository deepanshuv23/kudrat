"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/ui/datatable";
import { Progress } from "~/components/ui/progress";
import { TableSkeleton } from "~/components/ui/skeletons";
import { useBatteryQuery, type Device } from "~/lib/model/battery";
import { auth$ } from "~/lib/states/auth";
import { settings$ } from "~/lib/states/settings";
import { cn } from "~/lib/utils";
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Cloud, FileUp } from 'lucide-react';
import axios from 'axios';

const meta = {
  headerClassName: "text-center w-fit",
  cellClassName: "text-center",
  btnClassName: "justify-center",
};

const columns: ColumnDef<Device>[] = [
  {
    header: "Camera ID",
    accessorKey: "cameraId",
    meta: {
      ...meta,
      inAccordionTrigger: true,
    },
  },
  {
    header: "Location",
    accessorKey: "sublocation",
    meta,
  },
  {
    header: "Last Updated On",
    accessorKey: "dateTime",
    meta,
  },
  {
    header: "Battery",
    accessorKey: "batteryPercentage",
    cell: ({ cell }) => {
      const value = cell.getValue() as number;
      return (
        <Progress
          className={cn(
            "h-4 w-[20vw] border md:w-auto",
            value > 60
              ? "border-success"
              : value > 30
                ? "border-warning"
                : "border-destructive",
          )}
          value={value}
          max={100}
          indicator={{
            className:
              "bg-" +
              (value > 60 ? "success" : value > 30 ? "warning" : "destructive"),
          }}
        >
          <span className="absolute left-0 z-10 h-full w-full text-center align-middle text-xs font-bold text-foreground">
            {value}%
          </span>
        </Progress>
      );
    },
    meta: {
      ...meta,
      inAccordionTrigger: true,
    },
  },
  {
    header: "Network Operator",
    accessorKey: "simOperator",
    meta,
  },
];

const MAX_FILES = 5000;
const MAX_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB in bytes

interface FileStatus {
  name: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  progress: number;
  error?: string;
}


export default function BatteryMonitor() {
  const auth = auth$.get();
  const settings = settings$.get();

  const devices = useBatteryQuery({
    params: {
      location: settings.currentLocation ?? auth?.location[0],
    },
  });
  const [files, setFiles] = useState<File[]>([]);
  const [fileStatuses, setFileStatuses] = useState<FileStatus[]>([]);
  const [processing, setProcessing] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [errorFiles, setErrorFiles] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const totalSize = acceptedFiles.reduce((acc, file) => acc + file.size, 0);
    if (acceptedFiles.length > MAX_FILES) {
      setMessage(`Too many files. Maximum is ${MAX_FILES}.`);
    } else if (totalSize > MAX_SIZE) {
      setMessage(`Total size exceeds 2 GB limit.`);
    } else {
      setFiles(acceptedFiles);
      setFileStatuses(acceptedFiles.map(file => ({
        name: file.name,
        status: 'pending',
        progress: 0
      })));
      setMessage(`${acceptedFiles.length} files selected.`);
      setErrorFiles([]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    maxFiles: MAX_FILES,
  });

  const processAndPublish = async () => {
    setProcessing(true);
    setOverallProgress(0);
    setErrorFiles([]);

    let successfulUploads = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;
      setFileStatuses(prev => prev.map((f, index) => 
        index === i ? { ...f, status: 'processing', progress: 0 } : f
      ));

      try {
        const base64 = await fileToBase64(file);
        const response = await axios.post('/api/publish-to-pubsub', {
          fileName: file.name,
          fileContent: base64
        });

        setFileStatuses(prev => prev.map((f, index) => 
          index === i ? { ...f, status: 'success', progress: 100 } : f
        ));

        successfulUploads++;
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
        setFileStatuses(prev => prev.map((f, index) => 
          index === i ? { ...f, status: 'error', progress: 100, error: 'Failed to process' } : f
        ));
        setErrorFiles(prev => [...prev, file.name]);
      }

      setOverallProgress(((i + 1) / files.length) * 100);
    }

    setProcessing(false);
    setMessage(`All files processed. ${successfulUploads} of ${files.length} were successful.`);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
  return (
    <div className="flex flex-col gap-4 px-8 pt-4">
      <h2 className="text-4xl font-medium">Bulk Upload</h2>
      <div className="max-w-4xl mx-auto">
  <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
    {/* Header */}
    <div className="px-8 py-6 bg-gradient-to-r from-gray-800 to-gray-900">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Cloud className="w-6 h-6" />
        PubSub Image Upload
      </h2>
      <p className="text-gray-300 mt-2">
        Upload and process multiple images through Google Cloud PubSub
      </p>
    </div>

    <div className="p-8">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-3 border-dashed rounded-xl p-10 transition-all duration-300 ease-in-out
          ${isDragActive 
            ? 'border-gray-600 bg-gray-100' 
            : 'border-gray-300 hover:border-gray-500 hover:bg-gray-50'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center text-center">
          <Upload className={`w-12 h-12 mb-4 ${isDragActive ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className="text-lg font-medium mb-2">
            {isDragActive 
              ? "Drop your images here"
              : "Drag and drop your images here"
            }
          </p>
          <p className="text-sm text-gray-500">
            or <span className="text-black hover:text-gray-600 cursor-pointer">browse files</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Maximum {MAX_FILES} files, 2GB total size
          </p>
        </div>
      </div>

      {/* Process Button and Progress */}
      <div className="mt-6 space-y-4">
        {files.length > 0 && (
          <button
            onClick={processAndPublish}
            disabled={processing}
            className={`
              w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300
              flex items-center justify-center gap-2
              ${processing 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-gray-800 hover:bg-gray-900 active:bg-black shadow-lg hover:shadow-xl'
              }
            `}
          >
            <FileUp className="w-5 h-5" />
            {processing ? 'Processing...' : `Process ${files.length} File${files.length !== 1 ? 's' : ''}`}
          </button>
        )}

        {processing && (
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Processing Files</h3>
                <p className="text-sm text-gray-500">
                  Please wait while your files are being processed
                </p>
              </div>
              <span className="text-2xl font-bold text-gray-800">
                {Math.round(overallProgress)}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gray-800 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Status Message */}
      {message && !processing && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{message}</p>
        </div>
      )}
    </div>
  </div>
</div>

    </div>
  );
}
