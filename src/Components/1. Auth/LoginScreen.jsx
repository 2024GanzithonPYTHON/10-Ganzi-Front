import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import logoMedium from '../Images/LogoMedium.png';
import './LoginScreen.css';

function LoginScreen() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const handleJoin = () => {
        navigate('/join');
    };

    // 로그인 처리 함수
    const handleLogin = async () => {
        if (!email || !password) {
            setError('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/home');
        } catch (err) {
            setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
            console.error('로그인 에러:', err.message);
        }
    };

    return (
        <div className="loginContainer">
            <div className="login_logoMedium">
                <img src={logoMedium} alt="logo Medium" />
            </div>
            <form className="loginForm" onSubmit={(e) => e.preventDefault()}>
                <input
                    type="text"
                    className="idBox"
                    placeholder="아이디/이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="pwBox"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </form>
            {error && <div className="errorMessage">{error}</div>}
            <div className="loginButton" onClick={handleLogin}>
                시작하기
            </div>
            <div className="joinText">
                아빠투가 처음이라면, <span className="joinButton" onClick={handleJoin}>회원가입</span>하기
            </div>
        </div>
    );
}

export default LoginScreen;
