
import React from 'react';

interface FrontMatterContent {
  id: string;
  title: string;
  content: string;
  sort_order: number;
}

interface FrontMatterPreviewProps {
  frontMatterContents: FrontMatterContent[];
}

const FrontMatterPreview = ({ frontMatterContents }: FrontMatterPreviewProps) => {
  if (frontMatterContents.length === 0) {
    return (
      <div className="text-center text-gray-500">
        Select a chapter or front matter section to start editing
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {frontMatterContents.map((fm) => (
        <div key={fm.id} className="mb-12">
          <h2 className="text-3xl font-serif font-semibold text-primary-800 mb-8">
            {fm.title}
          </h2>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: fm.content }} />
        </div>
      ))}
    </div>
  );
};

export default FrontMatterPreview;
