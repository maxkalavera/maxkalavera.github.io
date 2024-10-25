import path from "node:path";
import fs from "node:fs";
import { execSync } from "child_process";


const OUTPUT_DIR = path.resolve("./.latex/");
const INPUT_FILE = path.resolve("./content/resume/resume.tex");
const PUBLIC_DIR = path.resolve("./public/static/resume.pdf");

function main () {
  execSync(`pdflatex -output-directory=${OUTPUT_DIR} ${INPUT_FILE}`, {stdio: 'inherit'});
  // fs.copyFileSync(path.join(OUTPUT_DIR, "resume.pdf"), PUBLIC_DIR);
}

main();