import React from 'react';
import { Line, Lines, TextItems } from './types';

export const groupTextItemsIntoLines = (textItems: TextItems): Lines => {
  const lines: Lines = [];
  let line: Line = [];

  for (let item of textItems) {
    if (item.hasEOL) {
      if (item.text.trim() !== '') {
        line.push({ ...item });
      }
      lines.push(line);
      line = [];
    } else if (item.text.trim() !== '') {
      line.push({ ...item });
    }
  }

  if (line.length > 0) {
    lines.push(line);
  }

  const typicalCharWidth = getTypicalCharWidth(lines.flat());

  for (const line of lines) {
    for (let i = line.length - 1; i >= 0; i--) {
      const currentItem = line[i];
      const leftItem = line[i - 1];
      const leftItemXEnd = leftItem.x + leftItem.width;
      const distance = currentItem.x - leftItemXEnd;
      if (distance <= typicalCharWidth) {
        if (shouldAddSpaceBetweenText(leftItem.text, currentItem.text)) {
          leftItem.text += ' ';
        }
        leftItem.text += currentItem.text;

        const currentItemXEnd = currentItem.x + currentItem.width;
        leftItem.width = currentItemXEnd - leftItem.x;
        line.splice(i, 1);
      }
    }
  }

  return lines;
};

const shouldAddSpaceBetweenText = (leftText: string, rightText: string) => {
  const leftTextEnd = leftText[leftText.length - 1];
  const rightTextStart = rightText[0];
  const conditions = [
    [':', ',', '|', '.'].includes(leftTextEnd) && rightTextStart !== ' ',
    leftTextEnd !== ' ' && ['|'].includes(rightTextStart),
  ];

  return conditions.some((condition) => condition);
};

const getTypicalCharWidth = (textItems: TextItems): number => {
  textItems = textItems.filter((item) => item.text.trim() !== '');

  const heightToCount: { [height: number]: number } = {};
  let commonHeight = 0;
  let heightMaxCount = 0;

  const fontNameToCount: { [fontName: string]: number } = {};
  let commonFontName = '';
  let fontNameMaxCount = 0;

  for (let item of textItems) {
    const { text, height, font } = item;

    if (!heightToCount[height]) {
      heightToCount[height] = 0;
    }
    heightToCount[height]++;
    if (heightToCount[height] > heightMaxCount) {
      commonHeight = height;
      heightMaxCount = heightToCount[height];
    }

    if (!fontNameToCount[font]) {
      fontNameToCount[font] = 0;
    }
    fontNameToCount[font] += text.length;
    if (fontNameToCount[font] > fontNameMaxCount) {
      commonFontName = font;
      fontNameMaxCount = fontNameToCount[font];
    }
  }

  const commonTextItems = textItems.filter(
    (item) => item.font === commonFontName && item.height === commonHeight
  );

  const [totalWidth, numChars] = commonTextItems.reduce(
    (acc, cur) => {
      const [preWidth, prevChars] = acc;
      return [preWidth + cur.width, prevChars + cur.text.length];
    },
    [0, 0]
  );

  const typicalCharWidth = totalWidth / numChars;

  return typicalCharWidth;
};
