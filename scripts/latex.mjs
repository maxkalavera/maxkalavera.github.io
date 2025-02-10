import path from "node:path";
import fs from "node:fs";
import { execSync } from "child_process";
import Handlebars from "handlebars";
import moment from 'moment';

const COMPILING_DIR = path.resolve("./.latex/");
const TEMPLATES_DIR = path.resolve("./content/resume/latex/");
const JSON_RESUME_FILE = path.resolve("./content/resume/resume.json");
//const JSON_RESUME_FILE = path.resolve("./content/resume/dummy-resume.json");
const PUBLIC_DIR = path.resolve("./public/static/");

/******************************************************************************
 * Latex blocks of code to take the data and format it for latex
 * Kind of what you would do in latex with \newcommand but from js.
 *****************************************************************************/

function formatIcon (name, width='1.0em') {
  return `\\includesvg[width=${width}]{${name}.svg}`;
}

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
    location.city, 
    location.region, 
    location.countryCode
  ].filter((item) => item !== null).join(', ');

  return (
    `\\begin{center}
      \\textbf {
        \\huge
        \\color{primary-950}\\centerline{ ${ firstName } }
        \\newline
        \\newline
        \\color{accent}${ lastName }
      }\\\\ \\bigskip
      \\textbf {
        \\color{primary-950}\\large ${ label }
      }\\\\ \\medskip

      \\begin{supertabular}{l}
        \\href {${ url }}{${formatIcon("link-solid")} ${ trim(url, 47) }} \\\\
        \\href {mailto:${ email }}{${formatIcon("envelope-solid")} ${ email }} \\\\
        ${formatIcon("earth-americas-solid")} ${ formatedLocation } \\\\
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

function formatSimpleHeader (
  {
    title,
    subtitle,
  }={
    title, 
    subtitle: undefined,
  }
) {
  let block = [];

  if (title) {
    block.push(`\\headertitle{${title}}`);
  }
  if (subtitle) {
    block.push(`\\headersubtitle{${subtitle}}`);
  }
  return block.join('\\\\\n');
}

function formatPeriod(
  {
    startDate,
    endDate,
  }={
    startDate: undefined,
    endDate: undefined
  }
) {
  return `${startDate || ''} - ${endDate || ''}`;
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

function formatLink (url, { label, maxSize }={ label: undefined, maxSize: 120 }) {
  let formatedLabel = trim(label || url, maxSize);
  return `\\href{${url}}{\\hphantom{}{\\textcolor{accent}{${formatIcon("link-solid-black")}} ${formatedLabel}}`;
}

function formatRatingWord (
  value, 
  dictionary={
    0: 'Inexperienced',
    1: 'Beginner',
    2: 'Skilled',
    3: 'Intermediate',
    4: 'Advanced',
    5: 'Expert',
  }
) {
  return dictionary[value] || "";
}

function formatRatingBar (value) {
  if (value > 0 && value <= 5) {
    return (
      '{\n' + 
      '\\setlength{\\tabcolsep}{1mm} \\color{accent-500}\\scriptsize\n' +
      '\\begin{tabular}[b]{l l l l l}\n' + 
      (
        Array(5).fill(null).map((_, index) => 
          index + 1 <= value ? formatIcon("circle-solid") :  formatIcon("circle-regular")
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
    configs: {
      setSVGPathMacro: "\\svgpath{{.latex/resources}}",
    },
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
      simpleHeader: formatSimpleHeader({
        title: item.position,
        subtitle: item.name,
      }),
      period: formatPeriod({
        startDate: formatDate(item.startDate, 'MMM YYYY'),
        endDate: formatDate(item.endDate, 'MMM YYYY'),
      }),
      title: item.position,
      subtitle: [
        item.name,
        formatPeriod({
          startDate: formatDate(item.startDate, 'MMM YYYY'),
          endDate: formatDate(item.endDate, 'MMM YYYY'),
        })
      ].join(" --- "),
      startDate: formatDate(item.startDate, 'MMM YYYY'),
      endDate: formatDate(item.endDate, 'MMM YYYY'),
      formatedSummary: formatMarkdown(item.summary),
      formatedHighlights: formatEnumerate(item.highlights),
      formatedLink: formatLink(item.url),
    })),
    education: (data.education || []).map(item => ({
      ...item,
      header: formatBlockHeader({
        title: [item.studyType, item.area].join(' --- '),
        subtitle: item.institution,
        startDate: formatDate(item.startDate, 'MMM YYYY'),
        endDate: formatDate(item.endDate, 'MMM YYYY'),
      }),
      period: formatPeriod({
        startDate: formatDate(item.startDate, 'MMM YYYY'),
        endDate: formatDate(item.endDate, 'MMM YYYY'),
      }),
      simpleHeader: formatSimpleHeader({
        title: [item.studyType, item.area].join(' --- '),
        subtitle: item.institution,
        startDate: formatDate(item.startDate, 'MMM YYYY'),
        endDate: formatDate(item.endDate, 'MMM YYYY'),
      }),
      title: [item.studyType, item.area].join(', '),
      subtitle: [
        item.institution,
        formatPeriod({
          startDate: formatDate(item.startDate, 'MMM YYYY'),
          endDate: formatDate(item.endDate, 'MMM YYYY'),
        })
      ].join(" --- "),
      startDate: formatDate(item.startDate, 'MMM YYYY'),
      endDate: formatDate(item.endDate, 'MMM YYYY'),
      formatedCourses: formatEnumerate(item.courses),
      formatedLink: formatLink(item.url),
    })),
    projects: (data.projects || []).map(item => ({
      ...item,
      header: formatBlockHeader({
        title: item.name,
        subtitle: (item.startDate || item.endDate) ? `${formatDate(item.startDate, 'MMM YYYY')} - ${formatDate(item.endDate, 'MMM YYYY')}` : undefined,
      }),
      simpleHeader: formatSimpleHeader({
        title: item.name,
        subtitle: (item.startDate || item.endDate) ? `${formatDate(item.startDate, 'MMM YYYY')} - ${formatDate(item.endDate, 'MMM YYYY')}` : undefined,
      }),
      title: item.name,
      subtitle: (item.startDate || item.endDate) ? `${formatDate(item.startDate, 'MMM YYYY')} - ${formatDate(item.endDate, 'MMM YYYY')}` : undefined,
      formatedDescription: formatMarkdown(item.description),
      formatedHighlights: formatEnumerate(item.highlights),
      formatedLink: formatLink(item.url),
    })),
    references: (data.references || []).map(item => ({
      ...item,
      formatedReference: formatReference(item.name, item.reference),
      title: item.name,
      referenceContent: formatMarkdown(item.reference),
    })),
    volunteer: (data.volunteer || []).map(item => ({
      ...item,
      header: formatBlockHeader({
        title: item.position,
        subtitle: item.organization,
        startDate: formatDate(item.startDate, 'MMM YYYY'),
        endDate: formatDate(item.endDate, 'MMM YYYY'),
      }),
      simpleHeader: formatSimpleHeader({
        title: item.position,
        subtitle: item.organization,
      }),
      period: formatPeriod({
        startDate: formatDate(item.startDate, 'MMM YYYY'),
        endDate: formatDate(item.endDate, 'MMM YYYY'),
      }),
      title: item.position,
      subtitle: [
        item.organization,
        formatPeriod({
          startDate: formatDate(item.startDate, 'MMM YYYY'),
          endDate: formatDate(item.endDate, 'MMM YYYY'),
        })
      ].join(" --- "),
      startDate: formatDate(item.startDate, 'MMM YYYY'),
      endDate: formatDate(item.endDate, 'MMM YYYY'),
      formatedSummary: formatMarkdown(item.summary),
      formatedHighlights: formatEnumerate(item.highlights),
    })),
    
    // Side column
    skills: (data.skills || []).map(item => ({
      ...item,
      header: formatBlockHeader({
        title: item.name,
      }),
      simpleHeader: formatSimpleHeader({
        title: item.name,
      }),
      title: item.name,
      formatedkeywords: formatEnumerate(item.keywords),
      formatedLevelBar: formatRatingBar(item.level),
      formatedLevelWord: formatRatingWord(item.level),
    })),
    certificates: (data.certificates || []).map(item => ({
      ...item,
      header: formatBlockHeader({
        title: item.name,
        subtitle: item.issuer,
      }),
      simpleHeader: formatSimpleHeader({
        title: item.name,
        subtitle: item.issuer,
      }),
      title: item.name,
      subtitle: [
        item.issuer,
        formatDate(item.date, 'MMM YYYY')
      ].join(' --- '),
      formatedDate: formatDate(item.date, 'MMM YYYY'),
      formatedLink: formatLink(item.url, { maxSize: 27 }),
    })),
    languages: (data.languages || []).map(item => ({
      ...item,
      header: formatBlockHeader({
        title: item.language,
      }),
      simpleHeader: formatSimpleHeader({
        title: item.language,
      }),
      title: item.language,
      formatedFluencyBar: formatRatingBar(item.fluency),
      formatedFluencyWord: formatRatingWord(item.fluency, {
        0: 'Inexperienced',
        1: 'Beginner',
        2: 'Skilled',
        3: 'Intermediate',
        4: 'Advanced',
        5: 'Native',
      }),
    })),
    publications: (data.publications || []).map(item => ({
      ...item,
      header: formatBlockHeader({
        title: item.name,
        subtitle: item.issuer,
      }),
      simpleHeader: formatSimpleHeader({
        title: item.name,
        subtitle: item.issuer,
      }),
      title: item.name,
      subtitle: item.issuer,
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
      simpleHeader: formatSimpleHeader({
        title: item.title,
        subtitle: item.awarder,
      }),
      title: item.title,
      subtitle: [
        item.awarder,
        formatDate(item.date, 'MMM YYYY')
      ].join(" --- "),
      formatedDate: formatDate(item.date, 'MMM YYYY'),
      formatedSummary: formatMarkdown(item.summary),
    })),
    interests: (data.interests || []).map(item => ({
      ...item,
      header: formatBlockHeader({
        title: item.name,
      }),
      simpleHeader: formatSimpleHeader({
        title: item.name,
      }),
      title: item.name,
      formatedkeywords: formatEnumerate(item.keywords),
    })),
  }
}

/******************************************************************************
 * Script takes the Json Resume content, the LaTeX template 
 * build the PDF document and copy it to the public folder of the website.
 *****************************************************************************/

function buildResume () {
  const jsonResume = JSON.parse(fs.readFileSync(JSON_RESUME_FILE, 'utf8'));
  const latexTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'resume.tex'), 'utf8');

  const compiledTemplate = Handlebars.compile(
    latexTemplate, { noEscape: true }
  );
  const templateData = prepareData(jsonResume);
  console.log('Input data:\n', templateData);
  const latexContent = compiledTemplate(templateData);

  if (!fs.existsSync(COMPILING_DIR)) {
    fs.mkdirSync(COMPILING_DIR, { recursive: true });
  }

  // Copy resources folder
  copyFolderRecursiveSync(
    path.join(TEMPLATES_DIR, 'resources/'),
    path.join(COMPILING_DIR, 'resources/')
  );
  fs.writeFileSync(path.join(COMPILING_DIR, 'resume.tex'), latexContent);
  execSync(`xelatex --shell-escape -output-directory=${COMPILING_DIR} ${path.join(COMPILING_DIR, 'resume.tex')}`, {stdio: 'inherit'});
  fs.copyFileSync(path.join(COMPILING_DIR, "resume.pdf"), path.join(PUBLIC_DIR, "resume/resume.pdf"));
}

function buildCoverLetter () {
  const latexTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'cover.tex'), 'utf8');
  const compiledTemplate = Handlebars.compile(
    latexTemplate, { noEscape: true }
  );

  const jsonResume = JSON.parse(fs.readFileSync(JSON_RESUME_FILE, 'utf8'));
  const name = jsonResume.basics.name.trim().replace(/\s+/g,' ');
  const location = jsonResume.basics.location;
  const latexContent = compiledTemplate({
    firstName: name.split(' ')[0].toUpperCase(),
    lastName: name.split(' ').slice(1).join(' ').toUpperCase(),
    url: jsonResume.basics.url,
    email: jsonResume.basics.email,
    formatedLocation: [location.city, location.countryCode].filter((item) => item !== null).join(', '),
  });
  
  if (!fs.existsSync(COMPILING_DIR)) {
    fs.mkdirSync(COMPILING_DIR, { recursive: true });
  }

  // Copy resources folder
  copyFolderRecursiveSync(
    path.join(TEMPLATES_DIR, 'resources/'),
    path.join(COMPILING_DIR, 'resources/')
  );
  fs.writeFileSync(path.join(COMPILING_DIR, 'cover.tex'), latexContent);
  execSync(`xelatex --shell-escape -output-directory=${COMPILING_DIR} ${path.join(COMPILING_DIR, 'cover.tex')}`, {stdio: 'inherit'});
  fs.copyFileSync(path.join(COMPILING_DIR, "cover.pdf"), path.join(PUBLIC_DIR, "resume/cover.pdf"));
}

function main () {
  buildResume();
  buildCoverLetter();
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

function copyFolderRecursiveSync(source, target) {
  // Check if the source is a directory
  if (fs.lstatSync(source).isDirectory()) {
      // Create the target directory if it doesn't exist
      if (!fs.existsSync(target)) {
          fs.mkdirSync(target);
      }

      // Read the contents of the source directory
      const files = fs.readdirSync(source);

      // Iterate through each file/directory
      files.forEach(file => {
          const sourcePath = path.join(source, file);
          const targetPath = path.join(target, file);

          // Recursively copy the contents
          copyFolderRecursiveSync(sourcePath, targetPath);
      });
  } else {
      // If it's a file, copy it directly
      fs.copyFileSync(source, target);
  }
}