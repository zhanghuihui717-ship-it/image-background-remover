"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    }
  };

  const handleRemoveBackground = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to remove background");
      }

      const data = await response.json();
      setResult(data.resultUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result;
    link.download = "removed-background.png";
    link.click();
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          Background Remover
        </h1>
        <p className="text-slate-500">Remove image background in seconds</p>
      </header>

      <div className="w-full max-w-xl">
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors bg-white">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg"
            />
          ) : (
            <div className="py-12">
              <svg
                className="mx-auto h-12 w-12 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-4 text-slate-600">Drop your image here</p>
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors"
          >
            {preview ? "Change Image" : "Select Image"}
          </label>
        </div>

        {file && !result && (
          <div className="mt-6 text-center">
            <button
              onClick={handleRemoveBackground}
              disabled={loading}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Processing..." : "Remove Background"}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-center">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 text-center">
              Result
            </h2>
            <div className="flex justify-center">
              <div className="bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xMkMEa+wAAABDSURBVDhPY/hPIRgFAwyYmIGJ579g/MGM4P8Kxhz4+f8/YwZG4P8KIzAYgf+VMABjDny8wAgMRuA/I4MR+A8A3wwMRuA/E4MR+A8ALEYIAOPPMfkAAAAASUVORK5CYII=')] p-4 rounded-lg">
                <img
                  src={result}
                  alt="Result"
                  className="max-h-64 rounded-lg"
                />
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleDownload}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Download Image
              </button>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                  setResult(null);
                  setError(null);
                }}
                className="text-slate-500 hover:text-slate-700"
              >
                Try Another Image
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-16 text-slate-400 text-sm">
        Powered by Remove.bg API
      </footer>
    </main>
  );
}
