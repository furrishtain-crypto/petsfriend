import React from 'react';

// A deliberately small renderer for blog and page bodies: ## headings, - lists, paragraphs, **bold**, [text](url).
// Output is React elements (never raw HTML), so stored text can't inject markup.
function inline(text: string, key: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\[[^\]]+\]\((?:https?:\/\/|\/)[^)\s]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) out.push(<strong key={`${key}-${i++}`}>{tok.slice(2, -2)}</strong>);
    else {
      const mm = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok)!;
      out.push(<a key={`${key}-${i++}`} href={mm[2]}>{mm[1]}</a>);
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function headings(src: string): { id: string; text: string }[] {
  return src.split('\n').filter((l) => l.startsWith('## ')).map((l) => {
    const text = l.slice(3).trim();
    return { text, id: text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') };
  });
}

export function Markdown({ source }: { source: string }) {
  const blocks = source.replace(/\r/g, '').split(/\n{2,}/);
  const els: React.ReactNode[] = [];
  blocks.forEach((b, bi) => {
    const lines = b.split('\n').filter((l) => l.trim() !== '');
    if (lines.length === 0) return;
    if (lines[0].startsWith('## ')) {
      const text = lines[0].slice(3).trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      els.push(<h2 key={bi} id={id}>{text}</h2>);
      const rest = lines.slice(1).join(' ');
      if (rest) els.push(<p key={`${bi}p`}>{inline(rest, `${bi}p`)}</p>);
    } else if (lines.every((l) => l.startsWith('- '))) {
      els.push(<ul key={bi}>{lines.map((l, i) => <li key={i}>{inline(l.slice(2), `${bi}-${i}`)}</li>)}</ul>);
    } else {
      els.push(<p key={bi}>{inline(lines.join(' '), String(bi))}</p>);
    }
  });
  return <>{els}</>;
}
