import BaseTool from "@/components/BaseTool";
import { Image as ImageIcon } from "lucide-react";

export default function WebpToPng() {
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
                    "image/png"
                );
            };

            img.onerror = () => reject(new Error("Failed to load image"));
            const objUrl = URL.createObjectURL(file);
            img.src = objUrl;

            // Cleanup object URL after we get the blob or error to prevent memory leaks
            img.onloadend = () => URL.revokeObjectURL(objUrl);
        });
    };

    return (
        <BaseTool
            title="WebP to PNG"
            description="Convert WebP images to highly compatible PNG format."
            icon={ImageIcon}
            acceptedFileTypes={{
                "image/webp": [".webp"],
            }}
            fileLabel="Select WebP"
            actionLabel="Convert to PNG"
            processingLabel="Converting..."
            onProcess={handleProcess}
            downloadNamePrefix="converted"
            outputExtension="png"
            iconColorClass="text-pink-600"
        />
    );
}
