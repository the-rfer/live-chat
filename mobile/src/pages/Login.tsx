import { useState } from 'react';
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
    eyeOff,
    lockClosed,
    logoGoogle,
    mail,
    person,
} from 'ionicons/icons';
import { signIn, signOut } from '../lib/auth-client';
import { signInWithEmail } from '../lib/auth';

const Home: React.FC = () => {
    const [toast] = useIonToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function displayToast(message: string) {
        toast({
            message,
            duration: 1500,
            position: 'bottom',
        });
    }

    async function handleLoginWithEmail() {
        const res = await signInWithEmail(email, password);

        displayToast(res.message);
        // if (res.success) {
        //     displayToast(res.message);
        // } else {
        //     displayToast(res.message);
        // }
    }

    async function testSession() {
        const result = await fetch('http://localhost:3333/api/me', {
            credentials: 'include',
        });
        const data = await result.json();
        console.log('Session data:', data);
    }

    function logout() {
        signOut();
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
                            <IonSegmentContent id='login' className='login'>
                                <IonButton>
                                    <IonIcon
                                        slot='start'
                                        icon={logoGoogle}
                                        aria-hidden='true'
                                    />
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
                                    onIonInput={(event) =>
                                        setEmail(event.target.value as string)
                                    }
                                >
                                    <IonIcon
                                        slot='start'
                                        icon={at}
                                        aria-hidden='true'
                                    />
                                </IonInput>
                                <IonInput
                                    label='Password'
                                    labelPlacement='floating'
                                    fill='outline'
                                    placeholder='Enter your password'
                                    type='password'
                                    value={password}
                                    onIonInput={(event) =>
                                        setPassword(
                                            event.target.value as string
                                        )
                                    }
                                >
                                    <IonIcon
                                        slot='start'
                                        icon={lockClosed}
                                        aria-hidden='true'
                                    />
                                    <IonButton
                                        fill='clear'
                                        slot='end'
                                        aria-label='Show/hide'
                                    >
                                        <IonIcon
                                            slot='icon-only'
                                            icon={eye}
                                            aria-hidden='true'
                                        />
                                    </IonButton>
                                </IonInput>
                                <IonButton onClick={handleLoginWithEmail}>
                                    Login
                                </IonButton>
                                <IonButton onClick={testSession}>
                                    Test session
                                </IonButton>
                                <IonButton onClick={logout}>Logout</IonButton>
                            </IonSegmentContent>
                            <IonSegmentContent id='register' className='login'>
                                <IonButton>
                                    <IonIcon
                                        slot='start'
                                        icon={logoGoogle}
                                        aria-hidden='true'
                                    />
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
                                    <IonIcon
                                        slot='start'
                                        icon={at}
                                        aria-hidden='true'
                                    />
                                </IonInput>
                                <IonInput
                                    label='Display name'
                                    labelPlacement='floating'
                                    fill='outline'
                                    placeholder='Enter your display name'
                                    type='text'
                                >
                                    <IonIcon
                                        slot='start'
                                        icon={person}
                                        aria-hidden='true'
                                    />
                                </IonInput>
                                <IonInput
                                    label='Email'
                                    labelPlacement='floating'
                                    fill='outline'
                                    placeholder='Enter your email'
                                    type='email'
                                >
                                    <IonIcon
                                        slot='start'
                                        icon={mail}
                                        aria-hidden='true'
                                    />
                                </IonInput>
                                <IonInput
                                    label='Password'
                                    labelPlacement='floating'
                                    fill='outline'
                                    placeholder='Enter your password'
                                    type='password'
                                >
                                    <IonIcon
                                        slot='start'
                                        icon={lockClosed}
                                        aria-hidden='true'
                                    />
                                    <IonButton
                                        fill='clear'
                                        slot='end'
                                        aria-label='Show/hide'
                                    >
                                        <IonIcon
                                            slot='icon-only'
                                            icon={eye}
                                            aria-hidden='true'
                                        />
                                    </IonButton>
                                </IonInput>
                                <IonInput
                                    label='Confirm Password'
                                    labelPlacement='floating'
                                    fill='outline'
                                    placeholder='Confirm your password'
                                    type='password'
                                >
                                    <IonIcon
                                        slot='start'
                                        icon={lockClosed}
                                        aria-hidden='true'
                                    />
                                    <IonButton
                                        fill='clear'
                                        slot='end'
                                        aria-label='Show/hide'
                                    >
                                        <IonIcon
                                            slot='icon-only'
                                            icon={eye}
                                            aria-hidden='true'
                                        />
                                    </IonButton>
                                </IonInput>
                                <IonButton>Register</IonButton>
                            </IonSegmentContent>
                        </IonSegmentView>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default Home;
