import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import Modal from "react-modal";
import "./MyPage.css";
import topframe2 from "../Images/myactivityButtonDeco/TopFrame2.png";
import LogoExtraSmall from "../Images/LogoExtraSmall.png";
import LogoVer2 from "../Images/aptlogover2.png";
import profile from "../Images/profile.png";
import smile from "../Images/smileIcon.png";
import heart from '../Images/Icons/myActivityIcon_Selected.png';
import filterIcon from "../Images/filterIcon.png";
import pointIcon from "../Images/pointIcon.png";
import settingsIcon from "../Images/settingsIcon.png";
import logoutIcon from "../Images/logoutIcon.png";
import warningIcon from "../Images/warningIcon.png";
import checkIcon from "../Images/checkIcon.png";


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

function MyPage() {
  const navigate = useNavigate();
  const [parentName, setParentName] = useState("");
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [interestsModalIsOpen, setInterestsModalIsOpen] = useState(false);
  const [childInterests, setChildInterests] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore();
        const userDoc = doc(db, `users/${user.uid}`);

        try {
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setParentName(data.parentName || "이름 없음");
            setChildName(data.childName || "이름 없음");
            setChildAge(data.childAge || "나이 없음");
            setChildInterests(data.interests || []);
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        navigate("/");
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const openInterestsModal = () => setInterestsModalIsOpen(true);
  const closeInterestsModal = () => setInterestsModalIsOpen(false);

  const handleActivityClick = (index) => {
    setSelectedActivities((prev) => {
        if (prev.includes(index)) {
            return prev.filter((i) => i !== index);
        } else if (prev.length < 3) {
            return [...prev, index];
        } else {
            return prev;
        }
    });
};

  const handleNextClick = async () => {
    if (selectedActivities.length >= 3) {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore();
        const userDoc = doc(db, `users/${user.uid}`);

        const selectedInterests = selectedActivities.map(
          (index) => activityImages[index].label
        );

        try {
          await updateDoc(userDoc, { interests: selectedInterests });
          setChildInterests(selectedInterests);
          closeInterestsModal();
        } catch (error) {
          console.error("Error updating interests:", error);
        }
      }
    }
  };

  const handleNameAgeEdit = (field, value) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getFirestore();
      const userDoc = doc(db, `users/${user.uid}`);

      updateDoc(userDoc, { [field]: value })
        .then(() => {
          if (field === "childName") setChildName(value);
          if (field === "childAge") setChildAge(value);
        })
        .catch((error) => console.error("Error updating field:", error));
    }
  };


  return (
    <div className="mypage-container">
      <img className="mypage-headerFrame" src={topframe2} alt="header" />
      <div className="mypage-header">
        <div className="mypage-header-LogoExtraSmall">
          <img src={LogoExtraSmall} alt="ExtraSmall Logo" />
        </div>
        <div className="mypage-header-LogoVer2">
          <img src={LogoVer2} alt="Logo" />
        </div>
      </div>

      <div className="mypage-profile-container">
        <div className="mypage-profile-background">
          <img className="mypage-profile-image" alt="Profile" src={profile} />
        </div>
        <div className="mypage-profile-text">
          <span className="mypage-profile-name">{parentName}</span> 님<br />
          <div className="mypage-profile-setting">프로필 설정</div>
        </div>
      </div>

      <div className="mypage-manage-mykid-container">
        <div className="mypage-manage-mykid-title">내 아이 관리</div>
        <div className="mypage-manage-mykid-box">
          <img className="mypage-smileIcon" src={smile} alt="smile" />
          <div className="mypage-manage-mykid-profile">
            내 아이 프로필
            <div className="mypage-manage-mykid-data">
              이름 :{" "}
              <span
                contentEditable
                onBlur={(e) => handleNameAgeEdit("childName", e.target.innerText)}
              >
                {childName}
              </span>
              <br />
              나이 :{" "}
              <span
                contentEditable
                onBlur={(e) => handleNameAgeEdit("childAge", e.target.innerText)}
              >
                {childAge}
              </span>
            </div>
          </div>
        </div>
        <div className="hrLine3" />
        <div className="mypage-mykid-interests-data">
          <div>내 아이 관심사</div>
          <div className="mypage-mykid-interests-itemBox">
            {childInterests.map((interest, index) => (
              <span key={index} className="interests-item">
                <img className="heartIcon" src={heart} /> {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mypage-button-changeInterests-container-outside">
        <div className="mypage-button-changeInterests-container-inside" alt="edit" onClick={openInterestsModal}>
          <img src={filterIcon} className="mypage-editIcon" />
          <div className="mypage-button-text">관심사 수정</div>
        </div>
      </div>

      <div className="mypage-etc-container">
        <div className="mypage-pointIcon">
          <img src={pointIcon} alt="point" />
          <div>내 포인트</div>
        </div>
        <div className="hrLine4" />
        <div className="mypage-settingsIcon">
          <img src={settingsIcon} alt="settings" />
          <div>환경설정</div>
        </div>
        <div className="hrLine4" />
        <div className="mypage-logoutIcon" onClick={handleLogout}>
          <img src={logoutIcon} alt="logout" />
          <div>로그아웃</div>
        </div>
      </div>
      <div className="mypage-profile-version">
        <img src={warningIcon} alt="warning" />
        버전정보 2.0
      </div>

      <Modal
        isOpen={interestsModalIsOpen}
        onRequestClose={closeInterestsModal}
        contentLabel="관심사 수정"
        className="modal2"
        overlayClassName="overlay"
      >
        <div className="interests-reselect-container">
          <div className="interests-reselect-title">관심사 재선택</div>
          <div className="interests-reselect-description">
            아이의 관심사를 선택해주세요<br />
            <span className="interests-reselect-subdescription">홈 피드를 구성할 수 있도록 3개 선택해주세요.</span>
          </div>
        </div>
        <div className="interests-reselect-reselection">
          {activityImages.map((activity, index) => (
            <div
              key={index}
              className={`interests-reselect-grid-item ${selectedActivities.includes(index) ? "selected" : ""
                }`}
              onClick={() => handleActivityClick(index)}
            >
              <img src={activity.src} alt={activity.label} />
              <div className="interests-reselect-label">{activity.label}</div>
              {selectedActivities.includes(index) && (
                <img src={checkIcon} alt="check" className="interests-reselect-check-icon" />
              )}
            </div>
          ))}
        </div>
        <div className={`interests-reselect-next-button ${selectedActivities.length >= 3 ? "active" : "inactive"}`} onClick={handleNextClick}>완료</div>
      </Modal>

    </div>
  );
}

export default MyPage;
