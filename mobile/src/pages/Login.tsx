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

const Home: React.FC = () => {
    //TODO: Estas funções são apenas para teste, passar para lib mais tarde
    async function handleLogin() {
        const result = await signIn.email({
            email: 'test@email.com',
            password: 'password',
        });

        console.log('Login result:', result);
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
                                    label='Username'
                                    labelPlacement='floating'
                                    fill='outline'
                                    placeholder='Enter your username'
                                    type='text'
                                >
                                    <IonIcon
                                        slot='start'
                                        icon={person}
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
                                <IonButton onClick={handleLogin}>
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
