import BaseTool from "@/components/BaseTool";
import { Image as ImageIcon } from "lucide-react";

export default function PngToWebp() {
    const handleProcess = async (file: File) => {
        return new Promise<Blob>((resolve, reject) => {
            const img = new Image();
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0);
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error("Canvas toBlob failed"));
                        }
                    },
                    "image/webp",
                    0.9 // quality
                );
            };

            img.onerror = () => reject(new Error("Failed to load image"));
            const objUrl = URL.createObjectURL(file);
            img.src = objUrl;

            img.onloadend = () => URL.revokeObjectURL(objUrl);
        });
    };

    return (
        <BaseTool
            title="PNG to WebP"
            description="Convert PNG images to WebP format for smaller file sizes."
            icon={ImageIcon}
            acceptedFileTypes={{
                "image/png": [".png"],
            }}
            fileLabel="Select PNG"
            actionLabel="Convert to WebP"
            processingLabel="Converting..."
            onProcess={handleProcess}
            downloadNamePrefix="converted"
            outputExtension="webp"
            iconColorClass="text-pink-600"
        />
    );
}
