import { ResumeWorkExperience } from '../../types';
import { isBold } from '../groupLinesIntoSection';
import { FeatureSet, ResumeSectionToLines, TextItem } from '../types';
import { hasNumber } from './extractProfile';
import { getBulletPointsFromLines, getDescriptionsLineIdx } from './lib/bulletPoints';
import { DATE_FEATURE_SETS, getHasText } from './lib/commonFeatures';
import { getTextWithHighestScoringSystem } from './lib/featureScoringSystem';
import { getSectionLinesByKeywords } from './lib/getSectionLines';
import { divideSectionIntoSubsections } from './lib/subSections';

const WORK_EXPERIENCE_KEYWORDS = ['work', 'experience', 'employment', 'job', 'history'];

const JOB_TITLES = [
  'Analyst',
  'Agent',
  'Administrator',
  'Architect',
  'Assistant',
  'Associate',
  'CTO',
  'Software Developer',
];

const hasJobTitle = (item: TextItem) =>
  JOB_TITLES.some((jobTitle) => item.text.split(/\s/).some((word) => word === jobTitle));

const hasMoreThan5Words = (item: TextItem) => item.text.split(/\s/).length > 5;

const JOB_TITLE_FEATURE_LIST: FeatureSet[] = [
  [hasJobTitle, 4],
  [hasNumber, -4],
  [hasMoreThan5Words, -2],
];

export const extractWorkExperiences = (sections: ResumeSectionToLines) => {
  const workExperiences: ResumeWorkExperience[] = [];
  const workExperiencesScores = [];

  const lines = getSectionLinesByKeywords(sections, WORK_EXPERIENCE_KEYWORDS);
  const subSections = divideSectionIntoSubsections(lines);

  for (const subSection of subSections) {
    const descriptionLineIdx = getDescriptionsLineIdx(subSection) ?? 2;

    const subsectionInfoTextItems = subSection.slice(0, descriptionLineIdx).flat();

    const [date, dateScores] = getTextWithHighestScoringSystem(
      subsectionInfoTextItems,
      DATE_FEATURE_SETS
    );

    const [jobTitle, jobTitleScores] = getTextWithHighestScoringSystem(
      subsectionInfoTextItems,
      JOB_TITLE_FEATURE_LIST
    );

    const COMPANY_FEATURE_SET: FeatureSet[] = [
      [isBold, 2],
      [getHasText(date), -4],
      [getHasText(jobTitle), -4],
    ];

    const [company, companyScores] = getTextWithHighestScoringSystem(
      subsectionInfoTextItems,
      COMPANY_FEATURE_SET,
      false
    );

    const subsectionDescriptionLines = subSection.slice(descriptionLineIdx);
    const descriptions = getBulletPointsFromLines(subsectionDescriptionLines);

    workExperiences.push({ company, jobTitle, date, descriptions });
    workExperiencesScores.push({ companyScores, jobTitleScores, dateScores });
  }

  return { workExperiences, workExperiencesScores };
};
