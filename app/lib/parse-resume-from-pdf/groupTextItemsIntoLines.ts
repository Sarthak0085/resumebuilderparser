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
};
