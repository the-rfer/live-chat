import {
    IonAvatar,
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonFooter,
    IonHeader,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonInput,
    IonItem,
    IonList,
    IonPage,
    IonPopover,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { ellipsisVertical, send } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import { IonInfiniteScrollCustomEvent } from '@ionic/core/dist/types/components';

const USER_ID = 1;

const MOCK_DATA = [
    {
        id: 2,
        name: 'Ava Stone',
        alias: '@avastone',
        pictureUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        online: true,
        hasUnreadMessages: 0,
        messages: [
            {
                from: 2,
                message: 'Hey! Are you free for a quick call?',
                status: 'received',
                timestamp: '2025-10-30T08:15:00Z',
            },
            {
                from: 1,
                message: 'I can do 10am.',
                status: 'read',
                timestamp: '2025-10-30T08:16:00Z',
            },
            {
                from: 2,
                message: 'Perfect — sending calendar invite now.',
                status: 'read',
                timestamp: '2025-10-30T08:17:30Z',
            },
            {
                from: 1,
                message: 'Got it, thanks!',
                status: 'read',
                timestamp: '2025-10-30T08:18:00Z',
            },
            {
                from: 2,
                message: 'Also, did you check the report I sent yesterday?',
                status: 'received',
                timestamp: '2025-10-29T18:45:00Z',
            },
            {
                from: 1,
                message: 'Not yet — I will this afternoon.',
                status: 'sent',
                timestamp: '2025-10-29T19:05:00Z',
            },
            {
                from: 2,
                message: 'No rush. Ping me if you have questions.',
                status: 'received',
                timestamp: '2025-10-29T19:06:00Z',
            },
            {
                from: 1,
                message: 'Will do 👍',
                status: 'read',
                timestamp: '2025-10-29T19:07:00Z',
            },
            {
                from: 2,
                message: 'Also, did you check the report I sent yesterday?',
                status: 'received',
                timestamp: '2025-10-29T18:45:00Z',
            },
            {
                from: 1,
                message: 'Not yet — I will this afternoon.',
                status: 'sent',
                timestamp: '2025-10-29T19:05:00Z',
            },
            {
                from: 2,
                message: 'No rush. Ping me if you have questions.',
                status: 'received',
                timestamp: '2025-10-29T19:06:00Z',
            },
            {
                from: 1,
                message: 'Will do 👍',
                status: 'read',
                timestamp: '2025-10-29T19:07:00Z',
            },
            {
                from: 2,
                message: 'Also, did you check the report I sent yesterday?',
                status: 'received',
                timestamp: '2025-10-29T18:45:00Z',
            },
            {
                from: 1,
                message: 'Not yet — I will this afternoon.',
                status: 'sent',
                timestamp: '2025-10-29T19:05:00Z',
            },
            {
                from: 2,
                message: 'No rush. Ping me if you have questions.',
                status: 'received',
                timestamp: '2025-10-29T19:06:00Z',
            },
            {
                from: 1,
                message: 'Will do 👍',
                status: 'read',
                timestamp: '2025-10-29T19:07:00Z',
            },
            {
                from: 2,
                message: 'Also, did you check the report I sent yesterday?',
                status: 'received',
                timestamp: '2025-10-29T18:45:00Z',
            },
            {
                from: 1,
                message: 'Not yet — I will this afternoon.',
                status: 'sent',
                timestamp: '2025-10-29T19:05:00Z',
            },
            {
                from: 2,
                message: 'No rush. Ping me if you have questions.',
                status: 'received',
                timestamp: '2025-10-29T19:06:00Z',
            },
            {
                from: 1,
                message: 'Will do 👍',
                status: 'read',
                timestamp: '2025-10-29T19:07:00Z',
            },
            {
                from: 2,
                message: 'Also, did you check the report I sent yesterday?',
                status: 'received',
                timestamp: '2025-10-29T18:45:00Z',
            },
            {
                from: 1,
                message: 'Not yet — I will this afternoon.',
                status: 'sent',
                timestamp: '2025-10-29T19:05:00Z',
            },
            {
                from: 2,
                message: 'No rush. Ping me if you have questions.',
                status: 'received',
                timestamp: '2025-10-29T19:06:00Z',
            },
            {
                from: 1,
                message: 'Will do 👍',
                status: 'read',
                timestamp: '2025-10-29T19:07:00Z',
            },
            {
                from: 2,
                message: 'Also, did you check the report I sent yesterday?',
                status: 'received',
                timestamp: '2025-10-29T18:45:00Z',
            },
            {
                from: 1,
                message: 'Not yet — I will this afternoon.',
                status: 'sent',
                timestamp: '2025-10-29T19:05:00Z',
            },
            {
                from: 2,
                message: 'No rush. Ping me if you have questions.',
                status: 'received',
                timestamp: '2025-10-29T19:06:00Z',
            },
            {
                from: 1,
                message: 'Will do 👍',
                status: 'read',
                timestamp: '2025-10-29T19:07:00Z',
            },
            {
                from: 2,
                message: 'Also, did you check the report I sent yesterday?',
                status: 'received',
                timestamp: '2025-10-29T18:45:00Z',
            },
            {
                from: 1,
                message: 'Not yet — I will this afternoon.',
                status: 'sent',
                timestamp: '2025-10-29T19:05:00Z',
            },
            {
                from: 2,
                message: 'No rush. Ping me if you have questions.',
                status: 'received',
                timestamp: '2025-10-29T19:06:00Z',
            },
            {
                from: 1,
                message: 'Will do 👍',
                status: 'read',
                timestamp: '2025-10-29T19:07:00Z',
            },
            {
                from: 2,
                message: 'Also, did you check the report I sent yesterday?',
                status: 'received',
                timestamp: '2025-10-29T18:45:00Z',
            },
            {
                from: 1,
                message: 'Not yet — I will this afternoon.',
                status: 'sent',
                timestamp: '2025-10-29T19:05:00Z',
            },
            {
                from: 2,
                message: 'No rush. Ping me if you have questions.',
                status: 'received',
                timestamp: '2025-10-29T19:06:00Z',
            },
            {
                from: 1,
                message: 'Will do 👍',
                status: 'read',
                timestamp: '2025-10-29T19:07:00Z',
            },
            {
                from: 2,
                message: 'Also, did you check the report I sent yesterday?',
                status: 'received',
                timestamp: '2025-10-29T18:45:00Z',
            },
            {
                from: 1,
                message: 'Not yet — I will this afternoon.',
                status: 'sent',
                timestamp: '2025-10-29T19:05:00Z',
            },
            {
                from: 2,
                message: 'No rush. Ping me if you have questions.',
                status: 'received',
                timestamp: '2025-10-29T19:06:00Z',
            },
            {
                from: 1,
                message: 'Will do 👍',
                status: 'read',
                timestamp: '2025-10-29T19:07:00Z',
            },
            {
                from: 2,
                message: 'Also, did you check the report I sent yesterday?',
                status: 'received',
                timestamp: '2025-10-29T18:45:00Z',
            },
            {
                from: 1,
                message: 'Not yet — I will this afternoon.',
                status: 'sent',
                timestamp: '2025-10-29T19:05:00Z',
            },
            {
                from: 2,
                message: 'No rush. Ping me if you have questions.',
                status: 'received',
                timestamp: '2025-10-29T19:06:00Z',
            },
            {
                from: 1,
                message: 'Will do 👍',
                status: 'read',
                timestamp: '2025-10-29T19:07:00Z',
            },
            {
                from: 2,
                message: 'Also, did you check the report I sent yesterday?',
                status: 'received',
                timestamp: '2025-10-29T18:45:00Z',
            },
            {
                from: 1,
                message: 'Not yet — I will this afternoon.',
                status: 'sent',
                timestamp: '2025-10-29T19:05:00Z',
            },
            {
                from: 2,
                message: 'No rush. Ping me if you have questions.',
                status: 'received',
                timestamp: '2025-10-29T19:06:00Z',
            },
            {
                from: 1,
                message: 'Will do 👍',
                status: 'read',
                timestamp: '2025-10-29T19:07:00Z',
            },
        ],
    },
    {
        id: 4,
        name: 'Maya Quinn',
        alias: '@maya_q',
        pictureUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        online: true,
        hasUnreadMessages: 6,
        messages: [
            {
                from: 1,
                message: 'Morning! Did you get the invoice?',
                status: 'sent',
                timestamp: '2025-10-31T07:02:00Z',
            },
            {
                from: 4,
                message: 'I see it now, checking details.',
                status: 'received',
                timestamp: '2025-10-31T07:05:00Z',
            },
            {
                from: 4,
                message: 'There is a small discrepancy on line 3.',
                status: 'received',
                timestamp: '2025-10-31T07:06:30Z',
            },
            {
                from: 4,
                message: 'Can you confirm the quantity on that item?',
                status: 'received',
                timestamp: '2025-10-31T07:07:10Z',
            },
            {
                from: 4,
                message: 'Also need the PO number.',
                status: 'received',
                timestamp: '2025-10-31T07:08:00Z',
            },
            {
                from: 4,
                message: 'Reply when you have a sec.',
                status: 'received',
                timestamp: '2025-10-31T07:09:00Z',
            },
            {
                from: 1,
                message: 'Checking now — will update shortly.',
                status: 'sent',
                timestamp: '2025-10-31T07:15:00Z',
            },
            {
                from: 4,
                message: 'Thanks!',
                status: 'received',
                timestamp: '2025-10-31T07:16:00Z',
            },
        ],
    },
    {
        id: 6,
        name: 'Zoe Hart',
        alias: '@zoehart',
        pictureUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        online: true,
        hasUnreadMessages: 1,
        messages: [
            {
                from: 6,
                message: 'Happy birthday! 🎉',
                status: 'received',
                timestamp: '2025-10-25T12:00:00Z',
            },
            {
                from: 1,
                message: 'Thanks so much!',
                status: 'read',
                timestamp: '2025-10-25T12:05:00Z',
            },
            {
                from: 6,
                message: 'Want to grab coffee this week?',
                status: 'received',
                timestamp: '2025-10-26T09:30:00Z',
            },
            {
                from: 1,
                message: 'Thursday works for me.',
                status: 'sent',
                timestamp: '2025-10-26T09:35:00Z',
            },
            {
                from: 6,
                message: 'Awesome — see you then.',
                status: 'received',
                timestamp: '2025-10-26T09:36:00Z',
            },
            {
                from: 6,
                message: 'Also, did you see the event next month?',
                status: 'received',
                timestamp: '2025-10-30T14:20:00Z',
            },
        ],
    },
];

interface RouteParams {
    id?: string;
}

const Chat: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const contentRef = useRef<HTMLIonContentElement | null>(null);

    const [message, setMessage] = useState<string>('');

    const [friend, setFriend] = useState<
        (typeof MOCK_DATA)[number] | undefined
    >(MOCK_DATA.find((user) => user.id === Number(id)));

    const handleLoadMore = async (
        event: IonInfiniteScrollCustomEvent<void>
    ) => {
        console.log('Loading more messages...');

        setFriend((prevFriend) => {
            if (!prevFriend) return prevFriend;
            return {
                ...prevFriend,
                messages: [
                    ...MOCK_DATA[Math.floor(Math.random() * 2) + 1].messages,
                    ...prevFriend.messages,
                ],
            };
        });

        event.target.complete();
    };

    const handleSend = () => {
        if (!message.trim()) return;

        const newMessage = {
            from: 1,
            status: 'sent',
            message: message,
            timestamp: new Date().toISOString(),
        };

        // temp
        setFriend((prevFriend) => {
            if (!prevFriend) return prevFriend;
            return {
                ...prevFriend,
                messages: [...prevFriend.messages, newMessage],
            };
        });

        // Clear the input
        setMessage('');
    };

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollToBottom();
        }
    }, [friend?.messages]);

    //TODO: Improve user not found page
    if (!friend)
        return (
            <IonPage>
                <IonContent fullscreen>
                    <p>User not found</p>
                </IonContent>
            </IonPage>
        );

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot='start'>
                        <IonBackButton></IonBackButton>
                    </IonButtons>

                    <IonAvatar
                        aria-hidden='true'
                        slot='start'
                        className='avatar-header'
                    >
                        <img
                            alt={`${friend.name} profile picture`}
                            src={friend.pictureUrl}
                        />
                    </IonAvatar>
                    <IonTitle>{friend?.name}</IonTitle>

                    <IonButton
                        id='open-popover'
                        slot='end'
                        className='option-button'
                    >
                        <IonIcon
                            slot='icon-only'
                            icon={ellipsisVertical}
                            className='options-icon'
                        />
                    </IonButton>
                    <IonPopover trigger='open-popover' alignment='end'>
                        <IonContent className='ion-padding'>
                            Falta adicionar as opções
                        </IonContent>
                    </IonPopover>
                </IonToolbar>
            </IonHeader>
            <IonContent ref={contentRef} fullscreen>
                <IonInfiniteScroll
                    onIonInfinite={async (event) => {
                        setTimeout(() => handleLoadMore(event), 500);
                    }}
                    position='top'
                    //FIXME: Find better way to deal with disabling infinite scroll to prevent ui space taken when chats are new
                    disabled={friend.messages.length <= 12}
                >
                    <IonInfiniteScrollContent />
                </IonInfiniteScroll>

                <IonList lines='none' className='chat-screen'>
                    {friend.messages.map((m, i) => (
                        <IonItem key={i}>
                            <div
                                className={
                                    m.from === USER_ID
                                        ? 'message message-right'
                                        : 'message message-left'
                                }
                            >
                                {m.message}
                            </div>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
            <IonFooter>
                <IonItem lines='none'>
                    <IonInput
                        type='text'
                        autoFocus={true}
                        placeholder='Message'
                        value={message}
                        className='chat-input'
                        onIonInput={(e) => setMessage(e.detail.value!)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    >
                        <IonButton
                            fill='clear'
                            slot='end'
                            aria-label='Show/hide'
                            onClick={handleSend}
                        >
                            <IonIcon
                                slot='icon-only'
                                icon={send}
                                aria-hidden='true'
                            />
                        </IonButton>
                    </IonInput>
                </IonItem>
            </IonFooter>
        </IonPage>
    );
};

export default Chat;
