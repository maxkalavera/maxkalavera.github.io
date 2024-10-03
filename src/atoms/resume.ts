import { atom } from 'jotai';
import { JSONResumeMeta, JSONResumeType } from '@/types/jsonResume';

// type Defined<T> = Exclude<T, undefined>

// primitive atoms
export const resumeAtom = atom<JSONResumeType>({});
export const resumeMetaAtom = atom<JSONResumeMeta>({});

// derivate atoms
export const profilePictureAtom = atom((get) => get(resumeMetaAtom).profilePicture);

export const basicsAtom = atom((get) => get(resumeAtom).basics || {});
export const locationAtom = atom((get) => get(basicsAtom).location || {});
export const profilesAtom = atom((get) => get(basicsAtom).profiles || []);
export const workAtom = atom((get) => get(resumeAtom).work || []);
export const volunteerAtom = atom((get) => get(resumeAtom).volunteer || []);
export const educationAtom = atom((get) => get(resumeAtom).education || []);
export const awardsAtom = atom((get) => get(resumeAtom).awards || []);
export const certificatesAtom = atom((get) => get(resumeAtom).certificates || []);
export const publicationsAtom = atom((get) => get(resumeAtom).publications || []);
export const skillsAtom = atom((get) => get(resumeAtom).skills || []);
export const languagesAtom = atom((get) => get(resumeAtom).languages || []);
export const interestsAtom = atom((get) => get(resumeAtom).interests || []);
export const referencesAtom = atom((get) => get(resumeAtom).references || []);
export const projectsAtom = atom((get) => get(resumeAtom).projects || []);
