import { z } from "zod"
import jsonResumeObject from './jsonResume.generated';
import { StaticImageData } from "next/image";

export const jsonResume = jsonResumeObject;

export type JSONResumeType = z.infer<typeof jsonResumeObject>;

export interface JSONResumeMeta {
  profilePicture?: StaticImageData;
}