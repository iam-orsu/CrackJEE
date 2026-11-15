'use client';

import React from 'react';
import { MathText } from '@/lib/math';

export interface MatchListItem {
  label: string;
  text: string;
}

export interface ParsedMatchQuestion {
  lead: string;
  list1Title: string;
  list1Items: MatchListItem[];
  list2Title: string;
  list2Items: MatchListItem[];
  instruction: string;
}

/**
 * Robustly parses a "Match List I with List II" or "Match the Following"
 * question text into structured lists.
 */
export function parseMatchQuestion(text: string): ParsedMatchQuestion | null {
  if (!text) return null;

  // Find where List I and List II begin (following a newline)
  const l1Idx = text.search(/\n\s*List\s*I\b/i);
  const l2Idx = text.search(/\n\s*List\s*II\b/i);
  if (l1Idx === -1 || l2Idx === -1 || l1Idx >= l2Idx) return null;

  const lead = text.slice(0, l1Idx).trim();
  const list1Block = text.slice(l1Idx, l2Idx).trim();

  // Find instruction line if present (e.g., "Choose the correct answer from...")
  const chooseMatch = text.slice(l2Idx).search(/\n\s*(Choose the correct|Which of the following|Select the correct)/i);
  let list2Block = '';
  let instruction = '';
  if (chooseMatch !== -1) {
    list2Block = text.slice(l2Idx, l2Idx + chooseMatch).trim();
    instruction = text.slice(l2Idx + chooseMatch).trim();
  } else {
    list2Block = text.slice(l2Idx).trim();
  }

  // Parse lines for List I
  const list1Lines = list1Block.split('\n').map((l) => l.trim()).filter(Boolean);
  const list1Title = list1Lines[0]?.replace(/:$/, '') || 'List I';
  const list1Items: MatchListItem[] = [];
  for (let i = 1; i < list1Lines.length; i++) {
    const line = list1Lines[i]!;
    const m = line.match(/^([A-D]|[P-S]|\d+|[I|V|X]+)[.:)]\s*(.*)$/i);
    if (m) {
      list1Items.push({ label: m[1]!, text: m[2]! });
    } else if (list1Items.length > 0) {
      list1Items[list1Items.length - 1]!.text += ' ' + line;
    }
  }

  // Parse lines for List II
  const list2Lines = list2Block.split('\n').map((l) => l.trim()).filter(Boolean);
  const list2Title = list2Lines[0]?.replace(/:$/, '') || 'List II';
  const list2Items: MatchListItem[] = [];
  for (let i = 1; i < list2Lines.length; i++) {
    const line = list2Lines[i]!;
    const m = line.match(/^([A-D]|[P-S]|\d+|[I|V|X]+)[.:)]\s*(.*)$/i);
    if (m) {
      list2Items.push({ label: m[1]!, text: m[2]! });
    } else if (list2Items.length > 0) {
      list2Items[list2Items.length - 1]!.text += ' ' + line;
    }
  }

  if (list1Items.length === 0 || list2Items.length === 0) return null;

  return { lead, list1Title, list1Items, list2Title, list2Items, instruction };
}

interface MatchListTableProps {
  questionText: string;
  className?: string;
  style?: React.CSSProperties;
}

export function MatchListTable({ questionText, className, style }: MatchListTableProps) {
  const parsed = parseMatchQuestion(questionText);

  // If question is not formatted as matching lists, fall back gracefully to regular text
  if (!parsed) {
    return <MathText text={questionText} className={className} style={style} />;
  }

  const { lead, list1Title, list1Items, list2Title, list2Items, instruction } = parsed;
  const maxRows = Math.max(list1Items.length, list2Items.length);

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 14, ...style }}>
      {lead && (
        <div style={{ fontSize: 15, lineHeight: 1.6, color: '#1e293b', fontWeight: 500 }}>
          <MathText text={lead} />
        </div>
      )}

      {/* 2-Column Side-by-Side Match Table */}
      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          overflow: 'hidden',
          background: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        {/* Table Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: '#f8fafc',
            borderBottom: '2px solid #e2e8f0',
            fontWeight: 700,
            fontSize: 13,
            color: '#334155',
            letterSpacing: '0.02em',
          }}
        >
          <div style={{ padding: '10px 16px', borderRight: '1px solid #e2e8f0' }}>
            <MathText text={list1Title} />
          </div>
          <div style={{ padding: '10px 16px' }}>
            <MathText text={list2Title} />
          </div>
        </div>

        {/* Table Body */}
        {Array.from({ length: maxRows }).map((_, idx) => {
          const item1 = list1Items[idx];
          const item2 = list2Items[idx];
          const isEven = idx % 2 === 0;

          return (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                borderBottom: idx < maxRows - 1 ? '1px solid #f1f5f9' : 'none',
                background: isEven ? '#ffffff' : '#fbfcfd',
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              {/* Left Column Item */}
              <div
                style={{
                  padding: '11px 16px',
                  borderRight: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                }}
              >
                {item1 ? (
                  <>
                    <span
                      style={{
                        flexShrink: 0,
                        fontWeight: 700,
                        color: '#0f172a',
                        minWidth: 20,
                      }}
                    >
                      {item1.label}.
                    </span>
                    <span style={{ color: '#1e293b' }}>
                      <MathText text={item1.text} />
                    </span>
                  </>
                ) : null}
              </div>

              {/* Right Column Item */}
              <div
                style={{
                  padding: '11px 16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                }}
              >
                {item2 ? (
                  <>
                    <span
                      style={{
                        flexShrink: 0,
                        fontWeight: 700,
                        color: '#0f172a',
                        minWidth: 22,
                      }}
                    >
                      {item2.label}.
                    </span>
                    <span style={{ color: '#1e293b' }}>
                      <MathText text={item2.text} />
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {instruction && (
        <div style={{ fontSize: 13, color: '#64748b', fontStyle: 'italic', marginTop: 2 }}>
          <MathText text={instruction} />
        </div>
      )}
    </div>
  );
}
