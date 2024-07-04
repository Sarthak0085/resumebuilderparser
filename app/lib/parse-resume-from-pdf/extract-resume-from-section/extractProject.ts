import { ResumeProject } from '../../types';
import { isBold } from '../groupLinesIntoSection';
import { FeatureSet, ResumeSectionToLines } from '../types';
import { getBulletPointsFromLines, getDescriptionsLineIdx } from './lib/bulletPoints';
import { DATE_FEATURE_SETS, getHasText } from './lib/commonFeatures';
import { getTextWithHighestScoringSystem } from './lib/featureScoringSystem';
import { getSectionLinesByKeywords } from './lib/getSectionLines';
import { divideSectionIntoSubsections } from './lib/subSections';

export const extractProject = (sections: ResumeSectionToLines) => {
  const projects: ResumeProject[] = [];
  const projectScores = [];
  const lines = getSectionLinesByKeywords(sections, ['project']);
  const subsections = divideSectionIntoSubsections(lines);

  for (const subsectionLines of subsections) {
    const descriptionLineIdx = getDescriptionsLineIdx(subsectionLines) ?? 1;

    const subsectionInfoTextItems = subsectionLines.slice(0, descriptionLineIdx).flat();

    const [date, dateScores] = getTextWithHighestScoringSystem(
      subsectionInfoTextItems,
      DATE_FEATURE_SETS
    );

    const PROJECT_FEATURE_SET: FeatureSet[] = [
      [isBold, 2],
      [getHasText(date), -4],
    ];

    const [project, projectScore] = getTextWithHighestScoringSystem(
      subsectionInfoTextItems,
      PROJECT_FEATURE_SET,
      false
    );

    const descriptionsLines = subsectionLines.slice(descriptionLineIdx);
    const descriptions = getBulletPointsFromLines(descriptionsLines);

    projects.push({ project, date, descriptions });
    projectScores.push({
      projectScore,
      dateScores,
    });
  }

  return { projects, projectScores };
};
