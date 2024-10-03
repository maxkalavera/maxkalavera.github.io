"use client"
import React, { ReactNode } from "react";
import { JSONResumeMeta, JSONResumeType } from "@/types/jsonResume";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { createStore, Provider, useAtomValue } from "jotai";
import { locationAtom, profilePictureAtom, profilesAtom, resumeAtom, basicsAtom, resumeMetaAtom, workAtom, volunteerAtom, educationAtom, awardsAtom, certificatesAtom, publicationsAtom, skillsAtom, languagesAtom, interestsAtom, referencesAtom, projectsAtom } from "@/atoms/resume";
import { LinkIcon } from "lucide-react";
import moment from 'moment';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
  resumeStore.set(resumeAtom, resume);
  resumeStore.set(resumeMetaAtom, meta);
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

const sections: { label: string, column?: string }[] = [
  { label: 'basics' },
  { label: 'work' },
  { label: 'volunteer' },
  { label: 'education' },
  { label: 'awards' },
  { label: 'certificates' },
  { label: 'publications' },
  { label: 'skills' },
  { label: 'languages' },
  { label: 'interests' },
  { label: 'references' },
  { label: 'projects' },
];

function sectionMaper (label: string, key: string | number) {
  const resume = useAtomValue(resumeAtom);
  return (resume[label] && {
    'basics': <Header key={key} />,
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
        "w-full space-y-4",
        "flex flex-col justify-start items-start"
      )}
    >
      {sections.map((item, key) => sectionMaper(item.label, key))}
    </section>
  )
});

Content.displayName = 'Content';

function Header() {
  const basics = useAtomValue(basicsAtom);
  const profilePicture = useAtomValue(profilePictureAtom);

  return (
    <div>
      { profilePicture && (
        <Image src={profilePicture} alt="Profile" />
      )}
      { basics.name && (
        <h2>{basics.name}</h2>
      )}
      { basics.label && (
        <p>{basics.label}</p>
      )}
      { basics.email && (
        <p>{basics.email}</p>
      )}
      { basics.phone && (
        <p>{basics.phone}</p>
      )}
      { basics.url && (
        <Link url={basics.url} />
      )}
      { basics.summary && (
        <p>{basics.summary}</p>
      )}
      { basics.location && (
        <Location />
      )}
      { basics.profiles && (
        <Profiles />
      )}
    </div>
  );
}

function Location() {
  const location = useAtomValue(locationAtom);
  return (
    <p>{[location.city, location.region, location.city].join(', ')}</p>
  ) 
}

function Profiles() {
  const profiles = useAtomValue(profilesAtom);
  return (
    <div
      className="flex flex-row justify-start items-center gap-4"
    >
      {
        profiles.map((profile, index) => (
          <Link 
            url={profile.url || ''}
            label={profile.username}
            icon={
              <LinkIcon className="w-4 h-4 text-foreground" />
            }
            key={index}
          />
        ))
      }
    </div>
  )
}

