import { useState } from 'react';
import { useGetAllResults, useCreateResult, useUpdateResult, useDeleteResult } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Trophy, Plus, Edit, Trash2, ExternalLink, Calendar, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob, type Result } from '../backend';

export default function ResultsManagement() {
  const { data: results = [], isLoading } = useGetAllResults();
  const createResult = useCreateResult();
  const updateResult = useUpdateResult();
  const deleteResult = useDeleteResult();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<Result | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    imageFile: null as File | null,
    imagePreview: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      link: '',
      imageFile: null,
      imagePreview: '',
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleCreate = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (result: Result) => {
    setFormData({
      title: result.title,
      description: result.description,
      link: result.link || '',
      imageFile: null,
      imagePreview: result.image.getDirectURL(),
    });
    setEditingResult(result);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingResult) {
        // Update existing result
        let imageBlob: ExternalBlob;
        if (formData.imageFile) {
          const imageBytes = new Uint8Array(await formData.imageFile.arrayBuffer());
          imageBlob = ExternalBlob.fromBytes(imageBytes);
        } else {
          imageBlob = editingResult.image;
        }

        await updateResult.mutateAsync({
          id: editingResult.id,
          title: formData.title.trim(),
          image: imageBlob,
          description: formData.description.trim(),
          link: formData.link.trim() || null,
        });

        toast.success('Result updated successfully');
        setEditingResult(null);
      } else {
        // Create new result
        if (!formData.imageFile) {
          toast.error('Please upload an image');
          return;
        }

        const imageBytes = new Uint8Array(await formData.imageFile.arrayBuffer());
        const imageBlob = ExternalBlob.fromBytes(imageBytes);

        await createResult.mutateAsync({
          title: formData.title.trim(),
          image: imageBlob,
          description: formData.description.trim(),
          link: formData.link.trim() || null,
        });

        toast.success('Result created successfully');
        setIsCreateDialogOpen(false);
      }

      resetForm();
    } catch (error: any) {
      toast.error(`Failed to save result: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmation) return;

    try {
      await deleteResult.mutateAsync(deleteConfirmation.id);
      toast.success('Result deleted successfully');
      setDeleteConfirmation(null);
    } catch (error: any) {
      toast.error(`Failed to delete result: ${error.message}`);
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Results Management
              </CardTitle>
              <CardDescription>Create and manage tournament results (optimized for 4857 × 4428 px images)</CardDescription>
            </div>
            <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Result
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground text-lg mb-4">No results posted yet</p>
              <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Post First Result
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((result) => (
                <Card key={result.id} className="border-primary/20 overflow-hidden">
                  <div className="relative w-full bg-background/50" style={{ aspectRatio: '4857 / 4428' }}>
                    <img
                      src={result.image.getDirectURL()}
                      alt={result.title}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{result.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{result.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(result.createdAt)}</span>
                    </div>
                    {result.link && (
                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 mb-4"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="line-clamp-1">{result.link}</span>
                      </a>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(result)}
                        className="flex-1"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteConfirmation(result)}
                        className="flex-1"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen || !!editingResult} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false);
          setEditingResult(null);
          resetForm();
        }
      }}>
        <DialogContent className="border-primary/20 bg-card/95 backdrop-blur-sm max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-primary">
              {editingResult ? 'Edit Result' : 'Post New Result'}
            </DialogTitle>
            <DialogDescription>
              {editingResult ? 'Update the result details below' : 'Fill in the details to post a new result'}
              <br />
              <span className="text-xs text-muted-foreground">Recommended image resolution: 4857 × 4428 pixels</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter result title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Enter result description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">External Link (Optional)</Label>
              <Input
                id="link"
                type="url"
                placeholder="https://example.com"
                value={formData.link}
                onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Result Poster Image * (4857 × 4428 px recommended)
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageChange}
              />
              <p className="text-xs text-muted-foreground">
                Upload high-resolution PNG images for best quality. The image will be displayed with its original aspect ratio.
              </p>
              {formData.imagePreview && (
                <div className="mt-4 relative w-full max-w-md mx-auto rounded-lg overflow-hidden border-2 border-primary/20 bg-background/50">
                  <div className="w-full" style={{ aspectRatio: '4857 / 4428' }}>
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground border border-primary/20">
                    Preview
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setEditingResult(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createResult.isPending || updateResult.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {(createResult.isPending || updateResult.isPending) ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>{editingResult ? 'Update' : 'Post'} Result</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmation} onOpenChange={(open) => !open && setDeleteConfirmation(null)}>
        <AlertDialogContent className="border-destructive/20 bg-card/95 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Delete Result
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the result <span className="font-semibold text-foreground">"{deleteConfirmation?.title}"</span>?
              <br /><br />
              <span className="text-destructive font-medium">⚠️ This action cannot be undone.</span> The result will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteResult.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Result
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
