import { App } from '@capacitor/app';
import {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    useIonRouter,
} from '@ionic/react';
import { useEffect } from 'react';

import FriendsList from '../components/FriendsList';
import Menu from '../components/Menu';

const Home: React.FC = () => {
    const ionRouter = useIonRouter();

    useEffect(() => {
        App.addListener('backButton', () => {
            if (ionRouter.canGoBack()) {
                ionRouter.goBack();
            } else {
                App.exitApp();
            }
        });
    }, [ionRouter]);

    return (
        <>
            <Menu contentId='page-content' />
            <IonPage id='page-content'>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot='start'>
                            <IonMenuButton autoHide={false}></IonMenuButton>
                        </IonButtons>
                        <IonTitle>Shh.chat</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent fullscreen>
                    <FriendsList />
                </IonContent>
            </IonPage>
        </>
    );
};

export default Home;
