import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './JoinScreen.css';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

import LogoSmall from '../Images/LogoSmall.png';
import BackSpaceIcon from '../Images/backSpaceIcon.png';

import act1 from '../Images/ActivityCategory/Act1.png';
import act2 from '../Images/ActivityCategory/Act2.png';
import act3 from '../Images/ActivityCategory/Act3.png';
import act4 from '../Images/ActivityCategory/Act4.png';
import act5 from '../Images/ActivityCategory/Act5.png';
import act6 from '../Images/ActivityCategory/Act6.png';
import act7 from '../Images/ActivityCategory/Act7.png';
import act8 from '../Images/ActivityCategory/Act8.png';
import act9 from '../Images/ActivityCategory/Act9.png';
import act10 from '../Images/ActivityCategory/Act10.png';
import act11 from '../Images/ActivityCategory/Act11.png';
import act12 from '../Images/ActivityCategory/Act12.png';
import checkIcon from '../Images/checkIcon.png';
import welcomePoster from '../Images/welcomePoster.png';

function JoinScreen() {
    const [step, setStep] = useState(1);
    const [warningMessage, setWarningMessage] = useState('');
    const [step2WarningMessage, setStep2WarningMessage] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [childAge, setChildAge] = useState('');
    const [parentName, setParentName] = useState('');
    const [childName, setChildName] = useState('');
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [address, setAddress] = useState('');

    const activityImages = [
        { src: act1, label: "종이\n접기" },
        { src: act2, label: "숨바\n꼭질" },
        { src: act3, label: "블록\n놀이" },
        { src: act4, label: "그림\n그리기" },
        { src: act5, label: "음악\n놀이" },
        { src: act6, label: "자연\n탐험" },
        { src: act7, label: "보드\n게임" },
        { src: act8, label: "과학\n실험" },
        { src: act9, label: "보물\n찾기" },
        { src: act10, label: "요리\n놀이" },
        { src: act11, label: "별\n보기" },
        { src: act12, label: "영화\n보기" },
    ];

    const handleNextClickStep1 = () => {
        if (!parentName.trim()) {
            setWarningMessage('이름을 입력해주세요.');
            return;
        }
        if (!email.trim()) {
            setWarningMessage('아이디를 입력해주세요.');
            return;
        }
        if (!password.trim()) {
            setWarningMessage('비밀번호를 입력해주세요.');
            return;
        }
    
        setWarningMessage('');
        setStep(step + 1);
    }

    const handleActivityClick = (index) => {
        setSelectedActivities((prevSelected) => {
            if (prevSelected.includes(index)) {
                return prevSelected.filter((i) => i !== index);
            } else if (prevSelected.length < 3) {
                return [...prevSelected, index];
            } else {
                return prevSelected;
            }
        });
    };

    const handleNextClickStep2 = () => {
        if (!childName.trim()) {
            setStep2WarningMessage('자녀의 이름을 입력해주세요.');
            return;
        }
        if (!childAge || isNaN(childAge) || parseInt(childAge) <= 0) {
            setStep2WarningMessage('자녀의 나이를 정확히 입력해주세요.');
            return;
        }
    
        setStep2WarningMessage('');
        setStep(step + 1);
    };

    const navigate = useNavigate();
    const handleBack = () => {
        if (step > 1 && step < 5) {
            setStep(step - 1);
        }
        else if (step == 7) {
            setStep(step - 3);
        }
        else {
            navigate('/');
        }
    };


    const handleNextClick = () => {
        setStep(step + 1);
    };

    const handleAddressSearchClick = () => {
        setStep(7);
    };

    const handleAddressSelect = (selectedAddress) => {
        setAddress(selectedAddress);
        setStep(4);
    };

    useEffect(() => {
        if (step === 5) {
            const timer = setTimeout(() => {
                navigate('/home');
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [step, navigate]);

    useEffect(() => {
        if (step === 7) {
            const script = document.createElement('script');
            script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                new window.daum.Postcode({
                    oncomplete: function (data) {
                        const fullAddress = data.roadAddress || data.jibunAddress;
                        handleAddressSelect(fullAddress);
                    }
                }).embed(document.getElementById('postcode-container'));
            };

            return () => {
                document.body.removeChild(script);
            };
        }
    }, [step]);

    const handleSignup = async () => {
        if (!email || !password || !parentName || !childName || !childAge || selectedActivities.length < 3 || !address) {
            setWarningMessage("모든 정보를 정확히 입력해주세요.");
            return;
        }
    
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                parentName,
                childName,
                childAge: parseInt(childAge),
                interests: selectedActivities.map((index) => activityImages[index].label),
                address,
            });
    
            setStep(5);
        } catch (error) {
            setWarningMessage("회원가입에 실패했습니다. 다시 시도해주세요.");
            console.error("회원가입 에러:", error.message);
        }
    };

    return (
        <div className="join-container">
            {step !== 5 && (
                <div className="Apt_Header">
                    <div className="Apt_backspace" onClick={handleBack}>
                        <img src={BackSpaceIcon} alt="Back Space" />
                    </div>
                    <div className="Apt_HeaderLogo">
                        <img src={LogoSmall} alt="Logo Small" />
                    </div>
                </div>
            )}
            {step === 1 ? (
                <>
                    <div className="join-subcontainer1">
                        <div className="join-title-box">
                            <div className="join-title">회원가입</div>
                            <div className="join-progress">{step}/4</div>
                        </div>

                        <div className="join-description">
                            이름과 아이디, 비밀번호<br />
                            를 입력해주세요.
                        </div>
                        <form className="join-form1">
                            <input
                                type="text"
                                className="join-input-name"
                                placeholder="이름"
                                value={parentName}
                                onChange={(e) => setParentName(e.target.value)}
                            />
                            <input
                                type="text"
                                className="join-input-id"
                                placeholder="아이디(이메일)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                className="join-input-password"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </form>

                        <div className="join-next-button1" onClick={handleNextClickStep1}>
                            다음
                        </div>
                        {warningMessage && <div className="warning-message">{warningMessage}</div>}

                    </div>
                </>
            ) : step === 2 ? (
                <>
                    <div className="join-subcontainer2">
                        <div className="join-title-box">
                            <div className="join-title">회원가입</div>
                            <div className="join-progress">{step}/4</div>
                        </div>
                        <div className="join-description">
                            자녀의 이름과 나이를<br />입력해주세요.
                        </div>
                            <form className="join-form2">
                                <input
                                    type="text"
                                    className="join-input-fullname"
                                    placeholder="성명"
                                    value={childName}
                                    onChange={(e) => setChildName(e.target.value)}
                                />
                                <input
                                    type="number"
                                    className="join-input-age"
                                    placeholder="나이"
                                    value={childAge}
                                    onChange={(e) => setChildAge(e.target.value)}
                                />
                            </form>
                        <div className="join-next-button2" onClick={handleNextClickStep2}>
                            다음
                        </div>
                        {step2WarningMessage && <div className="warning-message">{step2WarningMessage}</div>}
                    </div>
                </>
            ) : step === 3 ? (
                <>
                    <div className="join-subcontainer3">
                        <div className="join-title-box">
                            <div className="join-title">회원가입</div>
                            <div className="join-progress">{step}/4</div>
                        </div>
                        <div className="join-description">
                            아이의 관심사를 선택해주세요<br />
                            <span className="join-subdescription">홈 피드를 구성할 수 있도록 3개 선택해주세요.</span>
                        </div>
                    </div>
                    <div className="join-activity-selection">
                        {activityImages.map((activity, index) => (
                            <div
                                key={index}
                                className={`grid-item ${selectedActivities.includes(index) ? 'selected' : ''}`}
                                onClick={() => handleActivityClick(index)}
                            >
                                <img src={activity.src} alt={activity.label} />
                                {selectedActivities.includes(index) ? (
                                    <img src={checkIcon} alt="Selected" className="check-icon" />
                                ) : (
                                    <div className="activity-label">{activity.label}</div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div
                        className={`join-next-button3 ${selectedActivities.length >= 3 ? 'active' : 'inactive'}`}
                        onClick={selectedActivities.length >= 3 ? handleNextClick : null}
                    >
                        다음
                    </div>
                </>
            ) : step === 4 ? (
                <>
                    <div className="join-subcontainer4">
                        <div className="join-title-box">
                            <div className="join-title">회원가입</div>
                            <div className="join-progress">{step}/4</div>
                        </div>
                        <div className="join-description">
                            거주지를 정확하게 입력해주세요.
                        </div>
                        <div className="join-form3">
                            <div className="address-display">{address}</div>
                            <div className="address-search-button" onClick={handleAddressSearchClick}>
                                주소 찾기
                            </div>
                        </div>
                    </div>
                    {address && (
                        <div className="join-next-button4"  onClick={handleSignup}>
                            다음
                        </div>
                    )}
                </>
            ) : step === 5 ? (
                <>
                    <div className="join-subcontainer5">
                        <img src={welcomePoster} alt="회원가입 완료" />
                        <div className="join-complete-message1">
                            설정이 완료되었습니다!<br />
                            <span className="join-complete-message2">환영합니다 {parentName} 님<br /> 오늘도 아이와 즐거운 시간 보내세요!</span>
                        </div>
                    </div>
                </>
            ) : step === 7 ? (
                <>
                    <div className="join-subcontainer7">
                        <div id="postcode-container" className="postcode-embed"></div>
                    </div>
                </>
            ) : null}
        </div>
    );
}

export default JoinScreen;

