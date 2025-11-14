import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { SafeArea } from 'capacitor-plugin-safe-area';
import { Route } from 'react-router-dom';

import { stackSlideAnimation } from './animations/slideAnimation';
import { UserProvider } from './components/UserContext';
import { applyInitialTheme } from './hooks/useTheme';
import Chat from '@/pages/Chat';
import Home from '@/pages/Home';
import Login from '@/pages/Login';

/* Theme variables */
import './theme/variables.css';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
// import '@ionic/react/css/palettes/dark.system.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/typography.css';

setupIonicReact();
applyInitialTheme();

SafeArea.getSafeAreaInsets().then((data) => {
    const { insets } = data;
    document.body.style.setProperty('--ion-safe-area-top', `${insets.top}px`);
    document.body.style.setProperty(
        '--ion-safe-area-right',
        `${insets.right}px`
    );
    document.body.style.setProperty(
        '--ion-safe-area-bottom',
        `${insets.bottom}px`
    );
    document.body.style.setProperty('--ion-safe-area-left', `${insets.left}px`);
});

const App: React.FC = () => {
    return (
        <IonApp>
            <IonReactRouter>
                <UserProvider>
                    <IonRouterOutlet animation={stackSlideAnimation}>
                        <Route path='/home' component={Home} />
                        <Route path='/chat/:id' component={Chat} />
                        <Route path='/login' component={Login} />
                    </IonRouterOutlet>
                </UserProvider>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
