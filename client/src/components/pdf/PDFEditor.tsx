import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

interface PDFEditorProps {
  pdfUrl: string;
  paperId: number;
  onSave: (editedPdf: File) => Promise<void>;
}

const PDFEditor: React.FC<PDFEditorProps> = ({ pdfUrl, paperId, onSave }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [annotations, setAnnotations] = useState<Array<{
    id: string;
    page: number;
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  }>>([]);
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [editMode, setEditMode] = useState<'text' | 'highlight' | 'draw' | 'erase'>('text');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPath, setDrawingPath] = useState<Array<{ x: number; y: number }>>([]);
  const [drawings, setDrawings] = useState<Array<{
    id: string;
    page: number;
    path: Array<{ x: number; y: number }>;
    color: string;
    width: number;
  }>>([]);
  const [drawColor, setDrawColor] = useState('#FF0000');
  const [drawWidth, setDrawWidth] = useState(2);
  const [isSaving, setIsSaving] = useState(false);

  // Mock function to simulate PDF loading
  useEffect(() => {
    // In a real implementation, this would use a PDF library like PDF.js
    const loadPdf = async () => {
      try {
        // Simulate loading a PDF
        setTimeout(() => {
          setTotalPages(10); // Mock 10 pages
          renderPage(1);
        }, 500);
      } catch (error) {
        console.error('Error loading PDF:', error);
        toast({
          title: 'Error',
          description: 'Failed to load PDF document',
          variant: 'destructive',
        });
      }
    };

    loadPdf();
  }, [pdfUrl]);

  // Mock function to render a page
  const renderPage = (pageNum: number) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Mock page content
    ctx.fillStyle = '#000000';
    ctx.font = '16px Arial';
    ctx.fillText(`Page ${pageNum} of PDF Document`, 50, 50);
    ctx.fillText(`Paper ID: ${paperId}`, 50, 80);
    ctx.fillText('This is a mock PDF page for demonstration purposes.', 50, 120);
    
    // Draw a mock paper layout
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 1;
    
    // Title area
    ctx.strokeRect(50, 150, canvas.width - 100, 60);
    ctx.fillText('TITLE AREA', canvas.width / 2 - 40, 180);
    
    // Abstract
    ctx.strokeRect(50, 230, canvas.width - 100, 100);
    ctx.fillText('ABSTRACT', canvas.width / 2 - 40, 250);
    
    // Content
    ctx.strokeRect(50, 350, canvas.width - 100, 300);
    ctx.fillText('CONTENT', canvas.width / 2 - 40, 370);
    
    // Draw existing annotations for this page
    drawAnnotations(pageNum);
    
    // Draw existing drawings for this page
    drawAllPaths(pageNum);
  };

  // Draw annotations on the canvas
  const drawAnnotations = (pageNum: number) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Filter annotations for current page
    const pageAnnotations = annotations.filter(anno => anno.page === pageNum);
    
    pageAnnotations.forEach(anno => {
      // Draw highlight
      ctx.fillStyle = anno.color + '80'; // Add transparency
      ctx.fillRect(anno.x, anno.y, anno.width, anno.height);
      
      // Draw border if this is the active annotation
      if (activeAnnotation === anno.id) {
        ctx.strokeStyle = '#0000FF';
        ctx.lineWidth = 2;
        ctx.strokeRect(anno.x - 2, anno.y - 2, anno.width + 4, anno.height + 4);
      }
    });
  };

  // Draw all paths for the current page
  const drawAllPaths = (pageNum: number) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Filter drawings for current page
    const pageDrawings = drawings.filter(drawing => drawing.page === pageNum);
    
    pageDrawings.forEach(drawing => {
      if (drawing.path.length < 2) return;
      
      ctx.beginPath();
      ctx.moveTo(drawing.path[0].x, drawing.path[0].y);
      
      for (let i = 1; i < drawing.path.length; i++) {
        ctx.lineTo(drawing.path[i].x, drawing.path[i].y);
      }
      
      ctx.strokeStyle = drawing.color;
      ctx.lineWidth = drawing.width;
      ctx.stroke();
    });
  };

  // Handle page navigation
  const goToPage = (pageNum: number) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
    renderPage(pageNum);
  };

  // Handle zoom change
  const handleZoomChange = (value: number[]) => {
    const newZoom = value[0];
    setZoom(newZoom);
    
    if (canvasRef.current && containerRef.current) {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      
      // Adjust canvas size based on zoom
      const baseWidth = container.clientWidth * 0.9;
      canvas.width = baseWidth * (newZoom / 100);
      canvas.height = (baseWidth * 1.414) * (newZoom / 100); // A4 aspect ratio
      
      renderPage(currentPage);
    }
  };

  // Handle mouse down for drawing or selecting annotations
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (editMode === 'draw') {
      setIsDrawing(true);
      setDrawingPath([{ x, y }]);
    } else if (editMode === 'text' || editMode === 'highlight') {
      // Check if clicked on an existing annotation
      const clicked = annotations.find(anno => 
        anno.page === currentPage &&
        x >= anno.x && x <= anno.x + anno.width &&
        y >= anno.y && y <= anno.y + anno.height
      );
      
      if (clicked) {
        setActiveAnnotation(clicked.id);
        setEditText(clicked.text);
        setIsEditing(true);
      } else if (editMode === 'text') {
        // Create a new text annotation
        const newId = `anno-${Date.now()}`;
        const newAnno = {
          id: newId,
          page: currentPage,
          text: '',
          x,
          y,
          width: 150,
          height: 50,
          color: '#FFFF00'
        };
        
        setAnnotations([...annotations, newAnno]);
        setActiveAnnotation(newId);
        setEditText('');
        setIsEditing(true);
      } else if (editMode === 'highlight') {
        // Start creating a highlight annotation
        const newId = `anno-${Date.now()}`;
        const newAnno = {
          id: newId,
          page: currentPage,
          text: '',
          x,
          y,
          width: 0,
          height: 0,
          color: '#FFFF00'
        };
        
        setAnnotations([...annotations, newAnno]);
        setActiveAnnotation(newId);
        setIsDrawing(true);
      }
    } else if (editMode === 'erase') {
      // Find and remove annotations or drawings at this position
      const annoIndex = annotations.findIndex(anno => 
        anno.page === currentPage &&
        x >= anno.x && x <= anno.x + anno.width &&
        y >= anno.y && y <= anno.y + anno.height
      );
      
      if (annoIndex !== -1) {
        const newAnnotations = [...annotations];
        newAnnotations.splice(annoIndex, 1);
        setAnnotations(newAnnotations);
        setActiveAnnotation(null);
        setIsEditing(false);
        renderPage(currentPage);
      }
      
      // Also check for drawings to erase
      // This is simplified - in a real app you'd need more sophisticated path intersection
      const drawingIndex = drawings.findIndex(drawing => {
        if (drawing.page !== currentPage) return false;
        
        // Simple check - are we near any point on the path?
        return drawing.path.some(point => {
          const dx = point.x - x;
          const dy = point.y - y;
          return Math.sqrt(dx*dx + dy*dy) < 10; // Within 10px
        });
      });
      
      if (drawingIndex !== -1) {
        const newDrawings = [...drawings];
        newDrawings.splice(drawingIndex, 1);
        setDrawings(newDrawings);
        renderPage(currentPage);
      }
    }
  };

  // Handle mouse move for drawing
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (editMode === 'draw') {
      // Add point to drawing path
      setDrawingPath([...drawingPath, { x, y }]);
      
      // Draw the current path
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      if (drawingPath.length > 0) {
        ctx.beginPath();
        ctx.moveTo(drawingPath[drawingPath.length - 1].x, drawingPath[drawingPath.length - 1].y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = drawWidth;
        ctx.stroke();
      }
    } else if (editMode === 'highlight' && activeAnnotation) {
      // Update highlight size
      const updatedAnnotations = annotations.map(anno => {
        if (anno.id === activeAnnotation) {
          const startX = anno.x;
          const startY = anno.y;
          return {
            ...anno,
            width: x - startX,
            height: y - startY
          };
        }
        return anno;
      });
      
      setAnnotations(updatedAnnotations);
      renderPage(currentPage);
    }
  };

  // Handle mouse up to finish drawing
  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    if (editMode === 'draw' && drawingPath.length > 1) {
      // Save the completed drawing
      const newDrawing = {
        id: `drawing-${Date.now()}`,
        page: currentPage,
        path: drawingPath,
        color: drawColor,
        width: drawWidth
      };
      
      setDrawings([...drawings, newDrawing]);
    }
    
    // If we were creating a highlight, finish it
    if (editMode === 'highlight' && activeAnnotation) {
      // Ensure width and height are positive
      const annotation = annotations.find(a => a.id === activeAnnotation);
      if (annotation) {
        let { x, y, width, height } = annotation;
        
        if (width < 0) {
          x = x + width;
          width = Math.abs(width);
        }
        
        if (height < 0) {
          y = y + height;
          height = Math.abs(height);
        }
        
        const updatedAnnotations = annotations.map(anno => {
          if (anno.id === activeAnnotation) {
            return { ...anno, x, y, width, height };
          }
          return anno;
        });
        
        setAnnotations(updatedAnnotations);
        setIsEditing(true); // Allow adding text to the highlight
      }
    }
  };

  // Handle saving annotation text
  const handleSaveAnnotation = () => {
    if (!activeAnnotation) return;
    
    const updatedAnnotations = annotations.map(anno => {
      if (anno.id === activeAnnotation) {
        return { ...anno, text: editText };
      }
      return anno;
    });
    
    setAnnotations(updatedAnnotations);
    setIsEditing(false);
    setActiveAnnotation(null);
    renderPage(currentPage);
  };

  // Handle saving the edited PDF
  const handleSavePDF = async () => {
    setIsSaving(true);
    
    try {
      // In a real implementation, this would create a new PDF with the edits
      // For this mock, we'll just create a canvas snapshot
      if (canvasRef.current) {
        canvasRef.current.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], `edited-paper-${paperId}.pdf`, { type: 'application/pdf' });
            await onSave(file);
            
            toast({
              title: 'Success',
              description: 'PDF saved successfully',
            });
          }
        });
      }
    } catch (error) {
      console.error('Error saving PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to save PDF',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Initialize canvas size on component mount
  useEffect(() => {
    if (canvasRef.current && containerRef.current) {
      const container = containerRef.current;
      const baseWidth = container.clientWidth * 0.9;
      
      canvasRef.current.width = baseWidth;
      canvasRef.current.height = baseWidth * 1.414; // A4 aspect ratio
      
      renderPage(currentPage);
    }
  }, [canvasRef.current, containerRef.current]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (!isNaN(page) && page >= 1 && page <= totalPages) {
                  goToPage(page);
                }
              }}
              className="w-16"
            />
            <span className="text-sm text-neutral-500">of {totalPages}</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Zoom:</span>
            <Slider
              value={[zoom]}
              min={50}
              max={200}
              step={10}
              onValueChange={handleZoomChange}
              className="w-32"
            />
            <span className="text-sm">{zoom}%</span>
          </div>
          
          <Button onClick={handleSavePDF} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save PDF'}
          </Button>
        </div>
      </div>
      
      <div className="flex flex-1 gap-4">
        <div 
          ref={containerRef}
          className="flex-1 overflow-auto bg-neutral-100 rounded-lg p-4 flex justify-center"
        >
          <canvas
            ref={canvasRef}
            className="bg-white shadow-md"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        </div>
        
        <div className="w-64 bg-white rounded-lg border border-neutral-200 p-4">
          <Tabs defaultValue="tools">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="tools" className="flex-1">Tools</TabsTrigger>
              <TabsTrigger value="annotations" className="flex-1">Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tools" className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Edit Mode</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={editMode === 'text' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setEditMode('text')}
                    className="justify-start"
                  >
                    <i className="ri-text-icon mr-2"></i> Text
                  </Button>
                  
                  <Button
                    variant={editMode === 'highlight' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setEditMode('highlight')}
                    className="justify-start"
                  >
                    <i className="ri-mark-pen-line mr-2"></i> Highlight
                  </Button>
                  
                  <Button
                    variant={editMode === 'draw' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setEditMode('draw')}
                    className="justify-start"
                  >
                    <i className="ri-pencil-line mr-2"></i> Draw
                  </Button>
                  
                  <Button
                    variant={editMode === 'erase' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setEditMode('erase')}
                    className="justify-start"
                  >
                    <i className="ri-eraser-line mr-2"></i> Erase
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              {editMode === 'draw' && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="draw-color">Color</Label>
                    <div className="flex space-x-2">
                      {['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#000000'].map(color => (
                        <div
                          key={color}
                          className={`w-6 h-6 rounded-full cursor-pointer ${drawColor === color ? 'ring-2 ring-offset-2 ring-primary-500' : ''}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setDrawColor(color)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="draw-width">Width</Label>
                    <Slider
                      id="draw-width"
                      value={[drawWidth]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(value) => setDrawWidth(value[0])}
                    />
                    <div className="text-right text-sm">{drawWidth}px</div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="annotations" className="space-y-4">
              {isEditing && activeAnnotation ? (
                <div className="space-y-3">
                  <h3 className="font-medium text-sm">Edit Annotation</h3>
                  <Textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    placeholder="Enter annotation text..."
                    rows={4}
                  />
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleSaveAnnotation}>Save</Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setActiveAnnotation(null);
                        renderPage(currentPage);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-medium text-sm">Annotations</h3>
                  {annotations.filter(a => a.page === currentPage).length === 0 ? (
                    <p className="text-sm text-neutral-500">No annotations on this page.</p>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {annotations
                        .filter(a => a.page === currentPage)
                        .map(anno => (
                          <Card key={anno.id} className="overflow-hidden">
                            <CardContent className="p-3">
                              <div className="text-sm">
                                {anno.text || <span className="text-neutral-400 italic">No text</span>}
                              </div>
                              <div className="flex justify-end mt-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setActiveAnnotation(anno.id);
                                    setEditText(anno.text);
                                    setIsEditing(true);
                                  }}
                                >
                                  Edit
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PDFEditor;