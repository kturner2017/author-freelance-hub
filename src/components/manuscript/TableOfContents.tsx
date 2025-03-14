
import React, { useState } from 'react';
import { useToast } from '../ui/use-toast';
import { Button } from '../ui/button';
import { 
  ListOrdered, 
  BookOpen, 
  FileText, 
  TableProperties, 
  ScrollText 
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { Chapter } from '@/types/manuscript';

interface TableOfContentsProps {
  bookTitle: string;
  chapters: { [key: string]: Chapter };
  onGenerate: (content: string) => void;
}

type DesignType = 'classic' | 'modern' | 'minimal';

const TableOfContents = ({ bookTitle, chapters, onGenerate }: TableOfContentsProps) => {
  const { toast } = useToast();
  const [selectedDesign, setSelectedDesign] = useState<DesignType>('classic');

  const sortedChapters = Object.values(chapters).sort((a, b) => {
    const aNum = parseInt(a.chapter_id.split(' ')[1]);
    const bNum = parseInt(b.chapter_id.split(' ')[1]);
    return aNum - bNum;
  });

  const generateClassicTOC = () => {
    let tocContent = `# Table of Contents\n\n`;
    
    sortedChapters.forEach((chapter) => {
      tocContent += `- ${chapter.chapter_id}\n`;
    });
    
    return tocContent;
  };

  const generateModernTOC = () => {
    let tocContent = `# Contents\n\n`;
    
    sortedChapters.forEach((chapter, index) => {
      tocContent += `${index + 1}. ${chapter.chapter_id.replace('Chapter ', '')}\n`;
    });
    
    return tocContent;
  };

  const generateMinimalTOC = () => {
    let tocContent = `# ${bookTitle}\n## Contents\n\n`;
    
    sortedChapters.forEach((chapter) => {
      const chapterNumber = chapter.chapter_id.split(' ')[1];
      tocContent += `${chapterNumber} ⋅ `;
    });
    
    // Remove the last separator
    tocContent = tocContent.slice(0, -3);
    
    return tocContent;
  };

  const handleGenerateTOC = () => {
    let tocContent = '';
    
    switch (selectedDesign) {
      case 'classic':
        tocContent = generateClassicTOC();
        break;
      case 'modern':
        tocContent = generateModernTOC();
        break;
      case 'minimal':
        tocContent = generateMinimalTOC();
        break;
    }
    
    onGenerate(tocContent);
    
    toast({
      title: "Table of Contents Generated",
      description: `${selectedDesign} design has been applied`,
    });
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Generate Table of Contents</h2>
        <p className="text-sm text-gray-500 mb-4">
          Select a design style and preview how your table of contents will look.
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Button
          variant={selectedDesign === 'classic' ? "default" : "outline"}
          className="flex flex-col items-center justify-center p-4 h-auto"
          onClick={() => setSelectedDesign('classic')}
        >
          <ListOrdered className="h-8 w-8 mb-2" />
          <span>Classic</span>
        </Button>
        
        <Button
          variant={selectedDesign === 'modern' ? "default" : "outline"}
          className="flex flex-col items-center justify-center p-4 h-auto"
          onClick={() => setSelectedDesign('modern')}
        >
          <BookOpen className="h-8 w-8 mb-2" />
          <span>Modern</span>
        </Button>
        
        <Button
          variant={selectedDesign === 'minimal' ? "default" : "outline"}
          className="flex flex-col items-center justify-center p-4 h-auto"
          onClick={() => setSelectedDesign('minimal')}
        >
          <ScrollText className="h-8 w-8 mb-2" />
          <span>Minimal</span>
        </Button>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border mb-6">
        <h3 className="text-sm font-medium mb-2">Preview</h3>
        {selectedDesign === 'classic' && (
          <div className="space-y-1 text-sm p-2">
            <p className="font-bold">Table of Contents</p>
            {sortedChapters.map((chapter) => (
              <p key={chapter.id} className="ml-4">• {chapter.chapter_id}</p>
            ))}
          </div>
        )}
        
        {selectedDesign === 'modern' && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={2}>Contents</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedChapters.map((chapter, index) => (
                <TableRow key={chapter.id}>
                  <TableCell className="w-12 font-medium">{index + 1}</TableCell>
                  <TableCell>{chapter.chapter_id.replace('Chapter ', '')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        {selectedDesign === 'minimal' && (
          <div className="text-center p-2">
            <p className="font-bold">{bookTitle}</p>
            <p className="text-sm font-medium mt-2">Contents</p>
            <p className="mt-2">
              {sortedChapters.map((chapter, index) => {
                const chapterNumber = chapter.chapter_id.split(' ')[1];
                return (
                  <span key={chapter.id}>
                    {chapterNumber}
                    {index < sortedChapters.length - 1 ? ' ⋅ ' : ''}
                  </span>
                );
              })}
            </p>
          </div>
        )}
      </div>
      
      <Button onClick={handleGenerateTOC} className="w-full">
        <FileText className="mr-2 h-4 w-4" />
        Generate Table of Contents
      </Button>
    </div>
  );
};

export default TableOfContents;
