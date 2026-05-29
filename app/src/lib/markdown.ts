import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: false,
});

export function renderMarkdown(source: string): string {
  return marked.parse(source) as string;
}

export function stripMermaidBlocks(html: string): string {
  return html.replace(/<pre><code class="language-mermaid">[\s\S]*?<\/code><\/pre>/g, '');
}
