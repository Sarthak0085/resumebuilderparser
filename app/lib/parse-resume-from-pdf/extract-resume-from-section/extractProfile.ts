import { hasLetter, hasLetterAndIsAllUpperCase, isBold } from '../groupLinesIntoSection';
import { FeatureSet, ResumeSectionToLines, TextItem } from '../types';
import { getTextWithHighestScoringSystem } from './lib/featureScoringSystem';
import { getSectionLinesByKeywords } from './lib/getSectionLines';

// Name
export const matchLetterSpaceOrPeriodOnly = (item: TextItem) => item.text.match(/^[A-Za-z\s\.]+$/);

//Email
export const matchEmail = (item: TextItem) => item.text.match(/\S+@\S+\.\S+/);
const hasAt = (textItem: TextItem) => textItem.text.includes('@');

export const matchPhone = (item: TextItem) => item.text.match(/\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/);
const hasParenthesis = (item: TextItem) => /\([0-9]+\)/.test(item.text);
export const hasNumber = (item: TextItem) => /[0-9]/.test(item.text);

//Location
export const matchCityAndState = (item: TextItem) => item.text.match(/[A-Z][a-zA-Z\s]+,[A-Z]{2}/);

export const hasComma = (item: TextItem) => item.text.includes(',');

//Url
export const matchUrl = (item: TextItem) => item.text.match(/\S+\.[a-z]+\/S+/);

const matchUrlHttpFallback = (item: TextItem) => item.text.match(/https?:\/\/S+\.\S+/);

const matchUrlWwwFallback = (item: TextItem) => item.text.match(/www\.\S+\.\S+/);
const hasSlash = (item: TextItem) => item.text.includes('/');

//Summary
const has4OrMoreWords = (item: TextItem) => item.text.split(' ').length >= 4;

const NAME_FEATURE_SETS: FeatureSet[] = [
  [matchLetterSpaceOrPeriodOnly, 3, true],
  [isBold, 2],
  [hasLetterAndIsAllUpperCase, 2],

  [hasAt, -4],
  [hasNumber, -4],
  [hasParenthesis, -4],
  [hasSlash, -4],
  [hasComma, -4],
  [has4OrMoreWords, -2],
];

const EMAIL_FEATURE_SETS: FeatureSet[] = [
  [matchEmail, 4, true],
  [isBold, -1],
  [hasLetterAndIsAllUpperCase, -1],
  [hasParenthesis, -4],
  [hasComma, -4],
  [hasSlash, -4],
  [has4OrMoreWords, -4],
];

const PHONE_FEATURE_SETS: FeatureSet[] = [
  [matchPhone, 4, true],
  [hasLetter, -4],
];

const LOCATION_FEATURE_SETS: FeatureSet[] = [
  [matchCityAndState, 4, true],
  [isBold, -1],
  [hasAt, -4],
  [hasParenthesis, -3],
  [hasSlash, -4],
];

const URL_FEATURE_SETS: FeatureSet[] = [
  [matchUrl, 4, true],
  [matchUrlHttpFallback, 3, true],
  [matchUrlWwwFallback, 3, true],
  [isBold, -1],
  [hasAt, -4],
  [hasParenthesis, -3],
  [hasComma, -4],
  [has4OrMoreWords, -4],
];

const SUMMARY_FEATURE_SETS: FeatureSet[] = [
  [has4OrMoreWords, 4],
  [isBold, -1],
  [hasAt, -4],
  [hasParenthesis, -3],
  [matchCityAndState, -4, false],
];

export const extractProfile = (sections: ResumeSectionToLines) => {
  const lines = sections.profile || [];
  const textItems = lines.flat();

  const [name, nameScore] = getTextWithHighestScoringSystem(textItems, NAME_FEATURE_SETS);

  const [email, emailScores] = getTextWithHighestScoringSystem(textItems, EMAIL_FEATURE_SETS);
  const [phone, phoneScores] = getTextWithHighestScoringSystem(textItems, PHONE_FEATURE_SETS);
  const [location, locationScores] = getTextWithHighestScoringSystem(
    textItems,
    LOCATION_FEATURE_SETS
  );
  const [url, urlScores] = getTextWithHighestScoringSystem(textItems, URL_FEATURE_SETS);
  const [summary, summaryScores] = getTextWithHighestScoringSystem(
    textItems,
    SUMMARY_FEATURE_SETS,
    undefined,
    true
  );

  const objectiveLines = getSectionLinesByKeywords(sections, ['objective']);
  const objectiveSection = objectiveLines
    .flat()
    .map((textItem) => textItem.text)
    .join(' ');

  return {
    profile: {
      name,
      email,
      phone,
      location,
      url,
      summary: summary || objectiveSection,
    },
    profileScores: {
      name: nameScore,
      email: emailScores,
      phone: phoneScores,
      location: locationScores,
      url: urlScores,
      summary: summaryScores,
    },
  };
};
