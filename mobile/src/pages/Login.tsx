import { useState } from 'react';
import { useHistory } from 'react-router';
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonContent,
    IonIcon,
    IonInput,
    IonLabel,
    IonPage,
    IonSegment,
    IonSegmentButton,
    IonSegmentContent,
    IonSegmentView,
    useIonToast,
} from '@ionic/react';
import {
    at,
    eye,
    // eyeOff,
    lockClosed,
    logoGoogle,
    mail,
    person,
} from 'ionicons/icons';
import { getCurrentSession, signInWithEmail } from '@/lib/auth';

const Home: React.FC = () => {
    const [toast] = useIonToast();

    function displayToast(message: string) {
        toast({
            message,
            duration: 1500,
            position: 'bottom',
        });
    }

    return (
        <IonPage id='page-content'>
            <IonContent fullscreen>
                <IonCard className='auth-card'>
                    <IonCardHeader>
                        <IonSegment value='login'>
                            <IonSegmentButton value='login' contentId='login'>
                                <IonLabel>Login</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton
                                value='register'
                                contentId='register'
                            >
                                <IonLabel>Register</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                    </IonCardHeader>

                    <IonCardContent>
                        <IonSegmentView>
                            <LoginContent displayToast={displayToast} />
                            <RegisterContent displayToast={displayToast} />
                        </IonSegmentView>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default Home;

const LoginContent: React.FC<{ displayToast: (message: string) => void }> = ({
    displayToast,
}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useHistory();

    async function handleLoginWithEmail() {
        const res = await signInWithEmail(email, password);

        displayToast(res.message);
        if (res.success) {
            navigate.replace('/home');
        }
    }

    async function testSession() {
        const res = await getCurrentSession();

        displayToast(
            res.success ? (res.user?.email as string) : 'No active session'
        );
    }

    return (
        <IonSegmentContent id='login' className='login'>
            <IonButton>
                <IonIcon slot='start' icon={logoGoogle} aria-hidden='true' />
                Login with Google
            </IonButton>
            <div className='divider'>or</div>
            <IonInput
                label='Email'
                labelPlacement='floating'
                fill='outline'
                placeholder='Enter your email'
                type='text'
                value={email}
                onIonInput={(event) => setEmail(event.target.value as string)}
            >
                <IonIcon slot='start' icon={at} aria-hidden='true' />
            </IonInput>
            <IonInput
                label='Password'
                labelPlacement='floating'
                fill='outline'
                placeholder='Enter your password'
                type='password'
                value={password}
                onIonInput={(event) =>
                    setPassword(event.target.value as string)
                }
            >
                <IonIcon slot='start' icon={lockClosed} aria-hidden='true' />
                <IonButton fill='clear' slot='end' aria-label='Show/hide'>
                    <IonIcon slot='icon-only' icon={eye} aria-hidden='true' />
                </IonButton>
            </IonInput>
            <IonButton onClick={handleLoginWithEmail}>Login</IonButton>
            <IonButton onClick={testSession}>Test Session</IonButton>
        </IonSegmentContent>
    );
};

const RegisterContent: React.FC<{
    displayToast: (message: string) => void;
}> = ({ displayToast }) => {
    return (
        <IonSegmentContent id='register' className='login'>
            <IonButton>
                <IonIcon slot='start' icon={logoGoogle} aria-hidden='true' />
                Register with Google
            </IonButton>
            <div className='divider'>or</div>
            <IonInput
                label='Username'
                labelPlacement='floating'
                fill='outline'
                placeholder='Enter your username'
                type='text'
            >
                <IonIcon slot='start' icon={at} aria-hidden='true' />
            </IonInput>
            <IonInput
                label='Display name'
                labelPlacement='floating'
                fill='outline'
                placeholder='Enter your display name'
                type='text'
            >
                <IonIcon slot='start' icon={person} aria-hidden='true' />
            </IonInput>
            <IonInput
                label='Email'
                labelPlacement='floating'
                fill='outline'
                placeholder='Enter your email'
                type='email'
            >
                <IonIcon slot='start' icon={mail} aria-hidden='true' />
            </IonInput>
            <IonInput
                label='Password'
                labelPlacement='floating'
                fill='outline'
                placeholder='Enter your password'
                type='password'
            >
                <IonIcon slot='start' icon={lockClosed} aria-hidden='true' />
                <IonButton fill='clear' slot='end' aria-label='Show/hide'>
                    <IonIcon slot='icon-only' icon={eye} aria-hidden='true' />
                </IonButton>
            </IonInput>
            <IonInput
                label='Confirm Password'
                labelPlacement='floating'
                fill='outline'
                placeholder='Confirm your password'
                type='password'
            >
                <IonIcon slot='start' icon={lockClosed} aria-hidden='true' />
                <IonButton fill='clear' slot='end' aria-label='Show/hide'>
                    <IonIcon slot='icon-only' icon={eye} aria-hidden='true' />
                </IonButton>
            </IonInput>
            <IonButton>Register</IonButton>
        </IonSegmentContent>
    );
};
