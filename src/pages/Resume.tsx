import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import SkillFrame from 'src/components/SkillFrame';
import Portrait from 'src/assets/portrait.svg';
import styles from 'src/styles/resume.module.css';
import { useState } from 'react';

export default function Resume() {
  const [flags, setFlags] = useState({
    'general-programing-topics': true,
  });

  const toggleFlag = (id: keyof typeof flags) => {
    setFlags((prevState) => {
      return {
        ...prevState,
        [id]: !prevState[id]
      };
    });
  };

  console.log('FLAGS', flags);

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.content}`}>

        <div className={styles.row}>
          <div className={`${styles.column} ${styles['background-frame']}`}>
            <h3 className={`primary`}>About me</h3>
            <p className='secondary'>
              Born in Monterrey, Mexico in the nineties, which makes me part of a generation of technological and social transition, full of contrasts that feed a broad perspective for those who know how to observe. Computer programmer by accident but passionate about it by luck, I try to have a simple life and develop my natural abilities as much as possible. Naturally logical, but sensitive, I have sought to develop a balance between my logical side and my emotional side, which has led me to have a great curiosity for art. A fan of comedy, dancing and good stories, I keep my mind stimulated by splitting my time between solving logical problems on a computer and enjoying beautiful experiences on the dance floor. 
My interest is, for now, in finding a tasks that allows me to survive financially, and to feel that my work contributes something valuable to other people's lives.
            </p>
          </div>
          <img 
            className={`${styles['portrait']}`}
            src={Portrait} 
            alt='website authors portrait'
          />
        </div>

        <div className={`${styles['download-pdf-button']}`}>
          <h4 className='primary'>Download as PDF</h4>
          <FontAwesomeIcon icon={faDownload} />
        </div>

        <div className={`${styles['column']}`}>
          <h4 className={`primary`}>PROFILE</h4>
          <p className='secondary'>
          Software engineer born in Monterrey, Mexico, with 3 years of professional experience building web applications. Proficient in Python and Javascript; Skilled translating business requirement into software solutions; Extensive experience with Linux systems, being an active user; Essential knowledge in graphic design focused in the design of software graphical interfaces.
          </p>
        </div>
        
        <div className={`${styles['column']}`}>
          <h4 className={`primary`}>EDUCATION</h4>
          <p className={`secondary`}>
            AUGUST 2009 - JANUARY 2015
          </p>
          <p className='secondary'>
            Universidad Autónoma de Nuevo León - San Nicolás de los Garza, Nuevo León Bachelor’s degree in Software Engineering (Ingeniería en Tecnología de Software).
            <br/>
            <a 
              href='https://maxkalavera.blogspot.com/p/destacables.html'
              className={`secondary ${styles.link}`}
            >
              Projects highlights
            </a>
          </p>
        </div>

        <div className={`${styles['column']}`} style={{gap: 'var(--gap-md)'}}>
          <h4 className={`primary`}>LICENSES & CERTIFICATIONS</h4>

          <div className={`${styles['column']}`} style={{gap: 'var(--gap-sm)'}}>
            <h4 className={`secondary`}>Machine Learning</h4>
            <p className='secondary'>
              Coursera<br/>
              Dec 2020<br/>
              Credential ID: A8FCSDG5P9M9<br/>
              <a 
                href='https://www.coursera.org/account/accomplishments/certificate/A8FCSDG5P9M9'
                className={`secondary ${styles.link}`}
              >
                See credential
              </a>
            </p>
          </div>

          <div className={`${styles['column']}`} style={{gap: 'var(--gap-sm)'}}>
            <h4 className={`secondary`}>Graphic Design Specialization</h4>
            <p className='secondary'>
              Coursera<br/>
              Dec 2020<br/>
              Credential ID: A8FCSDG5P9M9<br/>
              <a 
                href='https://www.coursera.org/account/accomplishments/specialization/certificate/K6495WPA96GR'
                className={`secondary ${styles.link}`}
              >
                See credential
              </a>
            </p>
          </div>
        </div>

        <div className={`${styles['column']}`} style={{gap: 'var(--gap-md)'}}>
          <h4 className={`primary`}>PROFESSIONAL EXPERIENCE</h4>

          <div className={`${styles['column']}`} style={{gap: 'var(--gap-sm)'}}>
            <div className={`${styles['column']}`} style={{gap: '0px'}}>
              <h4 className={`secondary`}>Full Stack Software Engineer</h4>
              <h4 className={`secondary`}>Crea Libre / Evient, San Nicolas, Nuevo León</h4>
              <h4 className={`secondary`}>June 2017 - June 2019, 2 years</h4>
            </div>

            <p className='secondary'>
              Contributed largely in the implementation of a Web application by heavily participating in the planning of the application’s architecture and working on implementing client’s requested features.
            </p>
            <ul>
              <li>Developing new Web features for Front-end / Back-end.</li>
              <li>Building a developing environment for a team to develop and actively provide feedback and test new features using Jenkins, Python and ReactJS tools.</li>
              <li>Involved in planning and decision making for implementing new features.</li>
            </ul>
          </div>

          <div className={`${styles['column']}`} style={{gap: 'var(--gap-sm)'}}>
            <div className={`${styles['column']}`} style={{gap: '0px'}}>
              <h4 className={`secondary`}>Software Engineer / Front-End Developer</h4>
              <h4 className={`secondary`}>Wizeline, Guadalajara, Jalisco</h4>
              <h4 className={`secondary`}>January 2022 - July 2022, 7 months</h4>
            </div>

            <p className='secondary'>
              Developing Web interfaces using primarily ReactJS framework.
            </p>
            <ul>
              <li>Developing front-end interfaces using ReactJS together with NodeJS developing tools.</li>
              <li>Involved in designing new features using Figma tool.</li>
              <li>Involved in Python async task tool maintenance.</li>
            </ul>
          </div>
        </div>

        <div className={`${styles['column']}`}>
          <h4 className={`primary`}>SKILLS</h4>

          <div className={styles.column}>
            <div className={styles['skills-topic']}
              onClick={() => toggleFlag('general-programing-topics')}
            >
              <p className={`secondary`}>General programming topics</p>
              <FontAwesomeIcon 
                icon={flags['general-programing-topics'] ? faChevronDown : faChevronRight} 
                className={styles['skills-topic__chevron']} 
              />
            </div>

            <div 
              className={styles.row}
              style={{
                visibility: flags['general-programing-topics'] ? 'visible' : 'hidden'
              }}
            >
              <SkillFrame text='Problem Analysis' />
              <SkillFrame text='Algoritms' />
              <SkillFrame text='Linux Based Systems' />
              <SkillFrame text='MacOS' />
              <SkillFrame text='Python' />
              <SkillFrame text='Javascript' />
              <SkillFrame text='NodeJS' />
            </div>
          </div>
        </div>

        <div className={`${styles['download-pdf-button']}`}>
          <h4 className='primary'>Download as PDF</h4>
          <FontAwesomeIcon icon={faDownload} />
        </div>
      </div>
    </div>
  )
};