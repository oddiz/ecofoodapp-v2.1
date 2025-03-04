interface ShopNameColorParserProps {
  name: string;
}

/**
 * Component that parses Unity-style color tags in text and renders them with proper styling
 * Handles formats like:
 * - <color=yellow>Text</color>
 * - <color=#FF5500>Text</color>
 * - Nested and unclosed tags
 */
export const ShopNameColorParser: React.FC<ShopNameColorParserProps> = ({
  name,
}) => {
  // Helper function to clean up stray closing tags
  const cleanupText = (text: string): string => {
    return text.replace(/<\/color>/g, "");
  };

  // Parse the shop name with color tags
  const parseColoredText = (text: string): React.ReactNode => {
    // Base case: if no color tags, return plain text (with cleanup)
    if (!text.includes("<color=")) {
      return cleanupText(text);
    }

    const result: React.ReactNode[] = [];
    let currentPosition = 0;

    while (currentPosition < text.length) {
      // Find the next color tag
      const colorTagStart = text.indexOf("<color=", currentPosition);

      // No more color tags, add remaining text and exit
      if (colorTagStart === -1) {
        result.push(cleanupText(text.substring(currentPosition)));
        break;
      }

      // Add any plain text before the color tag
      if (colorTagStart > currentPosition) {
        result.push(
          cleanupText(text.substring(currentPosition, colorTagStart)),
        );
      }

      // Parse color value
      const colorSpecStart = colorTagStart + 7; // length of '<color='
      const colorSpecEnd = text.indexOf(">", colorSpecStart);

      // Handle malformed opening tag
      if (colorSpecEnd === -1) {
        result.push(cleanupText(text.substring(currentPosition)));
        break;
      }

      // Extract the color value
      const colorValue = text.substring(colorSpecStart, colorSpecEnd);
      const contentStart = colorSpecEnd + 1;

      // Find the matching closing tag (accounting for nesting)
      const { closeTagPos, foundClosingTag } = findMatchingClosingTag(
        text,
        contentStart,
      );

      // Create the content - either until the closing tag or the end of text
      const content = text.substring(
        contentStart,
        foundClosingTag ? closeTagPos : undefined,
      );

      // Add the colored content to our result
      result.push(
        <span
          key={`${colorValue}-${colorTagStart}`}
          style={{ color: colorValue }}
        >
          {parseColoredText(content)}
        </span>,
      );

      // If we didn't find a closing tag, we're done
      if (!foundClosingTag) break;

      // Move past the closing tag
      currentPosition = closeTagPos + 8; // length of '</color>'
    }

    return result;
  };

  /**
   * Finds the matching closing tag for a color tag, accounting for nesting
   * @param text The text to search in
   * @param startPos Position to start searching from
   * @returns The position of the closing tag and whether it was found
   */
  const findMatchingClosingTag = (
    text: string,
    startPos: number,
  ): { closeTagPos: number; foundClosingTag: boolean } => {
    let depth = 1;
    let pos = startPos;

    while (depth > 0 && pos < text.length) {
      const nextOpenTag = text.indexOf("<color=", pos);
      const nextCloseTag = text.indexOf("</color>", pos);

      // No more closing tags
      if (nextCloseTag === -1) {
        return { closeTagPos: text.length, foundClosingTag: false };
      }

      // Found a nested open tag before the next closing tag
      if (nextOpenTag !== -1 && nextOpenTag < nextCloseTag) {
        pos = nextOpenTag + 7;
        depth++;
      } else {
        // Found a closing tag
        pos = nextCloseTag;
        depth--;
      }
    }

    return { closeTagPos: pos, foundClosingTag: true };
  };

  return <div className="font-semibold text-sm">{parseColoredText(name)}</div>;
};
