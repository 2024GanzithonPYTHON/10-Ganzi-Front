import { useNavigate } from 'react-router-dom';
import '../1. Auth/AptHeader.css';

import LogoSmall from '../Images/LogoSmall.png';
import BackSpaceIcon from '../Images/backSpaceIcon.png';

function AptHeader() {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="Apt_Header">
            <div className="Apt_backspace" onClick={handleBack}>
                <img src={BackSpaceIcon} alt="Back Space" />
            </div>
            <div className="Apt_HeaderLogo">
                <img src={LogoSmall} alt="Logo Small" />
            </div>
        </div>
    );
}

export default AptHeader;
