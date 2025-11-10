import { IonIcon, IonItem, IonLabel, IonToggle } from '@ionic/react';
import { useTheme } from '../hooks/useTheme';
import { sunny, moon } from 'ionicons/icons';

const ThemeToggle: React.FC = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <IonItem lines='none'>
            <IonIcon
                slot='start'
                icon={isDark ? sunny : moon}
                className='icons'
            />
            <IonLabel>Dark Mode</IonLabel>
            <IonToggle
                checked={isDark}
                onIonChange={toggleTheme}
                justify='end'
            ></IonToggle>
        </IonItem>
    );
};

export default ThemeToggle;
