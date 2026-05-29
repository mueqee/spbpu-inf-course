import katex from 'katex';
import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: false,
});

function renderTex(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex, {
      displayMode,
      throwOnError: false,
      strict: 'ignore',
      trust: true,
    });
  } catch {
    return tex;
  }
}

function renderMath(source: string): string {
  // Блочные и строчные формулы: $$...$$
  let result = source.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
    const trimmed = tex.trim();
    const display = trimmed.includes('\n');
    const html = renderTex(trimmed, display);
    if (display) {
      return `\n\n<div class="math-block">${html}</div>\n\n`;
    }
    return `<span class="math-inline">${html}</span>`;
  });

  // Строчные формулы: \(...\)
  result = result.replace(/\\\(([\s\S]+?)\\\)/g, (_, tex) => {
    const html = renderTex(tex.trim(), false);
    return `<span class="math-inline">${html}</span>`;
  });

  return result;
}

export function renderMarkdown(source: string): string {
  return marked.parse(renderMath(source)) as string;
}

export function stripMermaidBlocks(html: string): string {
  return html.replace(/<pre><code class="language-mermaid">[\s\S]*?<\/code><\/pre>/g, '');
}
