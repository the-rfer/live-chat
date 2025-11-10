import {
    IonAvatar,
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonSkeletonText,
    IonThumbnail,
} from '@ionic/react';
import { add } from 'ionicons/icons';

import '../theme/variables.css';

const MOCK_DATA = [
    {
        id: 1,
        name: 'John Doe',
        alias: '@johndoe',
        pictureUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        online: false,
        hasUnreadMessages: 3,
    },
    {
        id: 2,
        name: 'Ava Stone',
        alias: '@avastone',
        pictureUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        online: true,
        hasUnreadMessages: 0,
    },
    {
        id: 3,
        name: 'Liam Rivers',
        alias: '@liamr',
        pictureUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        online: false,
        hasUnreadMessages: 0,
    },
    {
        id: 4,
        name: 'Maya Quinn',
        alias: '@maya_q',
        pictureUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        online: true,
        hasUnreadMessages: 6,
    },
    {
        id: 5,
        name: 'Ethan Cole',
        alias: '@ethanc',
        pictureUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        online: false,
        hasUnreadMessages: 2,
    },
    {
        id: 6,
        name: 'Zoe Hart',
        alias: '@zoehart',
        pictureUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        online: true,
        hasUnreadMessages: 0,
    },
    {
        id: 7,
        name: 'Noah Blake',
        alias: '@noahblake',
        pictureUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        online: true,
        hasUnreadMessages: 8,
    },
    {
        id: 8,
        name: 'Ivy Stone',
        alias: '@ivystone',
        pictureUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        online: false,
        hasUnreadMessages: 0,
    },
    {
        id: 9,
        name: 'Oscar Vale',
        alias: '@oscarvale',
        pictureUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        online: true,
        hasUnreadMessages: 0,
    },
    {
        id: 10,
        name: 'Luna Park',
        alias: '@lunapark',
        pictureUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        online: false,
        hasUnreadMessages: 1,
    },
    {
        id: 11,
        name: 'Aria West',
        alias: '@ariawest',
        pictureUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        online: true,
        hasUnreadMessages: 4,
    },
    {
        id: 12,
        name: 'Mason Reed',
        alias: '@masonreed',
        pictureUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        online: false,
        hasUnreadMessages: 0,
    },
    {
        id: 13,
        name: 'Chloe Park',
        alias: '@chloepark',
        pictureUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        online: true,
        hasUnreadMessages: 2,
    },
    {
        id: 14,
        name: 'Caleb Frost',
        alias: '@calebf',
        pictureUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        online: false,
        hasUnreadMessages: 0,
    },
    {
        id: 15,
        name: 'Sofia Lane',
        alias: '@sofialane',
        pictureUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        online: true,
        hasUnreadMessages: 5,
    },
    {
        id: 16,
        name: 'Theo Grant',
        alias: '@theog',
        pictureUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        online: false,
        hasUnreadMessages: 1,
    },
    {
        id: 17,
        name: 'Nora King',
        alias: '@noraking',
        pictureUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        online: true,
        hasUnreadMessages: 0,
    },
    {
        id: 18,
        name: 'Riley Moss',
        alias: '@rileym',
        pictureUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        online: false,
        hasUnreadMessages: 7,
    },
    {
        id: 19,
        name: 'Paige Bell',
        alias: '@paigeb',
        pictureUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        online: true,
        hasUnreadMessages: 0,
    },
    {
        id: 20,
        name: 'Wyatt Cole',
        alias: '@wyattcole',
        pictureUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        online: false,
        hasUnreadMessages: 3,
    },
];

const MOCK_VALUE = 1;

const FriendsList: React.FC = () => {
    //TODO:
    // 1. isLoading from state.
    // 2. MOCK_VALUE from friends length based on response from API.
    // 3. Pass real data to List component.
    const isLoading = false;
    return isLoading ? <Loading /> : MOCK_VALUE > 0 ? <List /> : <EmptyList />;
};

export default FriendsList;

const Loading: React.FC = () => {
    return (
        <IonList>
            {Array.from({ length: 10 }).map((_, index) => {
                const opacityValue = 110 - index * 10;
                return (
                    <IonItem
                        lines='full'
                        key={index}
                        style={{ opacity: `${opacityValue}%` }}
                    >
                        <IonThumbnail
                            slot='start'
                            className='skeleton-thumbnail'
                        >
                            <IonSkeletonText
                                animated={true}
                                className='skeleton-avatar'
                            ></IonSkeletonText>
                        </IonThumbnail>
                        <IonLabel>
                            <h3>
                                <IonSkeletonText
                                    animated={true}
                                    style={{ width: '60%' }}
                                ></IonSkeletonText>
                            </h3>
                            <p>
                                <IonSkeletonText
                                    animated={true}
                                    style={{ width: '30%' }}
                                ></IonSkeletonText>
                            </p>
                        </IonLabel>
                    </IonItem>
                );
            })}
        </IonList>
    );
};

const EmptyList: React.FC = () => {
    return (
        <IonCard className='friends-empty-card'>
            <IonCardHeader>
                <IonCardTitle>No friends found</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
                It seems you have no friends added yet.
                <br />
                Start by adding some friends to your list and connect with them!
            </IonCardContent>

            <IonButton fill='solid' shape='round'>
                <IonIcon slot='icon-only' icon={add}></IonIcon>
            </IonButton>
        </IonCard>
    );
};

const List: React.FC = () => {
    return (
        <IonList>
            {MOCK_DATA.sort((a, b) => Number(b.online) - Number(a.online)).map(
                (friend, index) => (
                    <IonItemSliding key={index}>
                        <IonItemOptions side='start'>
                            <IonItemOption color='success' expandable>
                                Archive
                            </IonItemOption>
                        </IonItemOptions>
                        <IonItem
                            routerLink={`/chat/${friend.id}`}
                            routerDirection='forward'
                            detail={false}
                            lines='full'
                        >
                            <div className='avatar-container' slot='start'>
                                <IonAvatar aria-hidden='true' slot='start'>
                                    <img
                                        alt={`${friend.name} profile picture`}
                                        src={friend.pictureUrl}
                                    />
                                </IonAvatar>
                                {friend.online && (
                                    <span className='status-dot'></span>
                                )}
                            </div>

                            <IonLabel>
                                <h2>{friend.name}</h2>
                                <p>{friend.alias}</p>
                            </IonLabel>

                            {friend.hasUnreadMessages > 0 && (
                                <IonBadge slot='end' className='message-badge'>
                                    {friend.hasUnreadMessages}
                                </IonBadge>
                            )}
                        </IonItem>
                        <IonItemOptions side='end'>
                            <IonItemOption color='danger' expandable>
                                Delete
                            </IonItemOption>
                        </IonItemOptions>
                    </IonItemSliding>
                )
            )}
        </IonList>
    );
};
