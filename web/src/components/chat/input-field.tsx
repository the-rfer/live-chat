import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export function InputField() {
    const [message, setMessage] = useState('');

    return (
        <div className='flex items-center gap-2 w-full'>
            <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className='max-w-full h-10 resize-none scrollbar-hide'
            />
            <Button
                type='button'
                variant='ghost'
                // size='icon'
                className='flex border w-10 h-10'
            >
                <Send />
            </Button>
        </div>
    );
}
