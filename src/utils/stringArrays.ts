// convert comma delimited string to array
export const convertToArray = (input: string) => {
  if (Array.isArray(input)) return input;
  else if (input == '') return [];
  else if (input.includes(',')) {
    const str = input.replace(/\s/g, '');
    return str.split(',');
  } else return [input];
};

// convert back to comma delimited string
export const convertToString = (input: string[]) => {
  let output = '';

  for (let i = 0; i < input.length; i++) {
    output += `${input[i]}, `;
  }
  return output.substring(0, output.length - 2);
};
