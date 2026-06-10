import {
  Calendar,
  Edit,
  ExternalLink,
  Megaphone,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import {
  useCreateAnnouncement,
  useDeleteAnnouncement,
  useGetAllAnnouncements,
  useUpdateAnnouncement,
} from "../hooks/useQueries";
import type { Announcement } from "../types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export default function AnnouncementsManagement() {
  const { data: announcements = [], isLoading } = useGetAllAnnouncements();
  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<Announcement | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    imageFile: null as File | null,
    imagePreview: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      link: "",
      imageFile: null,
      imagePreview: "",
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

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      description: announcement.description,
      link: announcement.link || "",
      imageFile: null,
      imagePreview: announcement.image.getDirectURL(),
    });
    setEditingAnnouncement(announcement);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingAnnouncement) {
        // Update existing announcement
        let imageBlob: ExternalBlob;
        if (formData.imageFile) {
          const imageBytes = new Uint8Array(
            await formData.imageFile.arrayBuffer(),
          );
          imageBlob = ExternalBlob.fromBytes(imageBytes);
        } else {
          imageBlob = editingAnnouncement.image;
        }

        await updateAnnouncement.mutateAsync({
          id: editingAnnouncement.id,
          title: formData.title.trim(),
          description: formData.description.trim(),
          image: imageBlob,
          link: formData.link.trim() || null,
        });

        toast.success("Announcement updated successfully");
        setEditingAnnouncement(null);
      } else {
        // Create new announcement
        if (!formData.imageFile) {
          toast.error("Please upload an image");
          return;
        }

        const imageBytes = new Uint8Array(
          await formData.imageFile.arrayBuffer(),
        );
        const imageBlob = ExternalBlob.fromBytes(imageBytes);

        await createAnnouncement.mutateAsync({
          title: formData.title.trim(),
          description: formData.description.trim(),
          image: imageBlob,
          link: formData.link.trim() || null,
        });

        toast.success("Announcement created successfully");
        setIsCreateDialogOpen(false);
      }

      resetForm();
    } catch (error: any) {
      toast.error(`Failed to save announcement: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmation) return;

    try {
      await deleteAnnouncement.mutateAsync(deleteConfirmation.id);
      toast.success("Announcement deleted successfully");
      setDeleteConfirmation(null);
    } catch (error: any) {
      toast.error(`Failed to delete announcement: ${error.message}`);
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading announcements...</p>
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
                <Megaphone className="w-5 h-5 text-primary" />
                Announcements Management
              </CardTitle>
              <CardDescription>
                Create and manage tournament announcements
              </CardDescription>
            </div>
            <Button
              onClick={handleCreate}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Announcement
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {announcements.length === 0 ? (
            <div className="text-center py-12">
              <Megaphone className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground text-lg mb-4">
                No announcements yet
              </p>
              <Button
                onClick={handleCreate}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Announcement
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {announcements.map((announcement) => (
                <Card
                  key={announcement.id}
                  className="border-primary/20 overflow-hidden"
                >
                  <div className="relative aspect-video">
                    <img
                      src={announcement.image.getDirectURL()}
                      alt={announcement.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {announcement.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(announcement.createdAt)}</span>
                    </div>
                    {announcement.link && (
                      <a
                        href={announcement.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 mb-4"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="line-clamp-1">
                          {announcement.link}
                        </span>
                      </a>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(announcement)}
                        className="flex-1"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteConfirmation(announcement)}
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
      <Dialog
        open={isCreateDialogOpen || !!editingAnnouncement}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setEditingAnnouncement(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="border-primary/20 bg-card/95 backdrop-blur-sm max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-primary">
              {editingAnnouncement
                ? "Edit Announcement"
                : "Create New Announcement"}
            </DialogTitle>
            <DialogDescription>
              {editingAnnouncement
                ? "Update the announcement details below"
                : "Fill in the details to create a new announcement"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter announcement title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Enter announcement description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, link: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Poster Image *</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {formData.imagePreview && (
                <div className="mt-2 relative aspect-video rounded-lg overflow-hidden border border-primary/20">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setEditingAnnouncement(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                createAnnouncement.isPending || updateAnnouncement.isPending
              }
              className="bg-primary hover:bg-primary/90"
            >
              {createAnnouncement.isPending || updateAnnouncement.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>{editingAnnouncement ? "Update" : "Create"} Announcement</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteConfirmation}
        onOpenChange={(open) => !open && setDeleteConfirmation(null)}
      >
        <AlertDialogContent className="border-destructive/20 bg-card/95 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Delete Announcement
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the announcement{" "}
              <span className="font-semibold text-foreground">
                "{deleteConfirmation?.title}"
              </span>
              ?
              <br />
              <br />
              <span className="text-destructive font-medium">
                ⚠️ This action cannot be undone.
              </span>{" "}
              The announcement will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {deleteAnnouncement.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Announcement
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
