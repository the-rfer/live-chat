'use client';

import { Cropper as CropperPrimitive } from '@origin-space/image-cropper';

import { cn } from '@/lib/utils';

function Cropper({ className, ...props }) {
    return (
        <CropperPrimitive.Root
            data-slot='cropper'
            className={cn(
                'relative flex justify-center items-center focus:outline-none w-full overflow-hidden touch-none cursor-move',
                className
            )}
            {...props}
        />
    );
}

function CropperDescription({ className, ...props }) {
    return (
        <CropperPrimitive.Description
            data-slot='cropper-description'
            className={cn('sr-only', className)}
            {...props}
        />
    );
}

function CropperImage({ className, ...props }) {
    return (
        <CropperPrimitive.Image
            data-slot='cropper-image'
            className={cn(
                'w-full h-full object-cover pointer-events-none',
                className
            )}
            {...props}
        />
    );
}

function CropperCropArea({ className, ...props }) {
    return (
        <CropperPrimitive.CropArea
            data-slot='cropper-crop-area'
            className={cn(
                'absolute shadow-[0_0_0_9999px_rgba(0,0,0,0.3)] border-3 border-white rounded-full in-[[data-slot=cropper]:focus-visible]:ring-[3px] in-[[data-slot=cropper]:focus-visible]:ring-white/50 pointer-events-none',
                className
            )}
            {...props}
        />
    );
}

export { Cropper, CropperDescription, CropperImage, CropperCropArea };
