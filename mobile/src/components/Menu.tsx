import {
    IonContent,
    IonFooter,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonMenu,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import { book, build, exit, home } from 'ionicons/icons';
import { useHistory } from 'react-router';
import ThemeToggle from './ThemeToggle';
import { logout } from '@/lib/auth';

//TODO:
// 1. Create nested route for options /settins/:setting so all options can be dealt in same page with sub menu
const MENU_OPTIONS = [
    { title: 'Profile', url: '/', icon: home },
    { title: 'Notifications', url: '/dashboard', icon: book },
    { title: 'Invite Friends', url: '/settings', icon: build },
    { title: 'Settings', url: '/settings', icon: build },
];

const Menu = ({ contentId }: { contentId: string }) => {
    const navigate = useHistory();

    async function handleSignOut() {
        await logout().then(() => navigate.push('/login'));
    }

    return (
        <IonMenu contentId={contentId} type='reveal'>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Menu</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className='ion-padding-top'>
                <IonList lines='none'>
                    {MENU_OPTIONS.map((option, index) => {
                        return (
                            <IonItem
                                key={index}
                                routerLink={option.url}
                                routerDirection='forward'
                                detail={false}
                            >
                                <IonIcon
                                    slot='start'
                                    icon={option.icon}
                                    className='icons'
                                />
                                <IonLabel>{option.title}</IonLabel>
                            </IonItem>
                        );
                    })}

                    <ThemeToggle />
                </IonList>
            </IonContent>
            <IonFooter>
                <IonItem lines='none'>
                    <IonIcon slot='start' icon={exit} className='icons' />
                    <IonLabel onClick={handleSignOut}>Logout</IonLabel>
                </IonItem>
            </IonFooter>
        </IonMenu>
    );
};
export default Menu;
