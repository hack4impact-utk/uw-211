// convert comma delimited string to array
export const convertToArray = (input: string) => {
  if (Array.isArray(input)) return input;
  else if (input == '') return [];
  else if (input.includes(',')) {
    const str = input.replace(/\s/g, '');
    return str.split(',');
  } else return [input];
};
``;
