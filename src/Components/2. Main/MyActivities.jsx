import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // onAuthStateChanged 추가
import { app } from '../../firebase';
import "./MyActivities.css";

import LogoExtraSmall from '../Images/LogoExtraSmall.png';
import LogoVer2 from '../Images/aptlogover2.png';
import defaultIcon from '../Images/defaultIcon.png';
import decoheart from '../Images/deco-heart.png';
import TopFrame from '../Images/myactivityButtonDeco/TopFrame.png';

function MyActivities() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("로딩중...");

    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth(app);

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserNameAndFavorites(user.uid);
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchUserNameAndFavorites = async (userId) => {
        try {
            const db = getFirestore(app);

            const userDoc = doc(db, `users/${userId}`);
            const userSnapshot = await getDoc(userDoc);
            if (userSnapshot.exists()) {
                const parentName = userSnapshot.data().parentName;
                setUserName(parentName || "이름 없음");
            }

            const favoritesRef = collection(db, `users/${userId}/favorites`);
            const q = query(favoritesRef, orderBy("addedAt", "desc"));
            const querySnapshot = await getDocs(q);

            const favoriteActivities = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setActivities(favoriteActivities);
        } catch (error) {
            console.error("Error fetching user name or favorite activities: ", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="activities-container">
                <div className="activities-header">
                    <div className="activities-Header-Logo">
                        <img src={LogoExtraSmall} alt="LogoExtraSmall" />
                    </div>
                    <div className="activities-Header-ver2">
                        <img src={LogoVer2} alt="LogoVer2" />
                    </div>
                </div>
                <div className="activities-Profile">
                    <div className="activities-ProfileBox">
                        <div className="activities-ProfileImg">
                            <img src={defaultIcon} />
                        </div>
                    </div>
                    <div className="activities-title">
                        <span className="activities-userName">{userName}</span>님<br />
                        의 관심활동
                    </div>
                </div>
                <div className="activities-button-container">
                    <div className="activities-1Button">
                        <div className="activities-Name">로딩중...</div>
                        <div className="deco-heart-back"><img src={decoheart} /></div></div>
                </div>
                <img className="activities-TopFrame" src={TopFrame} alt="" />
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="activities-container">
                <div className="activities-header">
                    <div className="activities-Header-Logo">
                        <img src={LogoExtraSmall} alt="LogoExtraSmall" />
                    </div>
                    <div className="activities-Header-ver2">
                        <img src={LogoVer2} alt="LogoVer2" />
                    </div>
                </div>
                <div className="activities-Profile">
                    <div className="activities-ProfileBox">
                        <div className="activities-ProfileImg">
                            <img src={defaultIcon} />
                        </div>
                    </div>
                    <div className="activities-title">
                        <span className="activities-userName">{userName}</span>님<br />
                        의 관심활동
                    </div>
                </div>
                <div className="activities-button-container">
                    <div className="activities-1Button">
                        <div className="activities-Name">활동을 찜해보세요!</div>
                        <div className="deco-heart-back"><img src={decoheart} /></div></div>
                </div>
                <img className="activities-TopFrame" src={TopFrame} alt="" />
            </div>
        );
    }

    return (
        <div className="activities-container">
            <div className="activities-header">
                <div className="activities-Header-Logo">
                    <img src={LogoExtraSmall} alt="LogoExtraSmall" />
                </div>
                <div className="activities-Header-ver2">
                    <img src={LogoVer2} alt="LogoVer2" />
                </div>
            </div>
            <div className="activities-Profile">
                <div className="activities-ProfileBox">
                    <div className="activities-ProfileImg">
                        <img src={defaultIcon} />
                    </div>
                </div>
                <div className="activities-title">
                    <span className="activities-userName">{userName}</span>님<br />
                    의 관심활동
                </div>
            </div>
            <div className="activities-button-container">
                {activities.map((activity, index) => (
                    <div
                        key={activity.id}
                        className={`activities-${(index % 4) + 1}Button`}
                        onClick={() => {
                            navigate('/write', { state: { activityName: activity.name } });
                        }}
                    >
                        <div className="activities-Name">{activity.name}</div>
                        <div className="deco-heart-back"><img src={decoheart} /></div>
                    </div>
                ))}
            </div>
            <img className="activities-TopFrame" src={TopFrame} alt="" />
        </div>
    );
}

export default MyActivities;
