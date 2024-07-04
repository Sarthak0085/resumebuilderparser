import { ResumeEducation } from '../../types';
import { hasLetter } from '../groupLinesIntoSection';
import { FeatureSet, ResumeSectionToLines, TextItem } from '../types';
import { hasComma, hasNumber } from './extractProfile';
import { getBulletPointsFromLines, getDescriptionsLineIdx } from './lib/bulletPoints';
import { DATE_FEATURE_SETS } from './lib/commonFeatures';
import { getTextWithHighestScoringSystem } from './lib/featureScoringSystem';
import { getSectionLinesByKeywords } from './lib/getSectionLines';
import { divideSectionIntoSubsections } from './lib/subSections';

const SCHOOLS = ['College', 'University', 'Institute', 'School', 'Academy'];
const hasSchool = (item: TextItem) => SCHOOLS.some((school) => item.text.includes(school));

const DEGREES = ['Bachelor', 'Master', 'PhD', 'Ph.'];
const hasDegree = (item: TextItem) =>
  DEGREES.some((degree) => item.text.includes(degree)) || /[ABM][A-Z\.]/.test(item.text);

const matchGPA = (item: TextItem) => item.text.match(/[0-4]\.\d{1,2}/);

const matchGrade = (item: TextItem) => {
  const grade = parseFloat(item.text);
  if (Number.isFinite(grade) && grade <= 110) {
    return [String(grade)] as RegExpMatchArray;
  }

  return null;
};

const SCHOOL_FEATURE_SETS: FeatureSet[] = [
  [hasSchool, 4],
  [hasDegree, -4],
  [hasNumber, -4],
];

const DEGREE_FEATURE_SETS: FeatureSet[] = [
  [hasDegree, 4],
  [hasSchool, -4],
  [hasNumber, -3],
];

const GPA_FEATURE_SETS: FeatureSet[] = [
  [matchGPA, 4, true],
  [matchGrade, 3, true],
  [hasComma, -3],
  [hasLetter, -4],
];

export const extractEducation = (sections: ResumeSectionToLines) => {
  const educations: ResumeEducation[] = [];
  const educationScores = [];

  const lines = getSectionLinesByKeywords(sections, ['education']);

  const subSections = divideSectionIntoSubsections(lines);

  for (const subSection of subSections) {
    const textItems = subSection.flat();
    const [school, schoolScores] = getTextWithHighestScoringSystem(textItems, SCHOOL_FEATURE_SETS);
    const [degree, degreeScores] = getTextWithHighestScoringSystem(textItems, DEGREE_FEATURE_SETS);
    const [gpa, gpaScores] = getTextWithHighestScoringSystem(textItems, GPA_FEATURE_SETS);
    const [date, dateScores] = getTextWithHighestScoringSystem(textItems, DATE_FEATURE_SETS);

    let descriptions: string[] = [];
    const descriptionLineIdx = getDescriptionsLineIdx(subSection);
    if (descriptionLineIdx !== undefined) {
      const descriptionLines = subSection.slice(descriptionLineIdx);
      descriptions = getBulletPointsFromLines(descriptionLines);
    }

    educations.push({ school, degree, gpa, date, descriptions });
    educationScores.push({ schoolScores, degreeScores, gpaScores, dateScores });
  }

  if (educations.length !== 0) {
    const courseLines = getSectionLinesByKeywords(sections, ['course']);
    if (courseLines.length !== 0) {
      educations[0].descriptions.push(
        'Courses: ' +
          courseLines
            .flat()
            .map((item) => item.text)
            .join(' ')
      );
    }
  }

  return {
    educations,
    educationScores,
  };
};
