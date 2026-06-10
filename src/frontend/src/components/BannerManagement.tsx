import { ImageIcon, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useBanner, useDeleteBanner, useSetBanner } from "../hooks/useQueries";
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

export default function BannerManagement() {
  const { data: banner, isLoading } = useBanner();
  const setBanner = useSetBanner();
  const deleteBanner = useDeleteBanner();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Revoke any previous preview URL
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!previewFile) {
      toast.error("Please select an image first");
      return;
    }
    try {
      const imageBytes = new Uint8Array(await previewFile.arrayBuffer());
      const imageBlob = ExternalBlob.fromBytes(imageBytes);
      const result = await setBanner.mutateAsync(imageBlob);
      if (result.__kind__ === "err") {
        toast.error(`Failed to upload banner: ${result.err}`);
        return;
      }
      toast.success("Banner uploaded successfully");
      setPreviewFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to upload banner: ${msg}`);
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deleteBanner.mutateAsync();
      if (result.__kind__ === "err") {
        toast.error(`Failed to remove banner: ${result.err}`);
        return;
      }
      toast.success("Banner removed successfully");
      setShowDeleteConfirm(false);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to remove banner: ${msg}`);
    }
  };

  const handleCancelPreview = () => {
    setPreviewFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Current Banner */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Current Banner
          </CardTitle>
          <CardDescription>
            The banner displayed at the top of the public home page
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : banner ? (
            <div className="space-y-4">
              <div
                className="relative rounded-lg overflow-hidden border border-primary/20"
                data-ocid="banner.current_banner"
              >
                <img
                  src={banner.image.getDirectURL()}
                  alt="Current site banner"
                  className="w-full h-auto max-h-64 object-contain bg-muted/20"
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Uploaded{" "}
                  {new Date(
                    Number(banner.createdAt) / 1_000_000,
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleteBanner.isPending}
                  data-ocid="banner.delete_button"
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Banner
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="banner.empty_state"
            >
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-1">No banner set</p>
              <p className="text-sm">
                Upload a banner image below to display it on the home page
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload New Banner */}
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Upload New Banner
          </CardTitle>
          <CardDescription>
            Accepted formats: JPG, JPEG, PNG, GIF, WebP. The banner will replace
            the current one immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File picker */}
          <button
            type="button"
            className="w-full border-2 border-dashed border-primary/30 rounded-lg p-6 text-center cursor-pointer hover:border-primary/60 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            data-ocid="banner.dropzone"
          >
            <ImageIcon className="w-10 h-10 mx-auto mb-3 text-primary/50" />
            <p className="text-sm font-medium mb-1">
              Click to select a banner image
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, JPEG, PNG, GIF or WebP
            </p>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleFileChange}
            data-ocid="banner.upload_button"
          />

          {/* Preview */}
          {previewUrl && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Preview:
              </p>
              <div className="relative rounded-lg overflow-hidden border border-primary/30">
                <img
                  src={previewUrl}
                  alt="Banner preview"
                  className="w-full h-auto max-h-64 object-contain bg-muted/20"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                File: {previewFile?.name} (
                {previewFile ? (previewFile.size / 1024).toFixed(1) : 0} KB)
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleUpload}
                  disabled={setBanner.isPending}
                  className="gap-2 flex-1 bg-primary hover:bg-primary/90"
                  data-ocid="banner.submit_button"
                >
                  {setBanner.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Banner
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelPreview}
                  disabled={setBanner.isPending}
                  data-ocid="banner.cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog
        open={showDeleteConfirm}
        onOpenChange={(open) => !open && setShowDeleteConfirm(false)}
      >
        <AlertDialogContent
          className="border-destructive/20 bg-card/95 backdrop-blur-sm"
          data-ocid="banner.dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Remove Banner
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the current banner? The home page
              will display a dark gradient background instead.
              <br />
              <br />
              <span className="text-destructive font-medium">
                ⚠️ This action cannot be undone.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="banner.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              data-ocid="banner.confirm_button"
            >
              {deleteBanner.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Removing...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Banner
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
