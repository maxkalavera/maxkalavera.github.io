/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import React, { Fragment } from "react";
import get from "lodash.get";
import resume from '@/assets/resume.json';
import resumePicture from '@/assets/images/resume.png'
import Image from "next/image";
import { LinkIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";

// This code is greatly based on:
// https://github.com/AmruthPillai/Reactive-Resume/blob/1bed63a4af591182295eca311e41dac34a283b8c/apps/artboard/src/templates/azurill.tsx#L563

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends React.ComponentPropsWithoutRef<React.ElementType>  {

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Resume = React.forwardRef<HTMLDivElement, Props>((
  {
    className,
    ...props
  }, 
  forwardedRef
) => {
  const sidebar: string[] = [
    "skills",
    "certifications",
    "interests",
    "languages",
    "awards",
    "volunteer",
    "publications",
  ];
  const main: string[] = [
    "profiles", 
    "summary", 
    "experience", 
    "education", 
    "projects", 
    "references",
  ];

  return (
    <section
      {...props}
      ref={forwardedRef}
      className={cn(
        className,
        "p-custom space-y-3"
      )}
    >
      <Header />
      
      {/* For large screens */}
      <div className="hidden md:grid grid-cols-3 gap-x-4">
        <div className="sidebar group space-y-4">
          {sidebar.map((section) => (
            <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
          ))}
        </div>

        <div className="main group col-span-2 space-y-4">
          {main.map((section) => (
            <Fragment key={section}>{mapSectionToComponent(section)}</Fragment>
          ))}
        </div>
      </div>

      {/* For mobile device's screens */}
      <div className="md:hidden main group">
          {[...main, ...sidebar].map((section) => (
            <Fragment key={section}>
              {mapSectionToComponent(section)}
            </Fragment>
          ))}
        </div>

    </section>
  )
})

Resume.displayName = 'Resume';

export default Resume

/****************************************************************************** 
* Secondary components
*******************************************************************************/

const isHTMLContentEmpty = (html: string) => {
  if (html === "<p></p>") return true;
  return html.trim().length === 0;
};

const Header = () => {
  const basics = resume.basics
  return (
    <div className="flex flex-col items-center justify-center space-y-2 pb-2 text-center">
      <Image
        src={resumePicture}
        alt="Profile"
        className={cn(
          "bg-transparent w-24 h-24 rounded-full relative z-20 object-cover",
          "select-none pointer-events-none"
        )}
      />

      <div>
        <div className="text-2xl font-bold">{basics.name}</div>
        <div className="text-base">{basics.headline}</div>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-0.5 text-sm">
        {basics.location && (
          <div className="flex items-center gap-x-1.5">
            <MapPinIcon className="w-4 h-4 text-primary"/>
            <div>{basics.location}</div>
          </div>
        )}
        {basics.phone && (
          <div className="flex items-center gap-x-1.5">
            <PhoneIcon className="w-4 h-4 text-primary"/>
            <a href={`tel:${basics.phone}`} target="_blank" rel="noreferrer">
              {basics.phone}
            </a>
          </div>
        )}
        {basics.email && (
          <div className="flex items-center gap-x-1.5">
            <MailIcon className="w-4 h-4 text-primary"/>
            <a href={`mailto:${basics.email}`} target="_blank" rel="noreferrer">
              {basics.email}
            </a>
          </div>
        )}
        <Link url={basics.url} />
        {basics.customFields.map((item: any) => (
          <div key={item.id} className="flex items-center gap-x-1.5">
            <i className={cn(`ph ph-bold ph-${item.icon}`, "text-primary")} />
            <a href={item.value} target="_blank" rel="noreferrer noopener nofollow">
                {item.name || item.value}
              </a>
          </div>
        ))}
      </div>
    </div>
  );
};

const Summary = () => {
  const section = resume.sections.summary;

  if (!section.visible || isHTMLContentEmpty(section.content)) return null;

  return (
    <section id={section.id}>
      <div className="mb-2 hidden font-bold text-primary group-[.main]:block">
        <h4>{section.name}</h4>
      </div>

      <div className="mb-2 hidden items-center gap-x-2 text-center font-bold text-primary group-[.sidebar]:flex">
        <div className="size-1.5 rounded-full border border-primary" />
        <h4>{section.name}</h4>
        <div className="size-1.5 rounded-full border border-primary" />
      </div>

      <main className={cn("relative space-y-2", "border-l border-primary pl-4")}>
        <div className="absolute left-[-4.5px] top-[8px] hidden size-[8px] rounded-full bg-primary group-[.main]:block" />

        <div
          dangerouslySetInnerHTML={{ __html: section.content }}
          className="wysiwyg"
          style={{ columns: section.columns }}
        />
      </main>
    </section>
  );
};

type RatingProps = { level: number };
const Rating = ({ level }: RatingProps) => (
  <div className="relative h-1 w-[128px] group-[.sidebar]:mx-auto">
    <div className="absolute inset-0 h-1 w-[128px] rounded bg-primary opacity-25" />
    <div className="w-full inset-0 h-1 rounded bg-primar/30 me-2">
      <div 
        className="bg-primary h-1 rounded" 
        style={{
          width: `${((level / 5) * 100) | 0}%`
        }}
      />
    </div>
  </div>
);

type LinkProps = {
  url: { href: string, label?: string };
  icon?: React.ReactNode;
  iconOnRight?: boolean;
  label?: string;
  className?: string;
};

const Link = ({ url, icon, iconOnRight, label, className }: LinkProps) => {
  return (
    <div className="flex items-center gap-x-1.5">
      {!iconOnRight && (icon ?? <LinkIcon className="w-4 h-4 text-primary"/>)}
      <a
        href={url.href}
        target="_blank"
        rel="noreferrer noopener nofollow"
        className={cn("inline-block", className)}
      >
        {label ?? (url.label || url.href)}
      </a>
      {iconOnRight && (icon ?? <i className="ph ph-bold ph-link text-primary" />)}
    </div>
  );
};

type LinkedEntityProps = {
  name: string;
  url: URL;
  separateLinks: boolean;
  className?: string;
};

const LinkedEntity = ({ name, url, separateLinks, className }: LinkedEntityProps) => {
  return !separateLinks && url.href ? (
    <Link
      url={url}
      label={name}
      icon={<i className="ph ph-bold ph-globe text-primary" />}
      iconOnRight={true}
      className={className}
    />
  ) : (
    <div className={className}>{name}</div>
  );
};

type SectionProps = {
  section: any;
  children?: (item: any) => React.ReactNode;
  className?: string;
  urlKey?: any;
  levelKey?: any;
  summaryKey?: any;
  keywordsKey?: any;
};

const Section = ({
  section,
  children,
  className,
  urlKey,
  levelKey,
  summaryKey,
  keywordsKey,
}: SectionProps) => {
  if (!section.visible || section.items.length === 0) return null;

  return (
    <section id={section.id} className="grid">
      <div className="mb-2 hidden font-bold text-primary group-[.main]:block">
        <h4>{section.name}</h4>
      </div>

      <div className="mx-auto mb-2 hidden items-center gap-x-2 text-center font-bold text-primary group-[.sidebar]:flex">
        <div className="size-1.5 rounded-full border border-primary" />
        <h4>{section.name}</h4>
        <div className="size-1.5 rounded-full border border-primary" />
      </div>

      <div
        className="grid gap-x-6 gap-y-3 group-[.sidebar]:mx-auto group-[.sidebar]:text-center"
        style={{ gridTemplateColumns: `repeat(${section.columns}, 1fr)` }}
      >
        {section.items
          .filter((item: any) => item.visible)
          .map((item: any) => {
            const url = (urlKey && get(item, urlKey)) as URL | undefined;
            const level = (levelKey && get(item, levelKey, 0)) as number | undefined;
            const summary = (summaryKey && get(item, summaryKey, "")) as string | undefined;
            const keywords = (keywordsKey && get(item, keywordsKey, [])) as string[] | undefined;

            return (
              <div
                key={item.id}
                className={cn(
                  "relative space-y-2",
                  "border-primary group-[.main]:border-l group-[.main]:pl-4",
                  className,
                )}
              >
                <div>{children?.(item as any)}</div>

                {summary !== undefined && isHTMLContentEmpty(summary) && (
                  <div dangerouslySetInnerHTML={{ __html: summary }} className="wysiwyg" />
                )}

                {level !== undefined && level > 0 && <Rating level={level} />}

                {keywords !== undefined && keywords.length > 0 && (
                  <p className="text-sm">{keywords.join(", ")}</p>
                )}

                {url !== undefined && section.separateLinks && <Link url={url} />}

                <div className="absolute left-[-4.5px] top-px hidden size-[8px] rounded-full bg-primary group-[.main]:block" />
              </div>
            );
          })}
      </div>
    </section>
  );
};

const Profiles = () => {
  const section = resume.sections.profiles;
  const fontSize = resume.metadata.typography.font.size

  return (
    <Section section={section}>
      {(item) => (
        <div>
          {item.url?.href ? (
            <Link
              url={item.url}
              label={item.username}
              icon={
                <Image
                  className="ph"
                  width={fontSize}
                  height={fontSize}
                  alt={item.network}
                  src={`https://cdn.simpleicons.org/${item.icon}`}
                />
              }
            />
          ) : (
            <p>{item.username}</p>
          )}
          {!item.icon && <p className="text-sm">{item.network}</p>}
        </div>
      )}
    </Section>
  );
};

const Experience = () => {
  const section = resume.sections.experience;

  return (
    <Section section={section} urlKey="url" summaryKey="summary">
      {(item: any) => (
        <div>
          <LinkedEntity
            name={item.company}
            url={item.url}
            separateLinks={section.separateLinks}
            className="font-bold"
          />
          <div>{item.position}</div>
          <div>{item.location}</div>
          <div className="font-bold">{item.date}</div>
        </div>
      )}
    </Section>
  );
};

const Education = () => {
  const section = resume.sections.education;

  return (
    <Section section={section} urlKey="url" summaryKey="summary">
      {(item: any) => (
        <div>
          <LinkedEntity
            name={item.institution}
            url={item.url}
            separateLinks={section.separateLinks}
            className="font-bold"
          />
          <div>{item.area}</div>
          <div>{item.score}</div>
          <div>{item.studyType}</div>
          <div className="font-bold">{item.date}</div>
        </div>
      )}
    </Section>
  );
};

const Awards = () => {
  const section = resume.sections.awards;

  return (
    <Section section={section} urlKey="url" summaryKey="summary">
      {(item: any) => (
        <div>
          <div className="font-bold">{item.title}</div>
          <LinkedEntity name={item.awarder} url={item.url} separateLinks={section.separateLinks} />
          <div className="font-bold">{item.date}</div>
        </div>
      )}
    </Section>
  );
};

const Certifications = () => {
  const section = resume.sections.certifications;

  return (
    <Section section={section} urlKey="url" summaryKey="summary">
      {(item: any) => (
        <div>
          <div className="font-bold">{item.name}</div>
          <LinkedEntity name={item.issuer} url={item.url} separateLinks={section.separateLinks} />
          <div className="font-bold">{item.date}</div>
        </div>
      )}
    </Section>
  );
};

const Skills = () => {
  const section = resume.sections.skills;

  return (
    <Section section={section} levelKey="level" keywordsKey="keywords">
      {(item: any) => (
        <div>
          <div className="font-bold">{item.name}</div>
          <div>{item.description}</div>
        </div>
      )}
    </Section>
  );
};

const Interests = () => {
  const section = resume.sections.interests;

  return (
    <Section section={section} keywordsKey="keywords" className="space-y-0.5">
      {(item: any) => <div className="font-bold">{item.name}</div>}
    </Section>
  );
};

const Publications = () => {
  const section = resume.sections.publications;

  return (
    <Section section={section} urlKey="url" summaryKey="summary">
      {(item: any) => (
        <div>
          <LinkedEntity
            name={item.name}
            url={item.url}
            separateLinks={section.separateLinks}
            className="font-bold"
          />
          <div>{item.publisher}</div>
          <div className="font-bold">{item.date}</div>
        </div>
      )}
    </Section>
  );
};

const Volunteer = () => {
  const section = resume.sections.volunteer;

  return (
    <Section section={section} urlKey="url" summaryKey="summary">
      {(item: any) => (
        <div>
          <LinkedEntity
            name={item.organization}
            url={item.url}
            separateLinks={section.separateLinks}
            className="font-bold"
          />
          <div>{item.position}</div>
          <div>{item.location}</div>
          <div className="font-bold">{item.date}</div>
        </div>
      )}
    </Section>
  );
};

const Languages = () => {
  const section = resume.sections.languages;

  return (
    <Section section={section} levelKey="level">
      {(item: any) => (
        <div>
          <div className="font-bold">{item.name}</div>
          <div>{item.description}</div>
        </div>
      )}
    </Section>
  );
};

const Projects = () => {
  const section = resume.sections.projects;

  return (
    <Section section={section} urlKey="url" summaryKey="summary" keywordsKey="keywords">
      {(item: any) => (
        <div>
          <div>
            <LinkedEntity
              name={item.name}
              url={item.url}
              separateLinks={section.separateLinks}
              className="font-bold"
            />
            <div>{item.description}</div>

            <div className="font-bold">{item.date}</div>
          </div>
        </div>
      )}
    </Section>
  );
};

const References = () => {
  const section = resume.sections.references;

  return (
    <Section section={section} urlKey="url" summaryKey="summary">
      {(item: any) => (
        <div>
          <LinkedEntity
            name={item.name}
            url={item.url}
            separateLinks={section.separateLinks}
            className="font-bold"
          />
          <div>{item.description}</div>
        </div>
      )}
    </Section>
  );
};

const Custom = ({ id }: { id: string }) => {
  const section = resume.sections.custom || ([] as any)[id];

  return (
    <Section
      section={section}
      urlKey="url"
      summaryKey="summary"
      keywordsKey="keywords"
    >
      {(item: any) => (
        <div>
          <div>
            <LinkedEntity
              name={item.name}
              url={item.url}
              separateLinks={section.separateLinks}
              className="font-bold"
            />
            <div>{item.description}</div>

            <div className="font-bold">{item.date}</div>
            <div>{item.location}</div>
          </div>
        </div>
      )}
    </Section>
  );
};

const mapSectionToComponent = (section: string) => {
  switch (section) {
    case "profiles": {
      return <Profiles />;
    }
    case "summary": {
      return <Summary />;
    }
    case "experience": {
      return <Experience />;
    }
    case "education": {
      return <Education />;
    }
    case "awards": {
      return <Awards />;
    }
    case "certifications": {
      return <Certifications />;
    }
    case "skills": {
      return <Skills />;
    }
    case "interests": {
      return <Interests />;
    }
    case "publications": {
      return <Publications />;
    }
    case "volunteer": {
      return <Volunteer />;
    }
    case "languages": {
      return <Languages />;
    }
    case "projects": {
      return <Projects />;
    }
    case "references": {
      return <References />;
    }
    default: {
      if (section.startsWith("custom.")) return <Custom id={section.split(".")[1]} />;

      return null;
    }
  }
};