import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useUploadPapers } from '@/hooks/useUploadPapers';
import { UploadIcon } from '@/lib/icons';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type UploadMethod = 'file' | 'doi';

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>('file');
  const [extractText, setExtractText] = useState(true);
  const [generateSummary, setGenerateSummary] = useState(true);
  const [extractCitations, setExtractCitations] = useState(true);
  
  const { uploadPapers, isUploading } = useUploadPapers();
  
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const options = {
      extractText,
      generateSummary,
      extractCitations
    };
    
    uploadPapers(Array.from(files), options);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Research Papers</DialogTitle>
          <DialogDescription>
            Upload PDF research papers to extract, analyze, and manage their content.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-6">
            <Label className="block text-sm font-medium text-neutral-700 mb-2">Upload Method</Label>
            <div className="flex space-x-3">
              <Button
                type="button"
                variant={uploadMethod === 'file' ? 'secondary' : 'outline'}
                onClick={() => setUploadMethod('file')}
                className="flex-1"
              >
                <i className="ri-upload-2-line mr-2"></i> Upload Files
              </Button>
              <Button
                type="button"
                variant={uploadMethod === 'doi' ? 'secondary' : 'outline'}
                onClick={() => setUploadMethod('doi')}
                className="flex-1"
              >
                <i className="ri-link-m mr-2"></i> Input DOI/URL
              </Button>
            </div>
          </div>
          
          {uploadMethod === 'file' ? (
            <div className="mb-6">
              <div 
                className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:bg-neutral-50 transition cursor-pointer"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.accept = 'application/pdf';
                  input.onchange = (e) => handleFileUpload((e.target as HTMLInputElement).files);
                  input.click();
                }}
              >
                <UploadIcon className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <p className="font-medium text-neutral-600 mb-2">Drag and drop PDF files here</p>
                <p className="text-sm text-neutral-500 mb-4">or</p>
                <Button>
                  Browse Files
                </Button>
                <p className="text-xs text-neutral-500 mt-4">Supported formats: PDF only</p>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <Label htmlFor="doi-input">Enter DOI or URL</Label>
              <div className="flex mt-1">
                <input
                  id="doi-input"
                  className="flex w-full rounded-md border border-neutral-300 px-3 py-2 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500"
                  placeholder="e.g., 10.1000/xyz123 or https://arxiv.org/abs/..."
                />
                <Button className="ml-2">
                  Look Up
                </Button>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Enter a DOI, ArXiv ID, or full URL to a paper
              </p>
            </div>
          )}
          
          <div className="mb-6">
            <Label className="block text-sm font-medium text-neutral-700 mb-2">Configure Processing Options</Label>
            <div className="space-y-3">
              <div className="flex items-center">
                <Checkbox
                  id="extract-text"
                  checked={extractText}
                  onCheckedChange={(checked) => setExtractText(checked as boolean)}
                />
                <label htmlFor="extract-text" className="ml-2 text-sm text-neutral-700">
                  Extract text content
                </label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="generate-summary"
                  checked={generateSummary}
                  onCheckedChange={(checked) => setGenerateSummary(checked as boolean)}
                />
                <label htmlFor="generate-summary" className="ml-2 text-sm text-neutral-700">
                  Generate AI summary
                </label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="extract-citations"
                  checked={extractCitations}
                  onCheckedChange={(checked) => setExtractCitations(checked as boolean)}
                />
                <label htmlFor="extract-citations" className="ml-2 text-sm text-neutral-700">
                  Extract citations
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isUploading}>
            {isUploading ? 'Processing...' : 'Upload & Process'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
