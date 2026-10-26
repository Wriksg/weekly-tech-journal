'use client';

import Image from 'next/image';
import React, { useState, ChangeEvent } from 'react';
import dynamic from 'next/dynamic';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

export default function EditorPage() {
    const [markdownValue, setMarkdownValue] = useState<string | undefined>('');
    const [images, setImages] = useState<{ file: File; url: string }[]>([]);
    const MAX_IMAGES = 5;

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        const availableSlots = MAX_IMAGES - images.length;
        const filesToUpload = files.slice(0, availableSlots);

        const newImages = filesToUpload.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        setImages((prevImages) => [...prevImages, ...newImages]);
        e.target.value = '';
    };

    const removeImage = (indexToRemove: number) => {
        setImages((prevImages) => {
            URL.revokeObjectURL(prevImages[indexToRemove].url);
            return prevImages.filter((_, index) => index !== indexToRemove);
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        formData.append('content', markdownValue || ''); // Guard empty value
        images.forEach(({ file }) => formData.append('images', file));

        const title = formData.get('title');
        const content = formData.get('content');
        const submittedImages = formData.getAll('images');

        console.log('Submitting data:', { title, content, images: submittedImages });
    };

    return (
        <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black text-black dark:text-zinc-50">
            <main className="mx-auto flex w-full max-w-4xl flex-col items-stretch gap-8 bg-white px-4 py-8 dark:bg-black sm:px-8">
                <h1 className="text-5xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                    Editor Page
                </h1>
                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">Article Title:</label>
                        <input 
                            type="text" 
                            name="title" 
                            required 
                            className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-zinc-700 rounded focus:outline-blue-500"
                            placeholder="Enter a title"
                        />
                    </div>

                    {/* 4. Swapped MdEditor with correctly imported dynamic MDEditor */}
                    <div className="w-full">
                        <label className="block text-sm font-bold mb-2">Body:</label>
                        <div data-color-mode="light" className="w-full text-black">
                            <MDEditor 
                                value={markdownValue} 
                                onChange={setMarkdownValue}
                                height={400}
                            />
                        </div>
                    </div>

                    <div className="border border-gray-200 dark:border-zinc-800 rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
                            Upload Images ({images.length}/{MAX_IMAGES})
                        </h2>
                
                        <div className="flex flex-wrap gap-4">
                            {images.map(({ url }, index) => (
                                <div 
                                    key={url} 
                                    className="relative h-24 w-40 shrink-0 border border-gray-300 dark:border-zinc-700 rounded-lg overflow-hidden group bg-gray-50"
                                >
                                    <Image
                                        src={url} 
                                        alt={`Preview ${index + 1}`} 
                                        className="w-full h-full object-cover" 
                                        width={160}
                                        height={96}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}

                            {images.length < MAX_IMAGES && (
                                <label className="h-24 w-40 shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                    <svg 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        strokeWidth={1.5} 
                                        stroke="currentColor" 
                                        className="w-6 h-6 text-gray-400"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="flex w-full flex-col gap-4">
                        <button 
                            type="button"
                            className="bg-gray-200 dark:bg-zinc-800 text-black dark:text-white font-medium py-2 px-4 rounded hover:bg-gray-300 dark:hover:bg-zinc-700 transition"
                        >
                            Preview Article
                        </button>
                        
                        <button 
                            type="submit" 
                            className="bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition"
                        >
                            Submit Article
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
