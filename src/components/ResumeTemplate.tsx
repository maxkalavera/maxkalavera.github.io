"use client"
import React, { ReactNode } from "react";
import { JSONResumeMeta, JSONResumeType } from "@/types/jsonResume";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { createStore, Provider, useAtomValue } from "jotai";
import { 
  locationAtom, 
  profilePictureAtom, 
  profilesAtom, 
  resumeAtom, 
  basicsAtom, 
  resumeMetaAtom, 
  workAtom, 
  volunteerAtom, 
  educationAtom, 
  awardsAtom, 
  certificatesAtom, 
  publicationsAtom, 
  skillsAtom, 
  languagesAtom, 
  interestsAtom, 
  referencesAtom, 
  projectsAtom 
} from "@/atoms/resume";
import { LinkIcon, MailIcon, MapPinIcon, PhoneIcon, QuoteIcon } from "lucide-react";
import moment from 'moment';
import IconFromURL from "./IconFromURL";

const styles = {
  section: "w-full flex flex-col justify-start items-start gap-4",
  sectionHeading: "text-primary-600 dark:text-primary-500 text-lg font-bold uppercase",
  paragraph: "w-full mt-2 mb-2",
  block: "w-full flex flex-col justify-start items-start gap-[0.25rem]",
  blockTitle: "font-bold text-primary-600 dark:text-primary-500",
  blockSubtitle: "font-bold text-gray-800 dark:text-foreground",
  icon: "min-w-4 size-4 text-primary-600 dark:text-primary-500"
}

