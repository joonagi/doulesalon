import type { CSSProperties, ReactNode } from "react";

type InlineToken =
  | {
      kind: "bold" | "italic";
      value: string;
    }
  | {
      kind: "color" | "font";
      name: string;
      value: string;
    }
  | {
      kind: "link";
      label: string;
      href: string;
    };

const inlinePatterns: Array<{
  kind: InlineToken["kind"];
  regex: RegExp;
}> = [
  { kind: "color", regex: /\{\{color:(#[0-9a-fA-F]{3,6})\|([^{}]+)\}\}/ },
  { kind: "font", regex: /\{\{font:(serif|sans|mono)\|([^{}]+)\}\}/ },
  { kind: "link", regex: /\[([^\]]+)\]\((https?:\/\/[^)\s]+|mailto:[^)]+)\)/ },
  { kind: "bold", regex: /\*\*([^*]+)\*\*/ },
  { kind: "italic", regex: /(?<!\*)\*([^*\n]+)\*(?!\*)/ }
];

function safeHref(href: string) {
  if (href.startsWith("https://") || href.startsWith("http://") || href.startsWith("mailto:")) {
    return href;
  }

  return "#";
}

function fontStyle(name: string): CSSProperties {
  if (name === "serif") {
    return { fontFamily: "var(--serif)" };
  }

  if (name === "mono") {
    return { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" };
  }

  return { fontFamily: "var(--sans)" };
}

function findNextToken(text: string): { index: number; length: number; token: InlineToken } | null {
  let next: { index: number; length: number; token: InlineToken } | null = null;

  for (const pattern of inlinePatterns) {
    const match = pattern.regex.exec(text);

    if (!match || match.index < 0) {
      continue;
    }

    const index = match.index;
    const length = match[0].length;
    let token: InlineToken;

    if (pattern.kind === "color" || pattern.kind === "font") {
      token = {
        kind: pattern.kind,
        name: match[1],
        value: match[2]
      };
    } else if (pattern.kind === "link") {
      token = {
        kind: "link",
        label: match[1],
        href: match[2]
      };
    } else if (pattern.kind === "italic") {
      token = {
        kind: "italic",
        value: match[1]
      };
    } else {
      token = {
        kind: "bold",
        value: match[1]
      };
    }

    if (!next || index < next.index) {
      next = { index, length, token };
    }
  }

  return next;
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const token = findNextToken(text);

  if (!token) {
    return [text];
  }

  const before = text.slice(0, token.index);
  const after = text.slice(token.index + token.length);
  const nodes: ReactNode[] = [];

  if (before) {
    nodes.push(before);
  }

  if (token.token.kind === "bold") {
    nodes.push(<strong key={`${keyPrefix}-bold-${token.index}`}>{renderInline(token.token.value, `${keyPrefix}-b`)}</strong>);
  }

  if (token.token.kind === "italic") {
    nodes.push(<em key={`${keyPrefix}-italic-${token.index}`}>{renderInline(token.token.value, `${keyPrefix}-i`)}</em>);
  }

  if (token.token.kind === "color") {
    nodes.push(
      <span key={`${keyPrefix}-color-${token.index}`} style={{ color: token.token.name }}>
        {renderInline(token.token.value, `${keyPrefix}-c`)}
      </span>
    );
  }

  if (token.token.kind === "font") {
    nodes.push(
      <span key={`${keyPrefix}-font-${token.index}`} style={fontStyle(token.token.name)}>
        {renderInline(token.token.value, `${keyPrefix}-f`)}
      </span>
    );
  }

  if (token.token.kind === "link") {
    nodes.push(
      <a key={`${keyPrefix}-link-${token.index}`} href={safeHref(token.token.href)} rel="noreferrer" target="_blank">
        {renderInline(token.token.label, `${keyPrefix}-l`)}
      </a>
    );
  }

  if (after) {
    nodes.push(...renderInline(after, `${keyPrefix}-after-${token.index}`));
  }

  return nodes;
}

function youtubeEmbedUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl);

    if (url.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${url.pathname.replace("/", "")}`;
    }

    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) {
        return rawUrl;
      }

      if (url.pathname.startsWith("/shorts/")) {
        return `https://www.youtube.com/embed/${url.pathname.split("/")[2]}`;
      }

      const videoId = url.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
  } catch {
    return null;
  }

  return null;
}

function renderBlock(block: string, index: number) {
  const youtubeMatch = block.match(/^::youtube\[(https?:\/\/[^\]]+)\]$/);

  if (youtubeMatch) {
    const embedUrl = youtubeEmbedUrl(youtubeMatch[1]);

    if (!embedUrl) {
      return null;
    }

    return (
      <figure className="article-video-embed" key={`youtube-${index}`}>
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          src={embedUrl}
          title="YouTube video player"
        />
      </figure>
    );
  }

  if (block.startsWith("### ")) {
    return <h3 key={`h3-${index}`}>{renderInline(block.replace(/^###\s+/, ""), `h3-${index}`)}</h3>;
  }

  if (block.startsWith("## ")) {
    return <h2 key={`h2-${index}`}>{renderInline(block.replace(/^##\s+/, ""), `h2-${index}`)}</h2>;
  }

  if (block.startsWith("> ")) {
    return <blockquote key={`quote-${index}`}>{renderInline(block.replace(/^>\s+/, ""), `quote-${index}`)}</blockquote>;
  }

  if (block.split("\n").every((line) => line.startsWith("- "))) {
    return (
      <ul key={`list-${index}`}>
        {block.split("\n").map((line, lineIndex) => (
          <li key={`${index}-${lineIndex}`}>{renderInline(line.replace(/^-\s+/, ""), `li-${index}-${lineIndex}`)}</li>
        ))}
      </ul>
    );
  }

  return <p key={`p-${index}`}>{renderInline(block, `p-${index}`)}</p>;
}

type PostBodyProps = {
  bodyMarkdown: string;
};

export function PostBody({ bodyMarkdown }: PostBodyProps) {
  const blocks = bodyMarkdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return <section className="article-body">{blocks.map(renderBlock)}</section>;
}
