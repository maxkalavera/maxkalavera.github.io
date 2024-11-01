import path from "node:path";
import fs from "node:fs";
import { execSync } from "child_process";
import Handlebars from "handlebars";
import moment from 'moment';

const COMPILING_DIR = path.resolve("./.latex/");
const LATEX_TEMPLATE_FILE = path.resolve("./content/resume/latex/resume.tex");
const JSON_RESUME_FILE = path.resolve("./content/resume/resume.json");
const PUBLIC_DIR = path.resolve("./public/static/resume.pdf");

/******************************************************************************
 * Latex blocks of code to take the data and format it for latex
 * Kind of what you would do in latex with \newcommand but from js.
 *****************************************************************************/

function formatDate (date, format) {
  const source = moment(date);
  return source.isValid() ? source.format(format) : '';
} 

function formatHeaderSection (data) {
  const name = data.basics.name.trim().replace(/\s+/g,' ');
  const location = data.basics.location;
  const firstName = name.split(' ')[0].toUpperCase();
  const lastName = name.split(' ').slice(1).join(' ').toUpperCase();
  const label = data.basics.label;
  const url = data.basics.url;
  const email = data.basics.email;
  const formatedLocation = [
    location.city, location.countryCode].filter((item) => item !== null).join(', ');

  return (
    `\\begin{center}
      \\textbf {
        \\Huge
        \\color{primary-950}${ firstName }
        \\color{accent}${ lastName }
      }\\\\ \\smallskip
      \\textbf {
        \\color{primary-950}\\large ${ label }
      }\\\\ \\smallskip

      \\begin{supertabular}{l}
        \\href {${ url }}{\\faIcon{link} ${ trim(url, 47) }} \\\\
        \\href { mailto:{{ basics.email }} }{\\faIcon{envelope} ${ email }} \\\\
        \\faIcon{globe-americas} ${ formatedLocation } \\\\
      \\end{supertabular}
    \\end{center}`
  )
}

