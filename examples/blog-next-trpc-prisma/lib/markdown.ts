import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { marked } from "marked";
import Prism from "prismjs";

/**
 * Creates a sanitized HTML string from a markdown string,
 * with syntax highlighting for code blocks.
 */
export async function htmlFromMarkdown(markdown: string) {
  const rawHtml = await marked(markdown, {
    highlight: (code, lang) => {
      lang = lang || "js";
      return Prism.highlight(code, Prism.languages[lang], lang);
    },
  });
  const window = new JSDOM("").window as unknown as Window;
  const html = DOMPurify(window).sanitize(rawHtml);

  return html;
}
