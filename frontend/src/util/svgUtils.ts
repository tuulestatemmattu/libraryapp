import { FetchedBook } from '../interfaces/Book';

export const getPlaceholderSVG = (book: FetchedBook) => {
  const firstLetter = book.title ? book.title.charAt(0).toUpperCase() : '?';

  const generateColorFromISBN = (isbn: string) => {
    let hash = 0;
    for (let i = 0; i < isbn.length; i++) {
      hash = isbn.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return hue;
  };

  return `data:image/svg+xml;utf8,
      <svg xmlns="http://www.w3.org/2000/svg" width="180" height="240" viewBox="0 0 180 240">
        <rect width="180" height="240" fill="hsl(${generateColorFromISBN(book.isbn)}, 80%, 75%)"/>
        <rect x="0" y="0" width="20" height="240" fill="hsl(${generateColorFromISBN(book.isbn)}, 60%, 55%)"/>

        <defs>
          <filter id="textShadow">
            <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="black" flood-opacity="0.5"/>
          </filter>
        </defs>

        <text x="100" y="120" font-size="90" fill="white" font-family="Arial" font-weight="bold" text-anchor="middle" dominant-baseline="middle" filter="url(%23textShadow)">
          ${firstLetter}
        </text>
      </svg>`;
};