interface Props extends React.ComponentPropsWithoutRef<React.ElementType>  {
  resume: JSONResumeType;
  meta: JSONResumeMeta;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ResumeTemplate = React.forwardRef<HTMLDivElement, Props>((
  {
    resume,
    meta,
    ...props
  }, 
  forwardedRef
) => {
  const resumeStore = createStore();
  resumeStore.set(resumeMetaAtom, meta);
  resumeStore.set(resumeAtom, resume);
  return (
    <Provider
      store={resumeStore}
    >
      <Content 
        {...props}
        ref={forwardedRef}
      />
    </Provider>
  )

});

ResumeTemplate.displayName = 'ResumeTemplate';

export default ResumeTemplate;

/******************************************************************************
 * Secondary Components
 *****************************************************************************/

const sections: {
  [key: string]: {
    label: string;
    column?: string;
    assert: (resume: JSONResumeType) => boolean;
  }[]
} = {
  'main': [
    { 
      label: 'basics', 
      assert: (resume) => !!resume.basics,
    },
    { 
      label: 'summary',
      assert: (resume) => !!resume.basics?.summary,
    },
    { 
      label: 'work',
      assert: (resume) => !!resume.work,
    },
    { 
      label: 'education',
      assert: (resume) => !!resume.education,
    },
    { 
      label: 'projects', 
      assert: (resume) => !!resume.projects,
    },
    { 
      label: 'references', 
      assert: (resume) => !!resume.references,
    },
    { 
      label: 'volunteer',
      assert: (resume) => !!resume.volunteer,
    },
  ],
  'side': [
    { 
      label: 'skills', 
      assert: (resume) => !!resume.skills,
    },
    { 
      label: 'certificates', 
      assert: (resume) => !!resume.certificates,
    },
    { 
      label: 'languages', 
      assert: (resume) => !!resume.languages,
    },
    { 
      label: 'awards', 
      assert: (resume) => !!resume.awards,
    },
  
    { 
      label: 'publications', 
      assert: (resume) => !!resume.publications,
    },
    { 
      label: 'interests', 
      assert: (resume) => !!resume.interests,
    },
  ]
};

function SectionMaper (
  label: string, 
  assert: (resume: JSONResumeType) => boolean = () => true,
  key: string | number,
) {
  const resume = useAtomValue(resumeAtom);
  return (assert(resume) && {
    'basics': <Header key={key} />,
    'summary': <Summary key={key} />,
    'work': <Work key={key} />,
    'volunteer': <Volunteer key={key} />,
    'education': <Education key={key} />,
    'awards': <Awards key={key} />,
    'certificates': <Certificates key={key} />,
    'publications': <Publications key={key} />,
    'skills': <Skills key={key} />,
    'languages': <Languages key={key} />,
    'interests': <Interests key={key} />,
    'references': <References key={key} />,
    'projects': <Projects key={key} />,
  }[label]) || null
}

const Content = React.forwardRef<
  HTMLDivElement, 
  React.ComponentPropsWithoutRef<React.ElementType>
>((
  {
    ...props
  }, 
  forwardedRef
) => {
  return (
    <section
      {...props}
      ref={forwardedRef}
      className={cn(
        "p-2 sm:p-4 md:p-8",
        "w-full flex flex-col-reverse gap-8",
        "md:grid md:grid-cols-3 md:gap-x-8",
      )}
    >
      <div className={cn(
        "md:col-span-1",
        "flex flex-col justify-start items-start gap-8",
      )}>
        { 
          sections['side'].map((item, key) => 
            SectionMaper(item.label, item.assert, key)
          )
        }
      </div>
      <div className={cn(
        "md:col-span-2",
        "flex flex-col justify-start items-start gap-8",
      )}>
        { 
          sections['main'].map((item, key) => 
            SectionMaper(item.label, item.assert, key)
          )
        }
      </div>
    </section>
  )
});

Content.displayName = 'Content';

function Header() {
  const basics = useAtomValue(basicsAtom);
  const profilePicture = useAtomValue(profilePictureAtom);

  return (
    <div
      className={cn(styles.block)}
    >
      <div 
        className={cn(
          "w-full",
          "flex flex-row justify-center sm:justify-start items-start gap-4 mb-1 flex-wrap",
        )}
      >
        { profilePicture && (
          <Image
            src={profilePicture}
            alt="Profile"
            className={cn(
              "shadow-md shadow-gray-300 dark:shadow-sm dark:shadow-primary-500 print:shadow-none",
              "bg-transparent w-24 h-24 rounded-lg relative z-20 object-cover",
              "select-none pointer-events-none"
            )}
          />
        )}
        <div
          className="flex flex-col justify-start items-start gap-0 mb-2"
        >
          { basics.name && (
            <h2 
              className={cn(
                "text-primary-600 dark:text-primary-500 text-5xl font-black text-wrap"
              )}
            >
              {basics.name}
            </h2>
          )}
          { basics.label && (
            <h4
              className="text-foreground text-md font-black text-wrap"
            >
              {basics.label}
            </h4>
          )}
        </div>
      </div>

      <div
        className="flex flex-row justify-start items-center gap-[0.25rem] flex-wrap *:mr-4"
      >
        { basics.email && (
          <p 
            className="flex flex-row justify-center items-center gap-2 min-w-fit"
          >
            <MailIcon className={styles.icon}/>
            {basics.email}
          </p>
        )}
        { basics.phone && (
          <p
            className="flex flex-row justify-center items-center gap-2"
          >
            <PhoneIcon className={styles.icon}/>
            {basics.phone}
          </p>
        )}
        { basics.url && (
          <span
            className="flex flex-row justify-center items-center gap-2"
          >
            <LinkIcon className={styles.icon}/>
            <Link url={basics.url} />
          </span>
        )}
      </div>

      { basics.location && (
        <Location />
      )}
      { basics.profiles && (
        <Profiles />
      )}
    </div>
  );
}

function Summary() {
  const basics = useAtomValue(basicsAtom);
  return (
    <div
      className={cn(styles.section)}
    >
      <SectionHeading>Summary</SectionHeading>
      { basics.summary && (
        <p>{basics.summary}</p>
      )}
    </div>
  )
}

function Work() {
  const work = useAtomValue(workAtom);
  return (
    <div
      className={cn(styles.section)}
    >
      <SectionHeading>Work Experience</SectionHeading>

      { work.map((item, index) => (
        <div
          key={index}
          className={styles.block}
        >
          <BlockHeading 
            title={item.position}
            subtitle={item.name}
            leading={<HeadingLapse {...item} />}
          />
          {item.summary && (
            <p
              className={cn(
                styles.paragraph,
              )}
            >
              {item.summary}
            </p>
          )}
          
          {item.highlights && (
            <List items={item.highlights} />
          )}
          {item.url && (
            <Link 
              icon={<LinkIcon className={styles.icon}/>} 
              url={item.url }
            />
          )}
        </div>
      ))}
    </div>
  )
}

function Volunteer() {
  const volunteer = useAtomValue(volunteerAtom);
  return (
    <div
      className={cn(styles.section)}
    >
      <SectionHeading>Volunteer</SectionHeading>
      {volunteer.map((item, index) => (
        <div
          key={index}
        >
          <BlockHeading 
            title={item.position}
            subtitle={item.organization}
            leading={<HeadingLapse {...item} />}
          />
          {item.summary && (
            <p>
              {item.summary}
            </p>
          )}
          {item.highlights && (
            <div>
              {item.highlights.map((item, index) => (
                <span key={index}>{item}</span>
              ))}
            </div>
          )}
          {item.url && (
            <Link
              icon={<LinkIcon className={styles.icon}/>} 
              url={item.url}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function Education() {
  const education = useAtomValue(educationAtom);
  return (
    <div
    className={cn(styles.section)}
    >
      <SectionHeading>Education</SectionHeading>
      {education.map((item, index) => (
        <div key={index} >
          <BlockHeading 
            title={[
              item.studyType,
              item.area,
            ].filter(item => item !== undefined).join(' / ')}
            subtitle={item.institution}
          />
          {(item.startDate || item.endDate) && (
            <Lapse {...item} />
          )}
          {item.score && (
            <p>
              Score: {item.score}
            </p>
          )}
          {item.url && (
            <Link 
              icon={<LinkIcon className={styles.icon}/>}
              url={item.url}
            />
          )}
          {item.courses && (
            <Tags items={item.courses} />
          )}
        </div>
      ))}
    </div>
  )
}

function Awards() {
  const awards = useAtomValue(awardsAtom);
  return (
    <div
      className={cn(styles.section)}
    >
      <SectionHeading>Awards</SectionHeading>
      {awards.map((item, index) => (
        <div key={index} >
          <BlockHeading 
            title={item.title}
            subtitle={item.awarder}
          />
          {item.date && (
            <DateElement 
              date={item.date}
            />
          )}
          {item.summary && (
            <p>
              {item.summary}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

function Certificates() {
  const certificates = useAtomValue(certificatesAtom);
  return (
    <div
      className={cn(styles.section)}
    >
      <SectionHeading>Certificates</SectionHeading>
      {certificates.map((item, index) => (
        <div 
          className="w-full overflow-x-hidden"
          key={index}         
        >
          <BlockHeading 
            title={item.name}
            subtitle={item.issuer}
          />
          {item.date && (
            <DateElement
              date={item.date} 
            />
          )}

          {item.url && (
            <Link 
              icon={<LinkIcon className={styles.icon}/>}
              url={item.url}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function Publications() {
  const publications = useAtomValue(publicationsAtom);
  return (
    <div
      className={cn(styles.section)}
    >
      <SectionHeading>Publications</SectionHeading>
      {publications.map((item, index) => (
        <div key={index} >
          <BlockHeading 
            title={item.name}
            subtitle={item.publisher}
          />
          {item.releaseDate && (
            <DateElement date={item.releaseDate} />
          )}
          {item.summary && (
            <p>
              {item.summary}
            </p>
          )}
          {item.url && (
            <Link 
              icon={<LinkIcon className={styles.icon}/>}
              url={item.url}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function Skills() {
  const skills = useAtomValue(skillsAtom);
  return (
    <div
      className={cn(styles.section)}
    >
      <SectionHeading>Skills</SectionHeading>
      {skills.map((item, index) => (
        <div key={index} >
          <BlockHeading 
            title={item.name}
            titleClassName={styles.blockSubtitle}
          />
          {item.level && (
            <Rating level={Number(item.level) as Level} />
          )}
          {item.keywords && (
            <Tags items={item.keywords} />
          )}
        </div>
      ))}
    </div>
  )
}

function Languages() {
  const languages = useAtomValue(languagesAtom);
  return (
    <div
      className={cn(styles.section)}
    >
      <SectionHeading>Languages</SectionHeading>
      {languages.map((item, index) => (
        <div key={index} >
          <BlockHeading 
            title={item.language}
            titleClassName={styles.blockSubtitle}
          />
          {item.fluency && (
            <Rating level={Number(item.fluency) as Level} />
          )}
        </div>
      ))}
    </div>
  )
}

function Interests() {
  const interests = useAtomValue(interestsAtom);
  return (
    <div
      className={cn(styles.section)}
    >
      <SectionHeading>Interests</SectionHeading>
      {interests.map((item, index) => (
        <div key={index} >
          <BlockHeading 
            title={item.name}
            titleClassName={styles.blockSubtitle}
          />
          {item.keywords && (
            <Tags items={item.keywords} />
          )}
        </div>
      ))}
    </div>
  )
}

function References() {
  const references = useAtomValue(referencesAtom);
  return (
    <div
      className={cn(styles.section)}
    >
      <SectionHeading>References</SectionHeading>
      {references.map((item, index) => (
        <div key={index} >
          <BlockHeading 
            title={item.name}
          />
          {item.reference && (
            <BlockQuote content={item.reference}/>
          )}
        </div>
      ))}
    </div>
  )
}

function Projects() {
  const projects = useAtomValue(projectsAtom);
  return (
    <div
      className={cn(styles.section)}
    >
      <SectionHeading>Projects</SectionHeading>
      {projects.map((item, index) => (
        <div key={index} >
          <BlockHeading 
            title={item.name}
            subtitle={(item.startDate || item.endDate) && (
              <Lapse {...item} className="text-sm text-gray-700 dark:text-gray-300" />
            )}
          />

          {item.description && (
            <p className={styles.paragraph}>
              {item.description}
            </p>
          )}
          {item.highlights && (
            <List items={item.highlights} />
          )}
          {item.url && (
            <Link 
              icon={<LinkIcon className={styles.icon}/>}
              url={item.url}
            />
          )}
        </div>
      ))}
    </div>
  )
}

/******************************************************************************
 * Util Secondary Components
 *****************************************************************************/

function Profiles() {
  // Social networks and other profiles
  const profiles = useAtomValue(profilesAtom);
  return (
    <div
      className="flex flex-row justify-start items-center"
    >
      {
        profiles.map((profile, index) => (
          <Link
            className="mr-4"
            url={profile.url || ''}
            label={profile.username}
            icon={
              <IconFromURL 
                className={styles.icon}
                url={profile.url}  
              />
            }
            key={index}
          />
        ))
      }
    </div>
  )
}

function Location() {
  const location = useAtomValue(locationAtom);
  return (
    <p className="flex flex-row justify-start items-start gap-2">
      <MapPinIcon className={styles.icon} />
      {[location.city, location.region, location.city].join(', ')}
    </p>
  ) 
}

interface LinkProps {
  url: string;
  label?: string;
  icon?: ReactNode;
  className?: string;
}

function Link(props: LinkProps) {
  return (
    <span
      className={cn(
        "w-full max-w-full overflow-x-hidden",
        "flex flex-row justify-start items-center gap-2",
        "hover:text-primary-600 hover:dark:text-primary-500 hover:underline",
        props.className,
      )}
    >
      {props.icon}
      <a
        href={props.url}
        target="_blank"
        rel="noreferrer noopener nofollow"
        className={cn(
          "w-full text-ellipsis",
        )}
      >
        {props.label || props.url}
      </a>
    </span>

  )
}

interface HeadingLapseProps {
  startDate?: string;
  endDate?: string;
  className?: string;
}

//text-primary-600 dark:text-primary-500/75
function HeadingLapse(props: HeadingLapseProps) {
  return (
    <div
      className={cn(
        "w-fit px-2",
        "border-solid border-[1px] border-primary-600 dark:border-primary-500/75 rounded-sm",
        "flex flex-col justify-start items-start",
      )}
    >
      <span className="text-sm font-semibold text-foreground">
        {props.startDate && formatDate(props.startDate, 'MMM YYYY')} 
      </span>
      <span className="text-sm font-semibold text-foreground">
        {props.endDate ? formatDate(props.endDate, 'MMM YYYY') : 'Present'}
      </span>
    </div>
  )
}

interface LapseProps {
  startDate?: string;
  endDate?: string;
  className?: string;
}

function Lapse({
  startDate=undefined,
  endDate=undefined,
  className='',
}: LapseProps) {
  return (
    <div
      className={cn(
        "w-fit",
        "flex flex-row justify-start items-start",
        "text-gray-800 dark:text-foreground",
        className,
      )}
    >
      <span className="text-md">
        {startDate && formatDate(startDate, 'MMM YYYY')} 
      </span>
      <span className="text-md">&nbsp;-&nbsp;</span>
      <span className="text-md">
        {endDate ? formatDate(endDate, 'MMM YYYY') : 'Present'}
      </span>
    </div>
  )
}

interface DatePros {
  date: string;
  format?: string;
  className?: string;
}

function DateElement({
  date,
  format='MMMM DD YYYY',
  className=''
}: DatePros) {
  return (
    <p
      className={cn(
        className,
      )}
    >
      {formatDate(date, format)} 
    </p>
  )
}

function SectionHeading (
  props: React.ComponentPropsWithoutRef<React.ElementType>
) {
  return (
    <h4
      className={styles.sectionHeading}
    >
      {props.children}
    </h4>
  );
}

interface BlockHeadingPros extends React.ComponentPropsWithoutRef<React.ElementType> {
  title?: ReactNode;
  titleClassName?: string;
  subtitle?: ReactNode;
  subtitleClassName?: string;
  leading?: ReactNode;
  lagging?: ReactNode;
}

function BlockHeading (
  {
    title=null,
    titleClassName='',
    subtitle=null,
    subtitleClassName='',
    leading=null,
    lagging=null,
  }: BlockHeadingPros
) {
  return (
    <div 
      className={cn(
        "w-full",
        "flex flex-row ustify-start items-center gap-2",
      )}
    >
      {leading}
      <div
        className="flex flex-col justify-start items-start gap-0"
      >
        <h4 
          className={cn(
            styles.blockTitle,
            titleClassName,
          )}
        >
          {title}
        </h4>
        <h5 
          className={cn(
            styles.blockSubtitle,
            subtitleClassName,
          )}
        >
          {subtitle}
        </h5>
      </div>
      {lagging}
    </div>
  )
}

interface ListPros extends React.ComponentPropsWithoutRef<React.ElementType> {
  items?: ReactNode[],
}

function List (
  {
    items=[],
  }: ListPros
) {
  return (
    <ul 
      className={cn(
        "space-y-1 list-disc list-inside"
      )}
    >
      {items.map((item, index) => (
        <li
          key={index}
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

interface TagsProps extends React.ComponentPropsWithoutRef<React.ElementType> {
  items?: ReactNode[],
}

function Tags (
  {
    items=[],
  }: TagsProps
) {
  return (
    <div 
      className={cn(
        "max-w-sm my-2",
        "flex flex-row justify-start items-start gap-2 flex-wrap"
      )}
    >
      {items.map((item, index) => (
        <span
          key={index}
          className={cn(
            "px-2 py-1",
            "border-solid border-primary-600 border-[1px] rounded-lg opacity-70",
            "text-xs text-nowrap",
          )}
        >
          {item}
        </span>
      ))}
    </div>
  )
}

interface RatingProps extends React.ComponentPropsWithoutRef<React.ElementType> {
  level: Level,
}

type Level = 1 | 2 | 3 | 4 | 5;

function Rating (
  {
    level,
  }: RatingProps
) {
  return (
    <div
      className={cn(
        "my-4",
        "flex flex-row justify-start items-start gap-2"
      )}
      style={{printColorAdjust: 'exact'}}
    >
      {
        Array.from({ length: 5 }, (_, i) => i + 1).map((item, index) => (
          <span
            key={index}
            className={cn(
              "border-solid border-primary border-[1px]",
              "w-3 h-3 rounded-full",
              "shadow-md shadow-gray-400 dark:shadow-none print:shadow-none",
              (item <= level ? 
                "bg-primary print:bg-primary" :
                "bg-primary/5 print:bg-transparent"
              ),
            )}
          />
        ))
      }
    </div>
  )
}

interface BlockQuoteProps extends React.ComponentPropsWithoutRef<React.ElementType> {
  content: string | ReactNode,
}

function BlockQuote (
  {
    content,
  }: BlockQuoteProps
) {
  return (
    <blockquote 
      className="relative px-4 py-2"
    >
      <QuoteIcon 
        className={cn(
          "absolute top-0 -start-0 size-8 z-0",
          "text-primary-600/25 dark:text-primary/10",
        )} 
      />

      <div className="relative z-10">
        <p className="text-foreground text-base">
          <em>
            {content}
          </em>
        </p>
      </div>
    </blockquote>
  )
}

/******************************************************************************
 * Utils
 *****************************************************************************/

function formatDate(date: string, format: string) {
  const source = moment(date);
  return source.isValid() ? source.format(format) : '';
} 