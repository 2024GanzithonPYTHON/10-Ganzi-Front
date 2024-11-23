import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './HomeScreen.css';
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { app } from '../../firebase';

import LogoExtraSmall from '../Images/LogoExtraSmall.png';
import imgFrame from '../Images/RecommandationImage/imgFrame.png';
import DoubleSparkle from '../Images/DoubleSparkle.png';
import mypageIcon from '../Images/Icons/myPageIcon.png';
import dotVector from '../Images/dotvector.png';
import nonSelectedHeart from '../Images/nonSelectedHeart.png';
import SelectedHeart from '../Images/SelectedHeart.png';
import Xbutton from '../Images/Xbutton.png'
import Ad1 from '../Images/Advertisements/Ad1.png';
import Ad2 from '../Images/Advertisements/Ad2.png';
import Ad3 from '../Images/Advertisements/Ad3.png';
import Ad4 from '../Images/Advertisements/Ad4.png';
import activity1 from '../Images/activityImages/activity1.jpg';
import activity2 from '../Images/activityImages/activity2.jpg';
import activity3 from '../Images/activityImages/activity3.jpg';
import activity4 from '../Images/activityImages/activity4.jpg';
import activity5 from '../Images/activityImages/activity5.jpg';
import activity6 from '../Images/activityImages/activity6.jpg';
import activity7 from '../Images/activityImages/activity7.jpg';
import activity8 from '../Images/activityImages/activity8.jpg';
import activity9 from '../Images/activityImages/activity9.jpg';
import activity10 from '../Images/activityImages/activity10.jpg';
import activity11 from '../Images/activityImages/activity11.jpg';
import activity12 from '../Images/activityImages/activity12.jpg';

Modal.setAppElement('#root');

