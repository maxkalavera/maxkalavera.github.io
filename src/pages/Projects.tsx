import styles from 'src/styles/projects.module.css';

export default function Projects() {
  return (
    <div className={`${styles.container}`}>
      <h3 className={`primary ${styles['title']}`}>Projects</h3>
      <div className={styles['projects__list']}>
        <div className={styles['project']}>
          <div className='column gap--md'>
            <div className='column gap--sm'>
              <h4 className={`primary ${styles['project__title']}`}>
                React Component Isolator
              </h4>
              <p className={`secondary justify ${styles['project__description']}`}>
                React library build with the objective of having a place to visualize React components graphically isolated builded to work in any environment able to run React.
                Visit the repository main page for more information:&nbsp;
                <br />
                <a href='https://github.com/maxkalavera/react-component-isolator'>
                  https://github.com/maxkalavera/react-component-isolator
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};