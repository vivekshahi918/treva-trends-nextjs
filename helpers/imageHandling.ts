import { firebaseApp } from "@/firebaseConfig";
import { uploadBytes, getDownloadURL, ref, getStorage } from "firebase/storage";

// Change 1: Moved getStorage call outside the map function to ensure it's called once.
export const uploadImagesAndReturnUrls = async (files: any) => {
    try {
        const storage = getStorage(firebaseApp); // <-- Change 1

        // Upload files and get image references
        const imageRefs = await Promise.all(
            files.map((file: any) => {
                const storageRef = ref(storage, `products/${file.name}`); // <-- Change 2
                return uploadBytes(storageRef, file);
            })
        );

        // Use image references to get download URLs
        // Change 3: Used correct reference (imageRef.ref) to get download URLs.
        const imageUrls = await Promise.all(
            imageRefs.map((imageRef: any) => getDownloadURL(imageRef.ref)) // <-- Change 3
        );

        return imageUrls;

    } catch (error: any) {
        throw new Error(error.message);
    }
};
