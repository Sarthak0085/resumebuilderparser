import { ResumeKey } from '../types';

export interface TextItem {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  font: string;
  hasEOL: string;
}

export type TextItems = TextItem[];

export type Line = TextItem[];
export type Lines = Line[];

export type SubSections = Lines[];

export type ResumeSectionToLines = { [sectionName in ResumeKey]?: Lines } & {
  [otherSectionName: string]: Lines;
};

type FeatureScore = -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4;
type ReturnMatchingTextonly = boolean;

export type FeatureSet =
  | [(item: TextItem) => boolean, FeatureScore]
  | [(item: TextItem) => RegExpMatchArray | null, FeatureScore, ReturnMatchingTextonly];

export interface TextScore {
  text: string;
  score: number;
  match: boolean;
}

export type TextScores = TextScore[];
