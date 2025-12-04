const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak, Table, TableRow, TableCell, WidthType, BorderStyle, ExternalHyperlink, ImageRun, Footer, Header, PageNumber, PageNumberFormat } = require('docx');
const fs = require('fs');
const path = require('path');

/**
 * Script to convert Markdown report to Word document (.docx)
 * Generates a professional academic report with proper formatting
 */

// Read the markdown file
const markdownPath = path.join(__dirname, '../docs/Lab4_Exercise_Report.md');
const markdownContent = fs.readFileSync(markdownPath, 'utf-8');

// Parse markdown and create Word document sections
function parseMarkdownToDocx(content) {
  const lines = content.split('\n');
  const sections = [];
  let currentSection = { type: 'paragraph', content: [] };
  let inCodeBlock = false;
  let codeLanguage = '';
  let codeContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Handle code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        sections.push({
          type: 'code',
          language: codeLanguage,
          content: codeContent.join('\n')
        });
        codeContent = [];
        codeLanguage = '';
        inCodeBlock = false;
      } else {
        // Start code block
        inCodeBlock = true;
        codeLanguage = line.substring(3).trim();
        if (currentSection.content.length > 0) {
          sections.push(currentSection);
          currentSection = { type: 'paragraph', content: [] };
        }
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    // Handle headings
    if (line.startsWith('# ')) {
      if (currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      sections.push({ type: 'heading1', content: line.substring(2).trim() });
      currentSection = { type: 'paragraph', content: [] };
      continue;
    } else if (line.startsWith('## ')) {
      if (currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      sections.push({ type: 'heading2', content: line.substring(3).trim() });
      currentSection = { type: 'paragraph', content: [] };
      continue;
    } else if (line.startsWith('### ')) {
      if (currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      sections.push({ type: 'heading3', content: line.substring(4).trim() });
      currentSection = { type: 'paragraph', content: [] };
      continue;
    }

    // Handle horizontal rules
    if (line.trim() === '---') {
      if (currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      sections.push({ type: 'pageBreak' });
      currentSection = { type: 'paragraph', content: [] };
      continue;
    }

    // Handle list items
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      if (currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      sections.push({ type: 'list', content: line.trim().substring(2) });
      currentSection = { type: 'paragraph', content: [] };
      continue;
    }

    // Handle checkbox lists
    if (line.trim().startsWith('- [x]') || line.trim().startsWith('- [ ]')) {
      if (currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      const checked = line.includes('[x]');
      const text = line.trim().substring(5).trim();
      sections.push({ type: 'checkbox', checked, content: text });
      currentSection = { type: 'paragraph', content: [] };
      continue;
    }

    // Handle screenshot placeholders
    if (line.trim().startsWith('> [Screenshot:')) {
      if (currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      const screenshotText = line.trim().substring(2).replace(/\[Screenshot: (.*?)\]/, '$1');
      sections.push({ 
        type: 'screenshot', 
        content: screenshotText 
      });
      currentSection = { type: 'paragraph', content: [] };
      continue;
    }

    // Handle empty lines
    if (line.trim() === '') {
      if (currentSection.content.length > 0) {
        currentSection.content.push('');
      }
      continue;
    }

    // Regular text
    currentSection.content.push(line);
  }

  if (currentSection.content.length > 0) {
    sections.push(currentSection);
  }

  return sections;
}

// Convert sections to Word document elements
function createWordElements(sections) {
  const elements = [];

  for (const section of sections) {
    switch (section.type) {
      case 'heading1':
        elements.push(
          new Paragraph({
            text: section.content,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          })
        );
        break;

      case 'heading2':
        elements.push(
          new Paragraph({
            text: section.content,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 }
          })
        );
        break;

      case 'heading3':
        elements.push(
          new Paragraph({
            text: section.content,
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
          })
        );
        break;

      case 'code':
        // Format code block with monospace font
        const codeLines = section.content.split('\n');
        const codeParagraphs = codeLines.map(line => 
          new Paragraph({
            children: [
              new TextRun({
                text: line || ' ',
                font: 'Courier New',
                size: 20, // 10pt
                color: '2C3E50'
              })
            ],
            spacing: { before: 0, after: 0 },
            indent: { left: 360 } // 0.25 inch
          })
        );
        elements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Code (${section.language || 'text'}):`,
                bold: true,
                size: 22
              })
            ],
            spacing: { before: 200, after: 100 }
          }),
          ...codeParagraphs,
          new Paragraph({
            spacing: { after: 200 }
          })
        );
        break;

      case 'list':
        elements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: '• ',
                font: 'Symbol'
              }),
              new TextRun({
                text: section.content
              })
            ],
            spacing: { before: 0, after: 0 },
            indent: { left: 360 }
          })
        );
        break;

      case 'checkbox':
        elements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.checked ? '☑ ' : '☐ ',
                font: 'Arial'
              }),
              new TextRun({
                text: section.content
              })
            ],
            spacing: { before: 0, after: 0 },
            indent: { left: 360 }
          })
        );
        break;

      case 'screenshot':
        elements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: '[Screenshot Placeholder]',
                bold: true,
                italics: true,
                color: '808080',
                size: 22
              })
            ],
            spacing: { before: 200, after: 100 },
            alignment: AlignmentType.CENTER
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: section.content,
                italics: true,
                color: '808080',
                size: 20
              })
            ],
            spacing: { before: 0, after: 200 },
            alignment: AlignmentType.CENTER
          })
        );
        break;

      case 'pageBreak':
        elements.push(new PageBreak());
        break;

      case 'paragraph':
        const text = section.content.join(' ').trim();
        if (text) {
          // Handle bold text **text**
          const parts = [];
          let remaining = text;
          while (remaining.includes('**')) {
            const start = remaining.indexOf('**');
            if (start > 0) {
              parts.push({ text: remaining.substring(0, start), bold: false });
            }
            const end = remaining.indexOf('**', start + 2);
            if (end > start) {
              parts.push({ text: remaining.substring(start + 2, end), bold: true });
              remaining = remaining.substring(end + 2);
            } else {
              parts.push({ text: remaining.substring(start), bold: false });
              remaining = '';
            }
          }
          if (remaining) {
            parts.push({ text: remaining, bold: false });
          }

          const children = parts.length > 0 
            ? parts.map(p => new TextRun({ text: p.text, bold: p.bold }))
            : [new TextRun({ text: text })];

          elements.push(
            new Paragraph({
              children: children,
              spacing: { before: 100, after: 100 }
            })
          );
        }
        break;
    }
  }

  return elements;
}

// Create the Word document
function createDocument() {
  const sections = parseMarkdownToDocx(markdownContent);
  const bodyElements = createWordElements(sections);

  // Title page
  const titlePage = [
    new Paragraph({
      text: 'Lab 4 Exercise Report',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 400 }
    }),
    new Paragraph({
      text: 'TikTok Clone Feature Implementation',
      heading: HeadingLevel.SUBTITLE,
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 600 }
    }),
    new Paragraph({
      text: 'University Lab Assignment',
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 800 }
    }),
    new Paragraph({
      text: `Generated: ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`,
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 0 }
    }),
    new PageBreak()
  ];

  // Table of Contents placeholder (Word will auto-generate)
  const tocPage = [
    new Paragraph({
      text: 'Table of Contents',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 0, after: 400 }
    }),
    new Paragraph({
      text: '1. Overview of the Project',
      spacing: { before: 0, after: 100 }
    }),
    new Paragraph({
      text: '2. Exercise 1: Change Profile Pictures',
      spacing: { before: 0, after: 100 }
    }),
    new Paragraph({
      text: '3. Exercise 2: MUTE/UNMUTE Button',
      spacing: { before: 0, after: 100 }
    }),
    new Paragraph({
      text: '4. Exercise 3: Drag Gesture Navigation',
      spacing: { before: 0, after: 100 }
    }),
    new Paragraph({
      text: '5. Exercise 4: Copy Video URL to Clipboard',
      spacing: { before: 0, after: 100 }
    }),
    new Paragraph({
      text: '6. Exercise 5: User Information Panel',
      spacing: { before: 0, after: 100 }
    }),
    new Paragraph({
      text: '7. Exercise 6: Share Popup',
      spacing: { before: 0, after: 100 }
    }),
    new Paragraph({
      text: '8. Exercise 7: Search Feature',
      spacing: { before: 0, after: 100 }
    }),
    new Paragraph({
      text: '9. Before vs After Comparison',
      spacing: { before: 0, after: 100 }
    }),
    new Paragraph({
      text: '10. Component Communication Diagram',
      spacing: { before: 0, after: 100 }
    }),
    new Paragraph({
      text: '11. Files Modified/Created Summary',
      spacing: { before: 0, after: 100 }
    }),
    new Paragraph({
      text: '12. Testing Checklist',
      spacing: { before: 0, after: 100 }
    }),
    new Paragraph({
      text: '13. How to Run and Test',
      spacing: { before: 0, after: 100 }
    }),
    new Paragraph({
      text: '14. Conclusion',
      spacing: { before: 0, after: 100 }
    }),
    new Paragraph({
      text: '15. Notes for Future Development',
      spacing: { before: 0, after: 100 }
    }),
    new PageBreak()
  ];

  // Footer with page numbers
  const footer = new Footer({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            children: [PageNumber.CURRENT, ' / ', PageNumber.TOTAL_PAGES],
            size: 20
          })
        ],
        alignment: AlignmentType.CENTER
      })
    ]
  });

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch
              right: 1440,  // 1 inch
              bottom: 1440, // 1 inch
              left: 1440    // 1 inch
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                text: 'Lab 4 Exercise Report - TikTok Clone',
                alignment: AlignmentType.CENTER,
                spacing: { after: 0 }
              })
            ]
          })
        },
        footers: {
          default: footer
        },
        children: [
          ...titlePage,
          ...tocPage,
          ...bodyElements
        ]
      }
    ]
  });

  return doc;
}

// Generate the document
async function generateDocx() {
  try {
    console.log('📄 Generating Word document from Markdown...');
    
    const doc = createDocument();
    const outputPath = path.join(__dirname, '../docs/Lab4_Exercise_Report.docx');
    
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outputPath, buffer);
    
    console.log('✅ Word document generated successfully!');
    console.log(`📁 Output file: ${outputPath}`);
    console.log(`📊 File size: ${(buffer.length / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ Error generating Word document:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  generateDocx();
}

module.exports = { generateDocx };

