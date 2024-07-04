import { Resume } from '../../types';
import { ResumeSectionToLines } from '../types';
import { extractEducation } from './extractEducations';
import { extractProfile } from './extractProfile';
import { extractProject } from './extractProject';
import { extractSkills } from './extractSkills';
import { extractWorkExperiences } from './extractWorkExperiences';

export const extractResumeFromSections = (sections: ResumeSectionToLines): Resume => {
  const { profile } = extractProfile(sections);
  const { educations } = extractEducation(sections);
  const { workExperiences } = extractWorkExperiences(sections);
  const { projects } = extractProject(sections);
  const { skills } = extractSkills(sections);

  return {
    profile,
    educations,
    workExperiences,
    projects,
    skills,
    custom: {
      descriptions: [],
    },
  };
};
