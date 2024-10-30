import path from "node:path";
import fs from "node:fs";
import { execSync } from "child_process";
import Handlebars from "handlebars";
import moment from 'moment';

const COMPILING_DIR = path.resolve("./.latex/");
const LATEX_TEMPLATE_FILE = path.resolve("./content/resume/latex/resume.tex");
//const JSON_RESUME_FILE = path.resolve("./content/resume/resume.json");
const JSON_RESUME_FILE = path.resolve("./content/resume/dummy-resume.json");
//const PUBLIC_DIR = path.resolve("./public/static/resume.pdf");

/*
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
*/

function formatDate (date, format) {
  const source = moment(date);
  return source.isValid() ? source.format(format) : '';
} 

function formatHeader (
  {
    title,
    subtitle,
    startDate,
    endDate,
  }={
    title, 
    subtitle: undefined,
    startDate: undefined,
    endDate: undefined
  }
) {
  if (title && subtitle && (startDate || endDate)) {
    return `{
      \\setlength{\\tabcolsep}{0pt}
      \\begin{supertabular}{l@{\\hspace{3.5mm}} l}
        \\bfseries{${startDate || ''}}&\\headertitle{${title}}\\\\
        \\bfseries{${endDate || ''}}&\\headersubtitle{${subtitle}}\\\\
      \\end{supertabular}
    }\\par`;
  } else if (title && !subtitle && (startDate || endDate)) {
    return `{
      \\setlength{\\tabcolsep}{0pt}
      \\begin{supertabular}{l@{\\hspace{3.5mm}} l}
        \\bfseries{${startDate || ''}}&\\\\
        \\bfseries{${endDate || ''}}&\\headertitle{${title}}\\\\
      \\end{supertabular}
    }\\par`; // 
  } else if (title && subtitle && !(startDate || endDate)) {
    return `{
      \\setlength{\\tabcolsep}{0pt}
      \\begin{supertabular}{l@{\\hspace{3.5mm}}}
        \\headertitle{${title}}\\\\
        \\headersubtitle{${subtitle}}\\\\
      \\end{supertabular}
    }\\par`;
  } else {
    return `\\headertitle{${title}} \\par`;
  }
}

function formatReference (name, reference) {
  return `\\headertitle{${name}}\\\\${reference}`;
}

function formatEnumerate (items) {
  if (Array.isArray(items)) {
    return `\\begin{inparaenum}${ items.map(item => `\\item ${item}`) }\\end{inparaenum}`;
  }
  return null;
}

function formatLink (link) {
  return `\\link{${link || ''}}{${link || ''}}`;
}

function prepareData (data) {
  const name = data.basics.name.trim().replace(/\s+/g,' ');
  const location = data.basics.location;
  return {
    ...data,
    basics: {
      ...data.basics,
      firstName: name.split(' ')[0].toUpperCase(),
      lastName: name.split(' ').slice(1).join(' ').toUpperCase(),
      locationSummary: [location.city, location.countryCode].filter((item) => item !== null).join(', '),
    },
    work: data.work.map(item => ({
      ...item,
      header: formatHeader({
        title: item.position,
        subtitle: item.name,
        startDate: formatDate(item.startDate, 'MMM YYYY'),
        endDate: formatDate(item.endDate, 'MMM YYYY'),
      }),
      formatedHighlights: formatEnumerate(item.highlights),
      formatedLink: formatLink(item.url),
    })),
    education: data.education.map(item => ({
      ...item,
      header: formatHeader({
        title: [item.studyType, item.area].join(' / '),
        subtitle: item.institution,
        startDate: formatDate(item.startDate, 'MMM YYYY'),
        endDate: formatDate(item.endDate, 'MMM YYYY'),
      }),
      formatedCourses: formatEnumerate(item.courses),
      formatedLink: formatLink(item.url),
    })),
    projects: data.projects.map(item => ({
      ...item,
      header: formatHeader({
        title: item.name,
        subtitle: (item.startDate || item.endDate) ? `${formatDate(item.startDate, 'MMM YYYY')} - ${formatDate(item.endDate, 'MMM YYYY')}` : undefined,
      }),
      formatedHighlights: formatEnumerate(item.highlights),
      formatedLink: formatLink(item.url),
    })),
    references: data.references.map(item => ({
      ...item,
      formatedReference: formatReference(item.name, item.reference)
    })),
    volunteer: data.volunteer.map(item => ({
      ...item,
      startDate: formatDate(item.startDate, 'MMM YYYY'),
      endDate: formatDate(item.endDate, 'MMM YYYY'),
    })),
    awards: data.awards.map(item => ({
      ...item,
      date: formatDate(item.date, 'MMMM DD YYYY'),
    })),
    certificates: data.certificates.map(item => ({
      ...item,
      date: formatDate(item.date, 'MMMM DD YYYY'),
    })),
    publications: data.publications.map(item => ({
      ...item,
      date: formatDate(item.date, 'MMMM DD YYYY'),
    })),
  }
}

function main () {
  const jsonResume = JSON.parse(fs.readFileSync(JSON_RESUME_FILE, 'utf8'));
  const latexTemplate = fs.readFileSync(LATEX_TEMPLATE_FILE, 'utf8');

  const compiledTemplate = Handlebars.compile(
    latexTemplate, { noEscape: true }
  );
  const templateData = prepareData(jsonResume);
  console.log('Input data:\n', templateData);
  const latexContent = compiledTemplate(templateData);

  if (!fs.existsSync(COMPILING_DIR)) {
    fs.mkdirSync(COMPILING_DIR, { recursive: true });
  }
  fs.writeFileSync(path.join(COMPILING_DIR, 'resume.tex'), latexContent);
  execSync(`xelatex -output-directory=${COMPILING_DIR} ${path.join(COMPILING_DIR, 'resume.tex')}`, {stdio: 'inherit'});

  // fs.copyFileSync(path.join(OUTPUT_DIR, "resume.pdf"), PUBLIC_DIR);
}

main();