import React, { useCallback, useState, useEffect, createRef } from 'react';
import styles from './styles.module.scss';
import Lottie from 'react-lottie';
import { collection, query, orderBy, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '~/service/firebase';
import * as snowAnimation from '~/assets/animations/let-it-snow.json';
import * as narrowSnowAnimation from '~/assets/animations/snowfall.json';
import Logo from '~/assets/img/logo.svg';
import Image from 'next/image';
import { BsSnow, BsThermometerSnow, BsCloudSnowFill, BsFillVolumeMuteFill, BsFillVolumeUpFill } from 'react-icons/bs';
import { FaSnowman, FaSnowboarding } from 'react-icons/fa';
import { GiIceCube, GiIcePop, GiIceberg } from 'react-icons/gi';
import { RiFridgeFill, RiGithubFill } from 'react-icons/ri';

// eslint-disable-next-line react/jsx-key
const icons = [<BsSnow />, <BsThermometerSnow />, <BsCloudSnowFill />, <FaSnowman />, <FaSnowboarding/>, <GiIceCube/>, <GiIcePop/>, <GiIceberg/>, <RiFridgeFill/>];

export default function Index() {

  const [name, setName] = useState('');
  const [instagram, setInstagram] = useState('');
  const [guests, setGuests] = useState([]);
  const songRef = createRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lottieOptions, setLottieOptions] = useState({});

  useEffect(() => {
    setLottieOptions({
      loop: true,
      autoplay: true,
      animationData: !window.matchMedia("(max-width: 560px)").matches ? snowAnimation : narrowSnowAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    });
  }, []);

  useEffect(() => {
    const guestsColRef = query(collection(db, 'friaca'), orderBy('confirmed', 'asc'))
    onSnapshot(guestsColRef, (snapshot) => {
      setGuests(snapshot.docs.map(doc => doc.data()))
    });
  }, []);

  const toggleSong = useCallback(()=>{
    if(songRef.current){
      if(isPlaying) {
        songRef.current.pause();
        setIsPlaying(false);
      } else {
        songRef.current.currentTime = 0;
        songRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [songRef, isPlaying]);

  const saveGuest = useCallback(async () => {
    try {
      if (name === "") throw new Error("Nome é obrigatório!");
      setSubmitted(true);
      await addDoc(collection(db, 'friaca'), {
        confirmed: Timestamp.now(),
        name: name,
        instagram: instagram.replace("@", "")
      })
      setName("");
      setInstagram("");
    } catch (err) {
      alert(err)
    }
  }, [name, instagram]);

  const changeInstagram = useCallback((e) => {
    const newIg = e.target.value;

    setInstagram(newIg == "" || newIg.startsWith("@") ? newIg : `@${newIg}`)
  }, []);

  return (
    <main className={styles.home}>
      <Lottie
        options={lottieOptions}
        isClickToPauseDisabled
        speed={0.5}
        width='100%'
        height='100%'
        style={{ position: 'absolute', zIndex: 0 }}
      />
      <div className={styles.right}>
        <div className={styles.right__title}>
          <Image src={Logo} alt="Logotipo da Friaca Party" />
        </div>
        <div className={styles.right__when}>
          <p className={styles.right__when__date}>16<br/><span>OUT</span></p>
          <span className="hollow">AS</span>
          <p className={styles.right__when__time}>17<span>H</span></p>
        </div>
        <a href="https://www.google.com.br/maps/place/Casa+das+Poc+Produções+Criativas/@-3.7444096,-38.5428548,17z/data=!3m1!4b1!4m5!3m4!1s0x7c7490eac820b21:0x7bda151c5e7d98f0!8m2!3d-3.7444091!4d-38.5406554" 
          className={styles.right__where}
          target="_blank"
          rel='noreferrer'
        >
          Rua Adolfo Herbster 364 Benfica <br /> Casa das Poc
        </a>
      </div>

      <div className={styles.home__left}>
        <div className={`${styles.left__confirmation} ${submitted ? styles.left__confirmation__submitted : ""}`}>
          {!submitted ? 
            <>
              <h2>Confirme sua presença, boiola</h2>
              <div className={styles.left__inputs}>
                <input placeholder='Nome' value={name} onChange={(e) => setName(e.target.value)} />
                <input placeholder='Instagram' value={instagram} onChange={changeInstagram} />
              </div>
              <button onClick={saveGuest}>Confirmar</button>
            </> :
            <h2>
              Presença confirmada!<br/>
              Quem faltar deu pro <br/>
              Bolsonaro
            </h2>
          }
        </div>

        <div className={styles.left__confirmed}>
          <h2>Presenças confirmadas no <br /><span>Frozen Carpet</span></h2>
          <table>
            {guests.map((guest, idx) =>
              <>
                <tr className={styles.left__guestIcon}>
                  {React.cloneElement(icons[Math.floor(Math.random()*icons.length)], {key: idx})}
                </tr>
                <tr className={styles.left__guestName}>{guest.name}</tr>
                <tr className={styles.left__guestInstagram}>
                  {guest.instagram ?
                    <a href={`http://www.instagram.com/${guest.instagram.replace(" ", "")}/`} target="_blank" rel="noreferrer">
                      {guest.instagram.startsWith("@") ? guest.instagram : `@${guest.instagram}`}</a> :
                    ":c"
                  }
                </tr>
              </>)}
          </table>
        </div>
      </div>
      <audio src='BGMusic.mp3' ref={songRef} hidden />
      <button className={styles.home__sound} onClick={toggleSong} >
        {isPlaying ? <BsFillVolumeUpFill /> : <BsFillVolumeMuteFill />}
      </button>

      <a className={styles.home__ref} href="https://github.com/franklingg" target="_blank" rel="noreferrer">
        <RiGithubFill />
        <span>Developed by <br /> Franklin Regis</span>
      </a>
    </main>
  );
}
