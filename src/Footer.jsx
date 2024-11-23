import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

import footerFrame from './Components/Images/footerVector.png';
import homeIconTrue from './Components/Images/Icons/homeIcon_Selected.png';
import homeIconFalse from './Components/Images/Icons/homeIcon_Nonselected.png';
import albumIconTrue from './Components/Images/Icons/AlbumIcon_Selected.png';
import albumIconFalse from './Components/Images/Icons/AlbumIcon_Nonselected.png';
import myactivityIconTrue from './Components/Images/Icons/myActivityIcon_Selected.png';
import myactivityIconFalse from './Components/Images/Icons/myActivityIcon_Nonselected.png';

function Footer() {
    const navigate = useNavigate();
    const [selectedButton, setSelectedButton] = useState('home'); // 초기 상태는 'home'

    const handleNavigation = (path, buttonName) => {
        setSelectedButton(buttonName);
        navigate(path);
    };

    return (
        <div className="button-container">
            <div
                className="button-album"
                onClick={() => handleNavigation('/album', 'album')}
            >
                <img
                    src={selectedButton === 'album' ? albumIconTrue : albumIconFalse}
                    alt="albumIcon"
                />
                앨범
            </div>
            <div
                className="button-home"
                onClick={() => handleNavigation('/home', 'home')}
            >
                <img
                    src={selectedButton === 'home' ? homeIconTrue : homeIconFalse}
                    alt="homeIcon"
                />
                홈
            </div>
            <div
                className="button-myactivity"
                onClick={() => handleNavigation('/myactivities', 'myactivity')}
            >
                <img
                    src={selectedButton === 'myactivity' ? myactivityIconTrue : myactivityIconFalse}
                    alt="myactivityIcon"
                />
                내 활동
            </div>
            <img className="footerFrame" src={footerFrame} alt="footerFrame" />
        </div>
    );
}

export default Footer;
