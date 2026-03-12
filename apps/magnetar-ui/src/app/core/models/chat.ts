export type ChatRole = 'user' | 'assistant' | 'system';
export type ChatPhase = 'idle' | 'streaming' | 'complete' | 'error';

export type ChatBlock =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'code'; language: string; code: string };

export interface ChatMessage {
  id: string;
  role: ChatRole;
  phase: ChatPhase;
  providerLabel: string | null;
  rawText: string;
  blocks: ChatBlock[];
}

export interface ChatConversationSummary {
  id: string;
  title: string;
  preview: string;
  updatedAt?: string;
}

export interface ChatConversationSession {
  id: string;
  title: string;
  preview: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatCanvasDocument {
  messageId: string;
  title: string;
  content: string;
  language: string;
  renderKind: 'source' | 'html';
  renderTitle: string | null;
}

export function parseChatBlocks(markdown: string): ChatBlock[] {
  const trimmed = markdown.trim();
  if (!trimmed) {
    return [];
  }

  const lines = trimmed.split('\n');
  const blocks: ChatBlock[] = [];
  let paragraphBuffer: string[] = [];
  let listBuffer: string[] = [];
  let listOrdered = false;
  let quoteBuffer: string[] = [];
  let isInCodeBlock = false;
  let codeLanguage = '';
  let codeBuffer: string[] = [];

  const flushParagraph = (): void => {
    if (paragraphBuffer.length === 0) {
      return;
    }

    blocks.push({ type: 'paragraph', text: paragraphBuffer.join(' ').trim() });
    paragraphBuffer = [];
  };

  const flushList = (): void => {
    if (listBuffer.length === 0) {
      return;
    }

    blocks.push({ type: 'list', ordered: listOrdered, items: [...listBuffer] });
    listBuffer = [];
  };

  const flushQuote = (): void => {
    if (quoteBuffer.length === 0) {
      return;
    }

    blocks.push({ type: 'quote', text: quoteBuffer.join(' ').trim() });
    quoteBuffer = [];
  };

  const flushCode = (): void => {
    blocks.push({
      type: 'code',
      language: codeLanguage || 'text',
      code: codeBuffer.join('\n').trimEnd(),
    });
    isInCodeBlock = false;
    codeLanguage = '';
    codeBuffer = [];
  };

  for (const line of lines) {
    if (isInCodeBlock) {
      if (line.startsWith('```')) {
        flushCode();
      } else {
        codeBuffer.push(line);
      }
      continue;
    }

    if (line.startsWith('```')) {
      flushParagraph();
      flushList();
      flushQuote();
      isInCodeBlock = true;
      codeLanguage = line.slice(3).trim();
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      flushQuote();
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length as 1 | 2 | 3,
        text: headingMatch[2].trim(),
      });
      continue;
    }

    const unorderedListMatch = line.match(/^\s*-\s+(.*)$/);
    if (unorderedListMatch) {
      flushParagraph();
      flushQuote();
      if (listBuffer.length === 0) {
        listOrdered = false;
      }
      listBuffer.push(unorderedListMatch[1].trim());
      continue;
    }

    const orderedListMatch = line.match(/^\s*\d+\.\s+(.*)$/);
    if (orderedListMatch) {
      flushParagraph();
      flushQuote();
      if (listBuffer.length === 0) {
        listOrdered = true;
      }
      listBuffer.push(orderedListMatch[1].trim());
      continue;
    }

    if (line.trimStart().startsWith('>')) {
      flushParagraph();
      flushList();
      quoteBuffer.push(line.trimStart().slice(1).trim());
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }

    flushList();
    flushQuote();
    paragraphBuffer.push(line.trim());
  }

  flushParagraph();
  flushList();
  flushQuote();

  if (isInCodeBlock || codeBuffer.length > 0) {
    flushCode();
  }

  return blocks;
}

export function extractCopyText(block: ChatBlock): string {
  switch (block.type) {
    case 'code':
      return block.code;
    case 'list':
      return block.items.join('\n');
    case 'heading':
    case 'paragraph':
    case 'quote':
      return block.text;
    default:
      return '';
  }
}

export function buildConversationSummary(message: ChatMessage): ChatConversationSummary {
  const firstBlock = message.blocks[0];
  const previewSource = firstBlock ? extractCopyText(firstBlock) : message.rawText;
  const compactPreview = previewSource.replace(/\s+/g, ' ').trim();

  return {
    id: message.id,
    title: compactPreview.slice(0, 36) || 'Untitled conversation',
    preview: compactPreview.slice(0, 88),
  };
}

export function extractCanvasDocument(message: ChatMessage): ChatCanvasDocument | null {
  const firstCodeBlock = message.blocks.find((block) => block.type === 'code');
  if (!firstCodeBlock || firstCodeBlock.type !== 'code') {
    return null;
  }

  return {
    messageId: message.id,
    title: `Canvas from ${message.providerLabel ?? 'assistant'} response`,
    content: firstCodeBlock.code,
    language: firstCodeBlock.language,
    renderKind: detectCanvasRenderKind(firstCodeBlock.language, firstCodeBlock.code),
    renderTitle: extractCanvasRenderTitle(firstCodeBlock.language, firstCodeBlock.code),
  };
}

function detectCanvasRenderKind(language: string, code: string): 'source' | 'html' {
  const normalizedLanguage = language.trim().toLowerCase();
  if (normalizedLanguage === 'html' || normalizedLanguage === 'htm') {
    return 'html';
  }

  const normalizedCode = code.trim().toLowerCase();
  if (
    normalizedCode.startsWith('<!doctype html') ||
    normalizedCode.startsWith('<html') ||
    normalizedCode.includes('<body') ||
    normalizedCode.includes('<main') ||
    normalizedCode.includes('<section') ||
    normalizedCode.includes('<div')
  ) {
    return 'html';
  }

  return 'source';
}

function extractCanvasRenderTitle(language: string, code: string): string | null {
  if (detectCanvasRenderKind(language, code) !== 'html') {
    return null;
  }

  const titleMatch = code.match(/<title>\s*([^<]+?)\s*<\/title>/i);
  if (!titleMatch) {
    return null;
  }

  return titleMatch[1].trim() || null;
}