function formatBlockHeader (
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
    }`;
  } else if (title && !subtitle && (startDate || endDate)) {
    return `{
      \\setlength{\\tabcolsep}{0pt}
      \\begin{supertabular}{l@{\\hspace{3.5mm}} l}
        \\bfseries{${startDate || ''}}&\\\\
        \\bfseries{${endDate || ''}}&\\headertitle{${title}}\\\\
      \\end{supertabular}
    }`; 
  } else if (title && subtitle && !(startDate || endDate)) {
    return `{
      \\setlength{\\tabcolsep}{0pt}
      \\begin{supertabular}{l@{\\hspace{3.5mm}}}
        \\headertitle{${title}}\\\\
        \\headersubtitle{${subtitle}}\\\\
      \\end{supertabular}
    }`;
  } else {
    return `\\headertitle{${title}}`;
  }
}

function formatMarkdown(content) {
  if (content) {
    return `\\begin{markdown}\n${content.replace(/<br *\/?>/g, '\\\n')}\n\\end{markdown}`;
  }
  return null;
}

function formatReference (name, reference) {
  return `\\headertitle{${name}}\\\\${formatMarkdown(reference)}`;
}

function formatEnumerate (items) {
  if (Array.isArray(items)) {
    return `\\begin{inparaenum}[]\n${items.map(item => (`\\item ${item}`)).join(',\n')}\\end{inparaenum}\n`;
  }
  return null;
}

function formatLink (url, { label, maxSize }={ label: undefined, maxSize: 67 }) {
  let formatedLabel = trim(label || url, maxSize);
  return `\\href{${url}}{\\hphantom{}{\\footnotesize\\textcolor{accent}{\\faIcon{link}}} ${formatedLabel}}`;
}

function formatRatingBar (value) {
  if (value > 0 && value <= 5) {
    return (
      '{\n' + 
      '\\setlength{\\tabcolsep}{1mm} \\color{accent-500}\\scriptsize\n' +
      '\\begin{tabular}{l l l l l}\n' + 
      (
        Array(5).fill(null).map((_, index) => 
          index + 1 <= value ? `\\faIcon{circle}` :  `\\faIcon[regular]{circle}`
        ).join(' & ')
      ) +
      '\\\\[2mm] \\end{tabular} \n' +
      '}\n'
    );
  }
  return null;
}

/******************************************************************************
 * Takes the Raw data given to the handlebars.js template and format it to
 * create the custom elements for latex.
 *****************************************************************************/

function prepareData (data) {
  const name = data.basics.name.trim().replace(/\s+/g,' ');
  const location = data.basics.location;
  return {
    ...data,
    // Main column
    basics: {
      ...data.basics,
      firstName: name.split(' ')[0].toUpperCase(),
      lastName: name.split(' ').slice(1).join(' ').toUpperCase(),
      formatedSummary: formatMarkdown(data.basics.summary),
      locationSummary: [location.city, location.countryCode].filter((item) => item !== null).join(', '),
    },
    header: formatHeaderSection(data),
    work: (data.work || []).map(item => ({
      ...item,
      header: formatBlockHeader({
        title: item.position,
        subtitle: item.name,
        startDate: formatDate(item.startDate, 'MMM YYYY'),
        endDate: formatDate(item.endDate, 'MMM YYYY'),
      }),
      formatedSummary: formatMarkdown(item.summary),
      formatedHighlights: formatEnumerate(item.highlights),
      formatedLink: formatLink(item.url),
    })),
    education: (data.education || []).map(item => ({
      ...item,
      header: formatBlockHeader({
        title: [item.studyType, item.area].join(' / '),
        subtitle: item.institution,
        startDate: formatDate(item.startDate, 'MMM YYYY'),
        endDate: formatDate(item.endDate, 'MMM YYYY'),
      }),
      formatedCourses: formatEnumerate(item.courses),
      formatedLink: formatLink(item.url),
    })),
    projects: (data.projects || []).map(item => ({
      ...item,
      header: formatBlockHeader({
        title: item.name,
        subtitle: (item.startDate || item.endDate) ? `${formatDate(item.startDate, 'MMM YYYY')} - ${formatDate(item.endDate, 'MMM YYYY')}` : undefined,
      }),
      formatedDescription: formatMarkdown(item.description),
      formatedHighlights: formatEnumerate(item.highlights),
      formatedLink: formatLink(item.url),
    })),
    references: (data.references || []).map(item => ({
      ...item,
      formatedReference: formatReference(item.name, item.reference)
    })),
    volunteer: (data.volunteer || []).map(item => ({
      ...item,
      header: formatBlockHeader({
        title: item.position,
        subtitle: item.organization,
        startDate: formatDate(item.startDate, 'MMM YYYY'),
        endDate: formatDate(item.endDate, 'MMM YYYY'),
      }),
      formatedSummary: formatMarkdown(item.summary),
      formatedHighlights: formatEnumerate(item.highlights),
    })),
    
    // Side column
    skills: (data.skills || []).map(item => ({
      ...item,
      header: formatBlockHeader({
        title: item.name,
      }),
      formatedkeywords: formatEnumerate(item.keywords),
      formatedLevel: formatRatingBar(item.level),
    })),
    certificates: (data.certificates || []).map(item => ({
      ...item,
      header: formatBlockHeader({
        title: item.name,
        subtitle: item.issuer,
      }),
      formatedDate: formatDate(item.date, 'MMM YYYY'),
      formatedLink: formatLink(item.url, { maxSize: 27 }),
    })),
    languages: (data.languages || []).map(item => ({
      ...item,
      header: formatBlockHeader({
        title: item.language,
      }),
      formatedFluency: formatRatingBar(item.fluency),
    })),
    publications: (data.publications || []).map(item => ({
      ...item,
      header: formatBlockHeader({
        title: item.name,
        subtitle: item.issuer,
      }),
      frmatedReleaseDate: formatDate(item.releaseDate, 'MMMM DD YYYY'),
      formatedSummary: formatMarkdown(item.summary),
      formatedLink: formatLink(item.url),
    })),
    awards: (data.awards || []).map(item => ({
      ...item,
      header: formatBlockHeader({
        title: item.title,
        subtitle: item.awarder,
      }),
      formatedDate: formatDate(item.date, 'MMM YYYY'),
      formatedSummary: formatMarkdown(item.summary),
    })),
    interests: (data.interests || []).map(item => ({
      ...item,
      header: formatBlockHeader({
        title: item.name,
      }),
      formatedkeywords: formatEnumerate(item.keywords),
    })),
  }
}

/******************************************************************************
 * Script takes the Json Resume content, the LaTeX template 
 * build the PDF document and copy it to the public folder of the website.
 *****************************************************************************/

/*
function compileLatex () {
  // texlive/texlive
  execSync([
    'docker run -i --rm --name latex',
    '-v "$PWD":/usr/src/app:z',
    '-w /usr/src/app',
    'songritk/xelatex',
    'tlmgr update markdown'
    //`xelatex --shell-escape -output-directory=./.latex ./content/resume/latex/resume.tex`
  ].join(' '), {stdio: 'inherit'});
}
*/

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
  //compileLatex();
  execSync(`xelatex --shell-escape -output-directory=${COMPILING_DIR} ${path.join(COMPILING_DIR, 'resume.tex')}`, {stdio: 'inherit'});
  fs.copyFileSync(path.join(COMPILING_DIR, "resume.pdf"), PUBLIC_DIR);
}

main();

/******************************************************************************
 * Utils
 *****************************************************************************/

function trim (value, maxSize) {
  if (value.length > maxSize) {
    return `${value.slice(0, maxSize)}...`;
  }
  return value;
}