export function optimizeImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onerror = () => {
            reject(new Error("Gambar tidak dapat dibaca"));
        };

        reader.onload = () => {
            const image = new Image();

            image.onerror = () => {
                reject(new Error("Format gambar tidak didukung"));
            };

            image.onload = () => {
                const maxSize = 480;

                const scale = Math.min(
                    1,
                    maxSize / Math.max(image.width, image.height),
                );

                const canvas = document.createElement("canvas");

                canvas.width = Math.round(image.width * scale);
                canvas.height = Math.round(image.height * scale);

                const context = canvas.getContext("2d");

                if (!context) {
                    reject(new Error("Gambar tidak dapat diproses"));
                    return;
                }

                context.drawImage(
                    image,
                    0,
                    0,
                    canvas.width,
                    canvas.height,
                );

                resolve(
                    canvas.toDataURL("image/webp", 0.82),
                );
            };

            image.src = String(reader.result);
        };

        reader.readAsDataURL(file);
    });
}