function Work() {
  const work = useAtomValue(workAtom);
  return (
    <div
      className="flex flex-col justify-start items-start gap-2"
    >
      { work.map((item, index) => (
        <div
          key={index}
        >
          {item.name && (
            <p 
              className="text-foreground text-md font-bold"
            >
              {item.name}
            </p>
          )}

          {item.position && (
            <p>
              {item.position}
            </p>
          )}
          {item.url && (
            <Link url={item.url }/>
          )}
          {(item.startDate || item.endDate) && (
            <Lapse {...item} />
          )}
          {item.summary && (
            <p>{item.summary}</p>
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
      className=""
    >
      {volunteer.map((item, index) => (
        <div
          key={index}
        >
          {item.organization && (
            <h4>
              {item.organization}
            </h4>
          )}
          {item.position && (
            <p>
              {item.position}
            </p>
          )}
          {item.url && (
            <Link url={item.url}/>
          )}
          {(item.startDate || item.endDate) && (
            <Lapse {...item} />
          )}
          {item.summary && (
            <p>
              {item.summary}
            </p>
          )}
          {item.highlights && (
            <div>
              {item.highlights.map((item, index) => (
                <span>{item}</span>
              ))}
            </div>
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
      className=""
    >
      {education.map((item, index) => (
        <div key={index} >
          {item.institution && (
            <h4>
              {item.institution}
            </h4>
          )}
          {item.url && (
            <Link url={item.url}/>
          )}
          {item.area && (
            <p>
              {item.area}
            </p>
          )}
          {item.studyType && (
            <p>
              {item.studyType}
            </p>
          )}
          {(item.startDate || item.endDate) && (
            <Lapse {...item} />
          )}
          {item.score && (
            <p>
              {item.score}
            </p>
          )}
          {item.courses && (
            <div>
              {item.courses.map((item, index) => (
                <span>{item}</span>
              ))}
            </div>
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
      className=""
    >
      {awards.map((item, index) => (
        <div key={index} >
          {item.title && (
            <h4>
              {item.title}
            </h4>
          )}
          {item.date && (
            <DateElement date={item.date} />
          )}
          {item.awarder && (
            <p>
              {item.awarder}
            </p>
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
      className=""
    >
      {certificates.map((item, index) => (
        <div key={index} >
          {item.name && (
            <h4>
              {item.name}
            </h4>
          )}
          {item.date && (
            <DateElement date={item.releaseDate} />
          )}
          {item.issuer && (
            <p>
              {item.issuer}
            </p>
          )}
          {item.url && (
            <Link url={item.url}/>
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
      className=""
    >
      {publications.map((item, index) => (
        <div key={index} >
          {item.name && (
            <h4>
              {item.name}
            </h4>
          )}
          {item.publisher && (
            <p>
              {item.publisher}
            </p>
          )}
          {item.releaseDate && (
            <DateElement date={item.releaseDate} />
          )}
          {item.url && (
            <Link url={item.url}/>
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

function Skills() {
  const skills = useAtomValue(skillsAtom);
  return (
    <div
      className=""
    >
      {skills.map((item, index) => (
        <div key={index} >
          {item.name && (
            <h4>
              {item.name}
            </h4>
          )}
          {item.level && (
            <p>
              {item.level}
            </p>
          )}
          {item.keywords && (
            <div>
              {item.keywords.map((item, index) => (
                <span>{item}</span>
              ))}
            </div>
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
      className=""
    >
      {languages.map((item, index) => (
        <div key={index} >
          {item.language && (
            <h4>
              {item.language}
            </h4>
          )}
          {item.fluency && (
            <p>
              {item.fluency}
            </p>
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
      className=""
    >
      {interests.map((item, index) => (
        <div key={index} >
          {item.name && (
            <h4>
              {item.name}
            </h4>
          )}
          {item.keywords && (
            <div>
              {item.keywords.map((item, index) => (
                <span>{item}</span>
              ))}
            </div>
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
      className=""
    >
      {references.map((item, index) => (
        <div key={index} >
          {item.name && (
            <h4>
              {item.name}
            </h4>
          )}
          {item.reference && (
            <p>
              {item.reference}
            </p>
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
      className=""
    >
      {projects.map((item, index) => (
        <div key={index} >
          {item.name && (
            <h4>
              {item.name}
            </h4>
          )}
          {(item.startDate || item.endDate) && (
            <Lapse {...item} />
          )}
          {item.description && (
            <p>
              {item.area}
            </p>
          )}
          {item.url && (
            <Link url={item.url}/>
          )}
          {item.highlights && (
            <div>
              {item.highlights.map((item, index) => (
                <span>{item}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/******************************************************************************
 * Util Secondary Components
 *****************************************************************************/

interface LinkProps {
  url: string;
  label?: string;
  icon?: ReactNode;
  className?: string;
}

function Link(props: LinkProps) {
  return (
    <a
      href={props.url}
      target="_blank"
      rel="noreferrer noopener nofollow"
      className={cn(
        props.className,
        "flex flex-row justify-start items-center gap-2"
      )}
    >
      {props.icon}
      {props.label || props.url}
    </a>
  )
}

interface LapseProps {
  startDate?: string;
  endDate?: string;
  className?: string;
}

function Lapse(props: LapseProps) {
  return (
    <p>
      {props.startDate && formatDate(props.startDate, 'MMM YYYY')} 
      &nbsp;-&nbsp; 
      {props.endDate ? formatDate(props.endDate, 'MMM YYYY') : 'Present'}
    </p>
  )
}

interface DatePros {
  date: string;
  className?: string;
}

function DateElement(props: DatePros) {
  return (
    <p>
      {formatDate(props.date, 'MMM YYYY')} 
    </p>
  )
}

/******************************************************************************
 * Utils
 *****************************************************************************/

function formatDate(date: string, format: string) {
  const source = moment(date);
  return source.isValid() ? source.format(format) : '';
} 