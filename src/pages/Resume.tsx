import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import Layout from 'src/components/Layout';
import SkillFrame from 'src/components/SkillFrame';
import Portrait from 'src/assets/portrait.svg';
import styles from 'src/styles/resume.module.css';
import { useState } from 'react';

function Resume() {
  const [flags, setFlags] = useState({
    'general-programing-topics': true,
    'back-end-development': true,
    'front-end-development': true,
    'operations': true,
    'design': true,
    'languages': true,
  });

  const toggleFlag = (id: keyof typeof flags) => {
    setFlags((prevState) => {
      return {
        ...prevState,
        [id]: !prevState[id]
      };
    });
  };

  const setAll = (flag: boolean=false) => {
    setFlags({
      'general-programing-topics': flag,
      'back-end-development': flag,
      'front-end-development': flag,
      'operations': flag,
      'design': flag,
      'languages': flag,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles['about-me']}>
          <div className={`column gap--sm`}>
            <h4 className='primary'>ABOUT ME</h4>
            <p className='secondary'>
            Application development expertise. competent in Javascript and Python; adept in converting business needs into technological solutions; extensive knowledge of Linux systems and active participation in their use; Basic understanding of visual design, with an emphasis on using tools to create software graphical user interfaces.
            </p>
          </div>
          <img 
            className={`${styles['portrait']}`}
            src={Portrait} 
            alt='website authors portrait'
          />
        </div>

        <a 
          className={`${styles['download-pdf-button']}`} 
          href={process.env.PUBLIC_URL + '/resume.pdf'} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <h4 className='primary'>Download CV (PDF)</h4>
          <FontAwesomeIcon icon={faDownload} />
        </a>

        <div className='column gap--sm'>
          <h4 className='primary'>PROFILE</h4>
          <p className='secondary'>
            Software engineer born in Monterrey, Mexico, with 3 years of professional experience building web applications. Proficient in Python and Javascript; skilled in translating business requirements into software solutions; Extensive experience with Linux systems, being an active user; Essential knowledge in graphic design, with a focus on the design of software graphical interfaces.
          </p>
        </div>
        
        <div className='column gap--sm'>
          <h4 className='primary'>EDUCATION</h4>

          <div className='column gap--xs'>
            <h4 className='secondary'>Software Engineering</h4>
            <p className='secondary'>August 2009 - January 2015</p>
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
        </div>

        <div className='column gap--md'>
          <h4 className='primary'>LICENSES & CERTIFICATIONS</h4>

          <div className='column gap--xs'>
            <h4 className='secondary'>Machine Learning</h4>
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

          <div className='column gap--xs'>
            <h4 className='secondary'>Graphic Design Specialization</h4>
            <p className='secondary'>
              Coursera<br/>
              Aug 2021<br/>
              Credential ID: K6495WPA96GR<br/>
              <a 
                href='https://www.coursera.org/account/accomplishments/specialization/certificate/K6495WPA96GR'
                className={`secondary ${styles.link}`}
              >
                See credential
              </a>
            </p>
          </div>
        </div>

        <div className='column gap--md'>
          <h4 className='primary'>PROFESSIONAL EXPERIENCE</h4>

          <div className='column gap--sm'>
            <div className='column'>
              <h4 className='secondary'>Full Stack Software Engineer</h4>
              <h4 className='secondary'>Crea Libre / Evient, San Nicolas, Nuevo León</h4>
              <h4 className='secondary'>June 2017 - June 2019, 2 years</h4>
            </div>

            <p className='secondary'>
            Contributed largely to the implementation of a web application by heavily participating in the planning of the application’s architecture and working on implementing the client’s requested features.
            </p>
            <ul className='secondary'>
              <li>Developing new web features for the front-end and back-end.</li>
              <li>Building a developing environment, actively providing feedback, and testing new features using Jenkins, Python, and ReactJS tools.</li>
              <li>Involved in planning and decision-making for implementing new features.</li>
            </ul>
          </div>

          <div className='column gap--sm'>
            <div className='column'>
              <h4 className='secondary'>Software Engineer / Front-End Developer</h4>
              <h4 className='secondary'>Wizeline, Guadalajara, Jalisco</h4>
              <h4 className='secondary'>January 2022 - July 2022, 7 months</h4>
            </div>

            <p className='secondary'>
              Developing web interfaces using primarily the ReactJS framework.
            </p>
            <ul className='secondary'>
              <li>Developing front-end interfaces using ReactJS together with NodeJS development tools.</li>
              <li>Involved in designing new features using the Figma tool.</li>
              <li>Involved in Python async task tool maintenance.</li>
            </ul>
          </div>
        </div>

        <div className={`${styles['skills']}`}>
        <div className='row gap--sm'>
            <h4 className='primary'>SKILLS</h4>
            <small 
              className='secondary' 
              style={{cursor: 'pointer', textDecoration: 'underline'}}
              onClick={() => setAll(false)}
            >
              Hide all
            </small>
          </div>

          <div className='column gap--sm'>
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
              className={styles['skills-row']}
              style={{
                display: flags['general-programing-topics'] ? 'flex' : 'none'
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

          <div className='column gap--sm'>
            <div className={styles['skills-topic']}
              onClick={() => toggleFlag('back-end-development')}
            >
              <p className='secondary'>Back-end development</p>
              <FontAwesomeIcon 
                icon={flags['back-end-development'] ? faChevronDown : faChevronRight} 
                className={styles['skills-topic__chevron']} 
              />
            </div>

            <div 
              className={styles['skills-row']}
              style={{
                display: flags['back-end-development'] ? 'flex' : 'none'
              }}
            >
              <SkillFrame text='Django' />
              <SkillFrame text='PostgreSQL' />
              <SkillFrame text='SQLite' />
              <SkillFrame text='Redis' />
              <SkillFrame text='Celery' />
              <SkillFrame text='REST' />
            </div>
          </div>

          <div className='column gap--sm'>
            <div className={styles['skills-topic']}
              onClick={() => toggleFlag('front-end-development')}
            >
              <p className='secondary'>Front-end development</p>
              <FontAwesomeIcon 
                icon={flags['front-end-development'] ? faChevronDown : faChevronRight} 
                className={styles['skills-topic__chevron']} 
              />
            </div>

            <div 
              className={styles['skills-row']}
              style={{
                display: flags['front-end-development'] ? 'flex' : 'none'
              }}
            >
              <SkillFrame text='ReactJS' />
              <SkillFrame text='Webpack' />
              <SkillFrame text='RollUp' />
              <SkillFrame text='HTML5' />
              <SkillFrame text='CSS' />
              <SkillFrame text='SASS' />
              <SkillFrame text='Redux' />
            </div>
          </div>

          <div className='column gap--sm'>
            <div className={styles['skills-topic']}
              onClick={() => toggleFlag('operations')}
            >
              <p className={`secondary`}>Operations</p>
              <FontAwesomeIcon 
                icon={flags['operations'] ? faChevronDown : faChevronRight} 
                className={styles['skills-topic__chevron']} 
              />
            </div>

            <div 
              className={styles['skills-row']}
              style={{
                display: flags['operations'] ? 'flex' : 'none'
              }}
            >
              <SkillFrame text='Docker' />
              <SkillFrame text='Git' />
              <SkillFrame text='Bash' />
            </div>
          </div>

          <div className='column gap--sm'>
            <div className={styles['skills-topic']}
              onClick={() => toggleFlag('design')}
            >
              <p className='secondary'>Design</p>
              <FontAwesomeIcon 
                icon={flags['design'] ? faChevronDown : faChevronRight} 
                className={styles['skills-topic__chevron']} 
              />
            </div>

            <div 
              className={styles['skills-row']}
              style={{
                display: flags['design'] ? 'flex' : 'none'
              }}
            >
              <SkillFrame text='Figma' />
              <SkillFrame text='Inkscape' />
              <SkillFrame text='Gimp' />
            </div>
          </div>

          <div className='column gap--sm'>
            <div className={styles['skills-topic']}
              onClick={() => toggleFlag('languages')}
            >
              <p className='secondary'>Languages</p>
              <FontAwesomeIcon 
                icon={flags['languages'] ? faChevronDown : faChevronRight} 
                className={styles['skills-topic__chevron']} 
              />
            </div>

            <div 
              className={styles['skills-row']}
              style={{
                display: flags['languages'] ? 'flex' : 'none'
              }}
            >
              <SkillFrame text='English' />
              <SkillFrame text='Spanish' />
            </div>
          </div>
        </div>

        <a 
          className={`${styles['download-pdf-button']}`} 
          href={process.env.PUBLIC_URL + '/resume.pdf'} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <h4 className='primary'>Download CV (PDF)</h4>
          <FontAwesomeIcon icon={faDownload} />
        </a>
      </div>
    </div>
  )
};

export default function ResumeWrapper () {
  return (
    <Layout>
      <Resume />
    </Layout>
  );
}
