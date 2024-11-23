import './Album.css';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Timestamp, getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../../firebase";

import LogoSmall from '../Images/LogoSmall.png';
import gpsMarker from '../Images/gpsMarker.png';
import albumBackground from '../Images/albumBackground.png';
import QuoteLeft from '../Images/QuoteLeft.png';
import QuoteRight from '../Images/QuoteRight.png';
import tape1 from '../Images/tape1.png';
import tape2 from '../Images/tape2.png';

function Album() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [data, setData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState("");
    const [direction, setDirection] = useState(0);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async (userId) => {
            try {
                const db = getFirestore(app);
                const postsRef = collection(db, `users/${userId}/posts`);
                const querySnapshot = await getDocs(postsRef);

                const fetchedData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setData(fetchedData);
                setEditContent(fetchedData[0]?.content || "");
            } catch (error) {
                console.error("Error loading posts: ", error);
            } finally {
                setLoading(false);
            }
        };

        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchData(user.uid);
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        setEditContent(data[currentIndex]?.content || "");
    }, [currentIndex, data]);

    // timestamp를 date, time으로 각각 분리해주는 함수
    const formatDate = (timestamp) => {
        if (!timestamp) return "";
        const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const time = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
        return time.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // 이미지 슬라이드 애니메이션 함수
    const variants = {
        enterFromPrev: { x: -150, opacity: 1, scale: 0.9 },
        enterFromNext: { x: 150, opacity: 1, scale: 0.9 },
        center: { x: 0, opacity: 1, scale: 1 },
        exitToPrev: { x: 150, opacity: 1, scale: 0.9 },
        exitToNext: { x: -150, opacity: 1, scale: 0.9 },
    };

    const transition = {
        type: "spring",
        stiffness: 40,
        damping: 10,
        duration: 0.6,
    };

    const prevSlide = () => {
        if (currentIndex < data.length - 1) {
            setDirection(-1);
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const nextSlide = () => {
        if (currentIndex > 0) {
            setDirection(1);
            setCurrentIndex((prev) => prev - 1);
        }
    };

    // 글 편집 함수
    const handleEditClick = () => setIsEditing(true);

    const handleSave = async () => {
        try {
            const db = getFirestore(app);
            const currentPostId = data[currentIndex].id;
            const postRef = doc(db, `users/${getAuth(app).currentUser.uid}/posts`, currentPostId);

            await updateDoc(postRef, { content: editContent });

            const updatedData = [...data];
            updatedData[currentIndex].content = editContent;
            setData(updatedData);

            setIsEditing(false);
            alert("수정 내용이 저장되었습니다.");
        } catch (error) {
            console.error("Error updating document: ", error);
            alert("수정 내용 저장 중 오류가 발생했습니다.");
        }
    };

    if (loading) return (
        <div className="Album-Container">
            <div className="Album-Logo">
                <img src={LogoSmall} alt="Logo Small" />
            </div>
            <div className="Album-imgInfo">
                <img src={gpsMarker} alt="gpsMarker" />
                <div className="Album-PlaceandTime">
                    <span>로딩 중...</span>
                    <br />
                </div>
            </div>
            <div className="Album">
                <div className="Album-prev" onClick={prevSlide}>
                    <div className="Album-prev-gallery">
                        {currentIndex < data.length - 1 && (
                            <motion.img
                                key={data[(currentIndex + 1) % data.length]?.imageUrl}
                                src={data[(currentIndex + 1) % data.length]?.imageUrl}
                                alt="prevImage"
                                className="cropped-image"
                                initial={direction === -1 ? "enterFromPrev" : "enterFromNext"}
                                animate="center"
                                exit={direction === -1 ? "exitToPrev" : "exitToNext"}
                                variants={variants}
                                transition={transition}
                            />
                        )}
                    </div>
                </div>
                <div className="Album-main-back"></div>
                <div className="Album-main-front">
                    <div className="Album-Header">
                        <div className="Album-Date">로딩 중...</div>
                        <div className="Album-SaveButton" onClick={handleSave}>
                            저장하기
                        </div>
                    </div>
                    <div className="Album-Gallery">
                        <motion.img
                            key={albumBackground}
                            src={albumBackground}
                            alt="AlbumImage"
                            className="Album-Gallery-image"
                            initial={direction === -1 ? "enterFromPrev" : "enterFromNext"}
                            animate="center"
                            exit={direction === -1 ? "exitToPrev" : "exitToNext"}
                            variants={variants}
                            transition={transition}
                        />
                    </div>
                    <div className="Album-Vector" />
                    <div className="Album-title">로딩 중...</div>
                    <div
                        className="Album-contents"
                        contentEditable={isEditing}
                        suppressContentEditableWarning={true}
                    >
                        로딩 중...
                    </div>
                </div>
                <div className="Album-next" onClick={nextSlide}>
                    <div className="Album-next-gallery">
                        {currentIndex > 0 && (
                            <motion.img
                                key={data[(currentIndex - 1 + data.length) % data.length]?.imageUrl}
                                src={data[(currentIndex - 1 + data.length) % data.length]?.imageUrl}
                                alt="nextImage"
                                className="cropped-image"
                                initial={direction === -1 ? "enterFromPrev" : "enterFromNext"}
                                animate="center"
                                exit={direction === -1 ? "exitToPrev" : "exitToNext"}
                                variants={variants}
                                transition={transition}
                            />
                        )}
                    </div>
                </div>
            </div>
            <img className="QuoteLeft" src={QuoteLeft} alt="QuoteLeft" />
            <img className="QuoteRight" src={QuoteRight} alt="QuoteRight" />
            <img className="tape1" src={tape1} alt="tape1" />
            <img className="tape2" src={tape2} alt="tape2" />
            <img className="albumBackground" src={albumBackground} alt="albumBackground" />
        </div>
    );

    //글 없을 때 나오는 화면
    if (!data.length) return (
        <div className="Album-Container">
            <div className="Album-Logo">
                <img src={LogoSmall} alt="Logo Small" />
            </div>
            <div className="Album-imgInfo">
                <img src={gpsMarker} alt="gpsMarker" />
                <div className="Album-PlaceandTime">
                    <span>작성 글 없음</span>
                    <br />
                </div>
            </div>
            <div className="Album">
                <div className="Album-prev" onClick={prevSlide}>
                    <div className="Album-prev-gallery">
                        {currentIndex < data.length - 1 && (
                            <motion.img
                                key={data[(currentIndex + 1) % data.length]?.imageUrl}
                                src={data[(currentIndex + 1) % data.length]?.imageUrl}
                                alt="prevImage"
                                className="cropped-image"
                                initial={direction === -1 ? "enterFromPrev" : "enterFromNext"}
                                animate="center"
                                exit={direction === -1 ? "exitToPrev" : "exitToNext"}
                                variants={variants}
                                transition={transition}
                            />
                        )}
                    </div>
                </div>
                <div className="Album-main-back"></div>
                <div className="Album-main-front">
                    <div className="Album-Header">
                        <div className="Album-Date">작성 글 없음</div>
                        <div className="Album-SaveButton" onClick={handleSave}>
                            저장하기
                        </div>
                    </div>
                    <div className="Album-Gallery">
                        <motion.img
                            key={albumBackground}
                            src={albumBackground}
                            alt="AlbumImage"
                            className="Album-Gallery-image"
                            initial={direction === -1 ? "enterFromPrev" : "enterFromNext"}
                            animate="center"
                            exit={direction === -1 ? "exitToPrev" : "exitToNext"}
                            variants={variants}
                            transition={transition}
                        />
                    </div>
                    <div className="Album-Vector" />
                    <div className="Album-title">작성 글 없음</div>
                    <div
                        className="Album-contents"
                        contentEditable={isEditing}
                        suppressContentEditableWarning={true}
                    >
                        홈 화면에서 추천 활동을 찜한 뒤,<br /> 찜한 활동을 수행하고 글을 작성해보세요!
                    </div>
                </div>
                <div className="Album-next" onClick={nextSlide}>
                    <div className="Album-next-gallery">
                        {currentIndex > 0 && (
                            <motion.img
                                key={data[(currentIndex - 1 + data.length) % data.length]?.imageUrl}
                                src={data[(currentIndex - 1 + data.length) % data.length]?.imageUrl}
                                alt="nextImage"
                                className="cropped-image"
                                initial={direction === -1 ? "enterFromPrev" : "enterFromNext"}
                                animate="center"
                                exit={direction === -1 ? "exitToPrev" : "exitToNext"}
                                variants={variants}
                                transition={transition}
                            />
                        )}
                    </div>
                </div>
            </div>
            <img className="QuoteLeft" src={QuoteLeft} alt="QuoteLeft" />
            <img className="QuoteRight" src={QuoteRight} alt="QuoteRight" />
            <img className="tape1" src={tape1} alt="tape1" />
            <img className="tape2" src={tape2} alt="tape2" />
            <img className="albumBackground" src={albumBackground} alt="albumBackground" />
        </div>
    );

    return (
        <div className="Album-Container">
            <div className="Album-Logo">
                <img src={LogoSmall} alt="Logo Small" />
            </div>
            <div className="Album-imgInfo">
                <img src={gpsMarker} alt="gpsMarker" />
                <div className="Album-PlaceandTime">
                    <span>{data[currentIndex]?.location}</span>
                    <br />
                    {formatTime(data[currentIndex]?.createdAt)}
                </div>
            </div>
            <div className="Album">
                <div className="Album-prev" onClick={prevSlide}>
                    <div className="Album-prev-gallery">
                        {currentIndex < data.length - 1 && (
                            <motion.img
                                key={data[(currentIndex + 1) % data.length]?.imageUrl}
                                src={data[(currentIndex + 1) % data.length]?.imageUrl}
                                alt="prevImage"
                                className="cropped-image"
                                initial={direction === -1 ? "enterFromPrev" : "enterFromNext"}
                                animate="center"
                                exit={direction === -1 ? "exitToPrev" : "exitToNext"}
                                variants={variants}
                                transition={transition}
                            />
                        )}
                    </div>
                </div>
                <div className="Album-main-back"></div>
                <div className="Album-main-front">
                    <div className="Album-Header">
                        <div className="Album-Date">{formatDate(data[currentIndex]?.createdAt)}</div>
                        <div className="Album-SaveButton" onClick={handleSave}>
                            저장하기
                        </div>
                    </div>
                    <div className="Album-Gallery">
                        <motion.img
                            key={data[currentIndex]?.imageUrl}
                            src={data[currentIndex]?.imageUrl}
                            alt="AlbumImage"
                            className="Album-Gallery-image"
                            initial={direction === -1 ? "enterFromPrev" : "enterFromNext"}
                            animate="center"
                            exit={direction === -1 ? "exitToPrev" : "exitToNext"}
                            variants={variants}
                            transition={transition}
                        />
                    </div>
                    <div className="Album-Vector" />
                    <div className="Album-title">{data[currentIndex]?.activityName}</div>
                    <div
                        className="Album-contents"
                        contentEditable={isEditing}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => setEditContent(e.target.innerText)}
                        onClick={handleEditClick}
                    >
                        {isEditing ? editContent : data[currentIndex]?.content}
                    </div>
                </div>
                <div className="Album-next" onClick={nextSlide}>
                    <div className="Album-next-gallery">
                        {currentIndex > 0 && (
                            <motion.img
                                key={data[(currentIndex - 1 + data.length) % data.length]?.imageUrl}
                                src={data[(currentIndex - 1 + data.length) % data.length]?.imageUrl}
                                alt="nextImage"
                                className="cropped-image"
                                initial={direction === -1 ? "enterFromPrev" : "enterFromNext"}
                                animate="center"
                                exit={direction === -1 ? "exitToPrev" : "exitToNext"}
                                variants={variants}
                                transition={transition}
                            />
                        )}
                    </div>
                </div>
            </div>
            <img className="QuoteLeft" src={QuoteLeft} alt="QuoteLeft" />
            <img className="QuoteRight" src={QuoteRight} alt="QuoteRight" />
            <img className="tape1" src={tape1} alt="tape1" />
            <img className="tape2" src={tape2} alt="tape2" />
            <img className="albumBackground" src={albumBackground} alt="albumBackground" />
        </div>
    );
}

export default Album;
