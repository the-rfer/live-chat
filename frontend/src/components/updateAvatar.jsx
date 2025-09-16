'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
    ArrowLeftIcon,
    UserRoundPlus,
    XIcon,
    ZoomInIcon,
    ZoomOutIcon,
    AtSignIcon,
} from 'lucide-react';

import { useFileUpload } from '@/hooks/useFileUpload';
import { Button } from '@/components/ui/button';
import {
    Cropper,
    CropperCropArea,
    CropperDescription,
    CropperImage,
} from '@/components/ui/cropper';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Helper function to create a cropped image blob
const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous'); // Needed for canvas Tainted check
        image.src = url;
    });

async function getCroppedImg(
    imageSrc,
    pixelCrop,
    // Optional: specify output size
    outputWidth = pixelCrop.width,
    outputHeight = pixelCrop.height
) {
    try {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return null;
        }

        // Set canvas size to desired output size
        canvas.width = outputWidth;
        canvas.height = outputHeight;

        // Draw the cropped image onto the canvas
        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            outputWidth,
            // Draw onto the output size
            outputHeight
        );

        // Convert canvas to blob
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg'); // Specify format and quality if needed
        });
    } catch (error) {
        console.error('Error in getCroppedImg:', error);
        return null;
    }
}

export function AvatarUploader({
    finalImageUrl,
    setFinalImageUrl,
    setFinalImageFile,
}) {
    const [
        { files, isDragging },
        {
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            openFileDialog,
            removeFile,
            getInputProps,
        },
    ] = useFileUpload({
        accept: 'image/*',
    });

    const previewUrl = files[0]?.preview || null;
    const fileId = files[0]?.id;

    // const [finalImageUrl, setFinalImageUrl] = useState(null); //FIXME: aceitar valor de parent component caso exista
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Ref to track the previous file ID to detect new uploads
    const previousFileIdRef = useRef(null);

    // State to store the desired crop area in pixels
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    // State for zoom level
    const [zoom, setZoom] = useState(0);

    // Callback for Cropper to provide crop data - Wrap with useCallback
    const handleCropChange = useCallback((pixels) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const handleApply = async () => {
        if (!previewUrl || !fileId || !croppedAreaPixels) return;

        const croppedBlob = await getCroppedImg(previewUrl, croppedAreaPixels);
        if (!croppedBlob) return;

        // Convert blob to File so it has a name and type
        const fileExt = 'jpg';
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const croppedFile = new File([croppedBlob], fileName, {
            type: 'image/jpeg',
        });

        // Save blob URL for preview
        const previewObjectUrl = URL.createObjectURL(croppedFile);
        setFinalImageUrl(previewObjectUrl);

        // ALSO store the file somewhere accessible to handleSubmit
        setFinalImageFile(croppedFile);

        setIsDialogOpen(false);

        // Check if we have the necessary data
        // if (!previewUrl || !fileId || !croppedAreaPixels) {
        //     console.error('Missing data for apply:', {
        //         previewUrl,
        //         fileId,
        //         croppedAreaPixels,
        //     });
        //     // Remove file if apply is clicked without crop data?
        //     if (fileId) {
        //         removeFile(fileId);
        //         setCroppedAreaPixels(null);
        //     }
        //     return;
        // }

        // try {
        //     // 1. Get the cropped image blob using the helper
        //     const croppedBlob = await getCroppedImg(
        //         previewUrl,
        //         croppedAreaPixels
        //     );

        //     if (!croppedBlob) {
        //         throw new Error('Failed to generate cropped image blob.');
        //     }

        //     // 2. Create a NEW object URL from the cropped blob
        //     const newFinalUrl = URL.createObjectURL(croppedBlob);

        //     // 3. Revoke the OLD finalImageUrl if it exists
        //     if (finalImageUrl) {
        //         URL.revokeObjectURL(finalImageUrl);
        //     }

        //     // 4. Set the final avatar state to the NEW URL
        //     //TODO: Passar newFinalUrl para parent component
        //     setFinalImageUrl(newFinalUrl);

        //     // 5. Close the dialog (don't remove the file yet)
        //     setIsDialogOpen(false);
        // } catch (error) {
        //     console.error('Error during apply:', error);
        //     // Close the dialog even if cropping fails
        //     setIsDialogOpen(false);
        // }
    };

    const handleRemoveFinalImage = () => {
        if (finalImageUrl) {
            URL.revokeObjectURL(finalImageUrl);
        }
        //TODO: Passar newFinalUrl para parent component
        setFinalImageUrl(null);
    };

    useEffect(() => {
        const currentFinalUrl = finalImageUrl;
        // Cleanup function
        return () => {
            if (currentFinalUrl && currentFinalUrl.startsWith('blob:')) {
                URL.revokeObjectURL(currentFinalUrl);
            }
        };
    }, [finalImageUrl]);

    // Effect to open dialog when a *new* file is ready
    useEffect(() => {
        // Check if fileId exists and is different from the previous one
        if (fileId && fileId !== previousFileIdRef.current) {
            setIsDialogOpen(true); // Open dialog for the new file
            setCroppedAreaPixels(null); // Reset crop area for the new file
            setZoom(1); // Reset zoom for the new file
        }
        // Update the ref to the current fileId for the next render
        previousFileIdRef.current = fileId;
    }, [fileId]); // Depend only on fileId

    return (
        <div className='flex flex-col justify-between items-center gap-2'>
            <div className='inline-flex relative'>
                {/* Drop area - uses finalImageUrl */}
                <button
                    className='relative flex justify-center items-center data-[dragging=true]:bg-accent/50 hover:bg-accent/50 has-disabled:opacity-50 border border-input focus-visible:border-ring border-dashed has-[img]:border-none rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 size-16 overflow-hidden transition-colors has-disabled:pointer-events-none'
                    onClick={openFileDialog}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    data-dragging={isDragging || undefined}
                    aria-label={finalImageUrl ? 'Change image' : 'Upload image'}
                >
                    {finalImageUrl ? (
                        <img
                            className='size-full object-cover'
                            src={finalImageUrl}
                            alt='User avatar'
                            width={64}
                            height={64}
                            style={{ objectFit: 'cover' }}
                        />
                    ) : (
                        <div aria-hidden='true'>
                            <UserRoundPlus className='opacity-60 size-4' />
                        </div>
                    )}
                </button>
                {/* Remove button - depends on finalImageUrl */}
                {finalImageUrl && (
                    <Button
                        onClick={handleRemoveFinalImage}
                        size='icon'
                        className='-top-1 -right-1 absolute shadow-none border-2 border-background focus-visible:border-background rounded-full size-6'
                        aria-label='Remove image'
                    >
                        <XIcon className='size-3.5' />
                    </Button>
                )}
                <input
                    {...getInputProps()}
                    className='sr-only'
                    aria-label='Upload image file'
                    tabIndex={-1}
                />
            </div>
            {/* Cropper Dialog - Use isDialogOpen for open prop */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className='*:[button]:hidden gap-0 p-0 sm:max-w-140'>
                    <DialogDescription className='sr-only'>
                        Crop image dialog
                    </DialogDescription>
                    <DialogHeader className='contents space-y-0 text-left'>
                        <DialogTitle className='flex justify-between items-center p-4 border-b text-base'>
                            <div className='flex items-center gap-2'>
                                <Button
                                    type='button'
                                    variant='ghost'
                                    size='icon'
                                    className='opacity-60 -my-1'
                                    onClick={() => setIsDialogOpen(false)}
                                    aria-label='Cancel'
                                >
                                    <ArrowLeftIcon aria-hidden='true' />
                                </Button>
                                <span>Ajustar imagem</span>
                            </div>
                            <Button
                                className='-my-1'
                                onClick={handleApply}
                                disabled={!previewUrl}
                                autoFocus
                            >
                                Aplicar
                            </Button>
                        </DialogTitle>
                    </DialogHeader>
                    {previewUrl && (
                        <Cropper
                            className='h-96 sm:h-120'
                            image={previewUrl}
                            zoom={zoom}
                            onCropChange={handleCropChange}
                            onZoomChange={setZoom}
                        >
                            <CropperDescription />
                            <CropperImage />
                            <CropperCropArea />
                        </Cropper>
                    )}
                    <DialogFooter className='px-4 py-6 border-t'>
                        <div className='flex items-center gap-4 mx-auto w-full max-w-80'>
                            <ZoomOutIcon
                                className='opacity-60 shrink-0'
                                size={16}
                                aria-hidden='true'
                            />
                            <Slider
                                defaultValue={[1]}
                                value={[zoom]}
                                min={1}
                                max={3}
                                step={0.1}
                                onValueChange={(value) => setZoom(value[0])}
                                aria-label='Zoom slider'
                            />
                            <ZoomInIcon
                                className='opacity-60 shrink-0'
                                size={16}
                                aria-hidden='true'
                            />
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* <p
                aria-live='polite'
                role='region'
                className='mt-2 text-muted-foreground text-xs'
            >
                Adicione um avatar
            </p> */}
        </div>
    );
}
