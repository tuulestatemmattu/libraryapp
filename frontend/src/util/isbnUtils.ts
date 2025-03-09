const getIsbn10CheckDigit = (isbn: string): string => {
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += (10 - i) * parseInt(isbn.charAt(i), 10);
  }
  const remainder = sum % 11;
  const checkDigit = 11 - remainder;
  return checkDigit === 10 ? 'X' : checkDigit.toString();
};

const getIsbn13CheckDigit = (isbn: string): string => {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += (i % 2 === 0 ? 1 : 3) * parseInt(isbn.charAt(i), 10);
  }
  const remainder = sum % 10;
  const checkDigit = remainder === 0 ? 0 : 10 - remainder;
  return checkDigit.toString();
};

export const validateIsbn = (isbn: string): boolean => {
  if (isbn.length === 10) {
    return isbn[9] === getIsbn10CheckDigit(isbn);
  } else if (isbn.length === 13) {
    return isbn[12] === getIsbn13CheckDigit(isbn);
  } else {
    return false;
  }
};

export const eanToIsbn = (ean: string) => {
  if (ean.startsWith('978')) {
    // ISBN-10 encoded in EAN-13, need to convert
    const isbn10 = ean.slice(3, 12);
    const checkDigit = getIsbn10CheckDigit(isbn10);
    return isbn10 + checkDigit;
  } else {
    // ISBN-13 code, no need to convert
    return ean;
  }
};
