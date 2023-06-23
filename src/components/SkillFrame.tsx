import styles from 'src/styles/skill-frame.module.css';

export default function SkillFrame({
  text=''  
}: {
  text?: string
}) {
  return (
    <div className={styles.container}>
      <h4 className='primary'>
        {text}
      </h4>
    </div>
  );
};