function HomeScreen() {
    const [childName, setChildName] = useState('길동이');
    const [childAge, setChildAge] = useState(5);
    const [suggestedTopics, setSuggestedTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [activities, setActivities] = useState([
        { text: "활동 준비 중입니다", image: null, detail: "활동 데이터를 가져오는 중입니다" }
    ]);
    const [selectedActivity, setSelectedActivity] = useState(activities[0] || null);
    const [direction, setDirection] = useState(0);
    const [likedActivities, setLikedActivities] = useState({});
    const ads = [Ad1, Ad2, Ad3, Ad4];

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const navigate = useNavigate();

    const handleMypage = () => {
        navigate('/mypage');
    };

    //비교용
    const predefinedInterests = [
        "종이접기", "블록놀이", "그림그리기", "자연탐험",
        "보드게임", "과학실험", "보물찾기", "별보기",
        "영화보기", "음악놀이", "숨바꼭질", "요리놀이"
    ];

    const interestImages = {
        "종이접기": activity1,
        "숨바꼭질": activity2,
        "블록놀이": activity3,
        "그림그리기": activity4,
        "음악놀이": activity5,
        "자연탐험": activity6,
        "보드게임": activity7,
        "과학실험": activity8,
        "보물찾기": activity9,
        "요리놀이": activity10,
        "별보기": activity11,
        "영화보기": activity12,
    };

    const fetchUserInterests = async (userId) => {
        try {
            const db = getFirestore(app);
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data().interests || [];
            } else {
                console.error('No such document!');
                return [];
            }
        } catch (error) {
            console.error('Error fetching user interests:', error);
            return [];
        }
    };

    const normalizeInterest = (interest) => {
        return interest.trim().replace(/\n/g, '');
    };

    const initializeHomeScreen = async (userId) => {
        let userInterests = await fetchUserInterests(userId);

        userInterests = userInterests.map(interest => normalizeInterest(interest));

        const combinedInterests = createInterestSet(userInterests);

        setActivities(combinedInterests);
        fetchSuggestedActivity(combinedInterests);
        fetchSuggestedTopics();
    };

    // 이름 처리 함수
    const processChildName = (fullName) => {
        if (!fullName) return '길동이'; // 기본값 길동이
        const nameWithoutLastName = fullName.slice(1);
        const lastChar = nameWithoutLastName.slice(-1);

        const lastCharCode = lastChar.charCodeAt(0);
        const hasFinalConsonant = (lastCharCode - 0xac00) % 28 !== 0;

        return hasFinalConsonant ? `${nameWithoutLastName}이` : nameWithoutLastName;
    };

    //아이 정보 처리 함수
    const fetchChildData = async (userId) => {
        try {
            const db = getFirestore(app);
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                const fullName = userData.childName || '길동이';

                const processedName = processChildName(fullName);
                setChildName(processedName);

                const age = userData.childAge || 5; // 기본값 5살
                setChildAge(age);
            } else {
                console.error('No such document!');
            }
        } catch (error) {
            console.error('Error fetching child name:', error);
        }
    };

    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userId = user.uid;
                fetchChildData(userId);
                initializeHomeScreen(userId);
            } else {
                console.error('User is not logged in.');
            }
        });

        return () => unsubscribe();
    }, []);

    const createInterestSet = (userInterests) => {
        const randomInterest = predefinedInterests[Math.floor(Math.random() * predefinedInterests.length)];
        const combinedInterests = [...userInterests, randomInterest];

        return combinedInterests.slice(0, 4).map((interest) => {
            const image = interestImages[interest] || null;
            return {
                interest,
                image,
            };
        });
    };

    const [adIndex, setAdIndex] = useState(0);

    useEffect(() => {
        const adInterval = setInterval(() => {
            setAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
        }, 2000);

        return () => clearInterval(adInterval);
    }, [ads.length]);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            handleSlide(1);
        }, 3000);

        return () => clearInterval(slideInterval);
    }, [imageLoaded]);

    const handleSlide = (step) => {
        if (activities.length === 0) return;
        if (!imageLoaded) return;

        setDirection(step);
        setCurrentSlide((prevSlide) => (prevSlide + step + activities.length) % activities.length);
    };

    const handleDragEnd = (event, info) => {
        if (info.offset.x < -50) {
            handleSlide(1);
        } else if (info.offset.x > 50) {
            handleSlide(-1);
        }
    };

    //Gpt api
    const apiKey = import.meta.env.VITE_REACT_APP_API_KEY;
    const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

    //Gpt-activity 추천용
    const fetchSuggestedActivity = async (interests) => {
        const newActivities = await Promise.all(
            interests.map(async ({ interest, image }) => {
                const prompt = `${interest}에 대해 ${childAge}살 아이와 할 수 있는 활동명과 그에 대한 상세 내용을 제시해주세요. 활동명은 "아이와 ~ 하기"로 작성하고, 상세내용은 100자 이내로 간단히 작성해주세요.`;
                try {
                    const response = await fetch(apiEndpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            //'Authorization': `Bearer ${apiKey}`,
                        },
                        body: JSON.stringify({
                            model: 'gpt-4',
                            messages: [
                                { role: 'system', content: 'You are an assistant for recommending activities for children.' },
                                { role: 'user', content: prompt },
                            ],
                            max_tokens: 200,
                            temperature: 0.7,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(`Error fetching GPT response: ${response.statusText}`);
                    }

                    const data = await response.json();
                    const aiResponse = data.choices?.[0]?.message?.content || '추천 활동을 찾지 못했습니다.';
                    const [title, ...details] = aiResponse
                        .replace(/^활동명\s*:\s*/gm, '')
                        .split('\n')
                        .filter(Boolean);

                    return {
                        title: title || interest,
                        detail: details.join(' ') || '상세 설명 없음',
                        image,
                    };
                } catch (error) {
                    console.error(`Error fetching activity for ${interest}:`, error);
                    return { title: interest, detail: '추천 활동 불러오기 실패', image };
                }
            })
        );
        setActivities(newActivities);
    };

    //Gpt-대화주제 추천용
    const fetchSuggestedTopics = async () => {
        setLoading(true);
        const shuffled = predefinedInterests.sort(() => 0.5 - Math.random());
        const selectedInterests = shuffled.slice(0, 2);

        const prompt = `아래 두 가지 관심사에 대해 ${childAge}살 아이와 이야기할 수 있는 주제를 한 줄씩 제안해줘. 아이에게 이야기하듯 대화 내용을 작성해줘. 한 답변당 최대 25글자만 작성하고 주제, 따옴표, 숫자, 하이픈 제거해서 대화내용만 답변 두줄만 작성해줘.
        ${selectedInterests[0]}
        ${selectedInterests[1]}`;

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [
                        { role: 'system', content: 'You are an assistant for recommending conversation topics for father and children.' },
                        { role: 'user', content: prompt },
                    ],
                    max_tokens: 90,
                    temperature: 0.7,
                }),
            });
            const data = await response.json();
            const aiResponse = data.choices?.[0]?.message?.content || '추천 주제를 찾지 못했습니다.';
            const topicsArray = aiResponse.split('\n').filter(Boolean);
            setSuggestedTopics(topicsArray);
        } catch (error) {
            console.error('오류 발생!', error);
            setSuggestedTopics(['오류 발생! 다시 시도해 주세요.']);
        } finally {
            setLoading(false);
        }
    };

    //모달 함수
    const [detailModalIsOpen, setDetailModalIsOpen] = useState(false);

    const openDetailModal = (index) => {
        if (activities[index]) {
            setSelectedActivity(activities[index]);
            setDetailModalIsOpen(true);
            window.history.pushState({ isModalOpen: true }, '');

        } else {
            console.error('Invalid activity selected.');
        }
    };

    const closeDetailModal = () => {
        setDetailModalIsOpen(false);
        setSelectedActivity(null);

        if (window.history.state?.isModalOpen) {
            window.history.back();
        }
    };

    useEffect(() => {
        const handlePopState = (event) => {
            if (event.state?.isModalOpen) {
                setDetailModalIsOpen(false);
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    //좋아요 컨트롤
    const handleLike = async () => {
        if (selectedActivity) {
            const isLiked = likedActivities[selectedActivity.title] || false;

            const newLikedActivities = {
                ...likedActivities,
                [selectedActivity.title]: !isLiked,
            };
            setLikedActivities(newLikedActivities);

            try {
                const db = getFirestore(app);

                const favoriteData = {
                    name: selectedActivity.title,
                    addedAt: new Date().toLocaleString(),
                };

                const auth = getAuth(app);
                const currentUser = auth.currentUser;
                if (currentUser) {
                    const userId = currentUser.uid;
                    await addDoc(collection(db, `users/${userId}/favorites`), favoriteData);
                } else {
                    console.error("No user is logged in.");
                }
            } catch (error) {
                console.error("Error adding favorite: ", error);
            }
        }
    };

    return (
        <div className="Home-Conatainer">
            <div className="Home-Header">
                <div className="Home-Header-Logo">
                    <img src={LogoExtraSmall} alt="LogoExtraSmall" />
                </div>
                <div className="Home-Header-myPage" onClick={handleMypage}>
                    <img src={mypageIcon} alt="mypageIcon" />
                </div>
            </div>
            <div className="Daily-Recommended-Container">
                <AnimatePresence initial={false} custom={direction}>
                    {activities[currentSlide] && (
                        <motion.div
                            key={currentSlide}
                            className="Daily-Recommended-ActivityImage"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={handleDragEnd}
                            custom={direction}
                            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: direction < 0 ? 300 : -300, opacity: 0 }}
                            transition={{ type: "tween", duration: 0.9, ease: "easeInOut" }}
                        >
                            <img
                                src={activities[currentSlide].image}
                                alt={activities[currentSlide].interest}
                                onLoad={handleImageLoad}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <img className="DoubleSparkle" src={DoubleSparkle} alt="DoubleSparkle" />
            <div className="ActivityDetail" onClick={() => openDetailModal(currentSlide)}>
                더보기
            </div>
            <div className="Daily-Recommended-ActivityText">
                오늘의 추천 활동<br />
                <motion.span
                    key={currentSlide}
                    className="Daily-Recommended-ActivityTextByGPT"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                >
                    {activities[currentSlide].title}
                </motion.span>
            </div>
            <div className="Conversation-list-with-Child-ByAI">
                <div className="Conversation-Title">{childName}와 나눌 대화 <span className="Spanlist">List</span></div>
                <div className="first-recommendation-list">
                    {suggestedTopics[0]}
                </div>
                <div className="second-recommendation-list">
                    {suggestedTopics[1]}
                </div>
            </div>
            <div className="AdContainer">
                <div className="AdSlider" style={{ transform: `translateX(${-adIndex * 100}%)`, transition: 'transform 0.5s ease-in-out' }}>
                    {ads.map((ad, index) => (
                        <div className="AdSlide" key={index}>
                            <img src={ad} alt={`Ad ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>
            <img className="img-frame" src={imgFrame} alt="Frame" />

            <Modal
                isOpen={detailModalIsOpen}
                onRequestClose={closeDetailModal}
                contentLabel="상세모달"
                className="modal1"
                overlayClassName="overlay"
            >
                {selectedActivity ? (
                    <div className="detailModal-container">
                        <div className="detailModal-image">
                            <img src={selectedActivity.image} alt={selectedActivity.text} />
                        </div>
                        <img className="detailModal-DoubleSparkle" src={DoubleSparkle} alt="DoubleSparkle" />
                        <div className="detailModal-ActivityText">
                            오늘의 추천 활동<br />
                            <span className="detailModal-ActivityTextByGPT">{selectedActivity.title}</span>
                        </div>
                        <img className="detailModal-dotVector" src={dotVector} alt="" />
                        <div className="detailModal-contents">
                            {selectedActivity.detail}
                        </div>
                        <div className="detailModal-dip" onClick={handleLike}>
                            <img
                                className="detailModal-dipIcon"
                                src={likedActivities[selectedActivity.title] ? SelectedHeart : nonSelectedHeart}
                                alt="like-icon"
                            />
                            <div className="detailModal-dipText">
                                {likedActivities[selectedActivity.title] ? '찜 완료' : '찜 하기'}
                            </div>
                        </div>
                        <img className="detailModal-closeModal" src={Xbutton} alt="Xbutton" onClick={closeDetailModal} />
                        <img className="detailModal-imgFrame" src={imgFrame} alt="imgFrame" />
                    </div>
                ) : (
                    <div>데이터를 불러오는 중입니다.</div>
                )}
            </Modal>
        </div>
    );
};

export default HomeScreen;