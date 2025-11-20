import cls from './BackgroundScreen.module.css'
import Background from '../../../shared/assets/screens/background2.png'

const BackgroundScreen = ({children}) => {
return (
    <div className={cls.BackgroundScreen}>
        <img src={Background} alt="Loading..." className={cls.backgroundImage}/>
        <div className={cls.content}>
            {children}
        </div>
    </div>
    );
};

export default BackgroundScreen;