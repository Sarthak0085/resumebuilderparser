import readPdf from './readPdf';

export const parseResumeFromPdf = async (fileUrl: string) => {
  //step 1. Read a pdf resume file into text items to prepare for processing
  const textItems = await readPdf(fileUrl);

  // //step 2. Group text items into lines
  // const lines = groupTextItemsIntoLines(textItems);

  // //step 3. Group lines into sections
  // const sections = groupLinesIntoSections(lines);

  // //step 4. Extract resume from sections
  // const resume = extractResumeFromSections(sections);

  // return resume;
};
