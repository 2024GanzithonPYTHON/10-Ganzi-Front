import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { app } from '../../firebase';
import './Write.css';

import Xbutton from '../Images/Xbutton2.png';
import submitButton from '../Images/submitButton.png';
import postImageButton from '../Images/postImageButton.png';

function WritePost() {
    const location = useLocation();
    const { activityName } = location.state || {};
    const [content, setContent] = useState('');
    const [locationInfo, setLocationInfo] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activityNameInput, setActivityNameInput] = useState(activityName || '');

    const db = getFirestore(app);
    const storage = getStorage(app);

    const navigate = useNavigate();

    const handleMyactivity = () => {
        navigate('/myactivities');
    };


    // 파일 첨부 이미지로 변경해주는 함수
    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleImageClick = () => {
        document.getElementById("imageInput").click();
    };

    //글 전송 함수
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) throw new Error('User not authenticated');

            const userId = user.uid;
            const postsCollection = collection(db, `users/${userId}/posts`);

            let imageUrl = '';
            if (image) {
                const imageRef = ref(storage, `users/${userId}/posts/${Date.now()}-${image.name}`);
                await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(imageRef);
            }

            await addDoc(postsCollection, {
                activityName: activityNameInput,
                content,
                createdAt: new Date(),
                imageUrl,
                location: locationInfo,
            });

            alert('글이 성공적으로 저장되었습니다!');
            navigate('/album');
        } catch (error) {
            console.error('Error saving post:', error);
            alert('글 저장 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="Write-container">
            <form className="Write-Form" onSubmit={handleSubmit}>
                <div className="Write-header">
                    <div className="XbuttonFrame"><img className="Xbutton" src={Xbutton} onClick={handleMyactivity} /></div>
                    <div>글쓰기</div>
                    <button type="submit" disabled={loading}>
                        <img className="submitButton" src={submitButton} />
                    </button>
                </div>
                <div className="hrLine1" />
                <div className="Write-TitleArea">
                    <input
                        className="Write-TitleInput"
                        type="text"
                        placeholder={activityName || "활동명 없음"}
                        onChange={(e) => setActivityNameInput(e.target.value)}
                    />
                    <img
                        className="Write-TitleInputImage"
                        src={postImageButton}
                        alt="Upload"
                        onClick={handleImageClick}
                    />
                    <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </div>
                <div className="hrLine2" />
                <input
                    className="Write-place"
                    type="text"
                    placeholder="활동 장소"
                    value={locationInfo}
                    onChange={(e) => setLocationInfo(e.target.value)}
                />
                <div className="hrLine2" />
                <textarea
                    className="Write-Contents"
                    placeholder="내용을 입력하세요."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </form>
        </div>
    );
}

export default WritePost;
