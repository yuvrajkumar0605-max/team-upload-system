import {
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import { useCheckTeamLogoExists, useUploadTeamLogo } from "../hooks/useQueries";

export default function TeamLogoUploadPage() {
  const [teamName, setTeamName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const uploadTeamLogo = useUploadTeamLogo();
  const checkTeamLogoExists = useCheckTeamLogoExists();

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setLogoFile(file);
      setUploadSuccess(false);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!teamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    if (!logoFile) {
      toast.error("Please select a logo image");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Check if team logo already exists
      const exists = await checkTeamLogoExists.mutateAsync(teamName.trim());
      if (exists) {
        toast.error(
          "A logo for this team name already exists. Please use a different team name.",
        );
        setIsUploading(false);
        return;
      }

      // Convert file to bytes
      const arrayBuffer = await logoFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      // Create ExternalBlob with progress tracking
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress(
        (percentage) => {
          setUploadProgress(percentage);
        },
      );

      // Upload to backend
      await uploadTeamLogo.mutateAsync({
        teamName: teamName.trim(),
        logo: blob,
        fileSize: BigInt(logoFile.size),
      });

      setUploadProgress(100);
      setUploadSuccess(true);
      toast.success("Team logo uploaded successfully!");

      // Reset form after 2 seconds
      setTimeout(() => {
        setTeamName("");
        setLogoFile(null);
        setLogoPreview(null);
        setUploadProgress(0);
        setUploadSuccess(false);
      }, 2000);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload logo. Please try again.");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] py-12 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-black mb-3 glow-text">
            Team Logo Upload
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload your team logo for the Battle of Supremacy tournament
          </p>
        </div>

        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Upload Team Logo
            </CardTitle>
            <CardDescription>
              Submit your team name and logo. Each team can only upload one
              logo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Team Name Input */}
              <div className="space-y-2">
                <Label htmlFor="teamName" className="text-base font-medium">
                  Team Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="teamName"
                  type="text"
                  placeholder="Enter your team name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  disabled={isUploading}
                  className="text-base"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Enter the exact name of your team
                </p>
              </div>

              {/* Logo Upload */}
              <div className="space-y-2">
                <Label htmlFor="logoFile" className="text-base font-medium">
                  Team Logo <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <Input
                      id="logoFile"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      className="cursor-pointer"
                      required
                    />
                  </div>
                  {logoPreview && (
                    <div className="relative w-full max-w-xs mx-auto">
                      <div className="aspect-square rounded-lg border-2 border-primary/30 overflow-hidden bg-primary/5 p-4">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-sm text-center text-muted-foreground mt-2">
                        Logo Preview
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Supported formats: JPG, PNG, GIF. Max size: 5MB
                </p>
              </div>

              {/* Upload Progress */}
              {isUploading && uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uploading...</span>
                    <span className="font-medium text-primary">
                      {uploadProgress}%
                    </span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {/* Success Message */}
              {uploadSuccess && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-500">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">
                    Logo uploaded successfully!
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isUploading || !teamName.trim() || !logoFile}
                className="w-full gap-2 text-base py-6"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Logo
                  </>
                )}
              </Button>
            </form>

            {/* Info Box */}
            <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-foreground">
                    Important Notes:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Each team can only upload one logo</li>
                    <li>Make sure your team name is spelled correctly</li>
                    <li>Logo should be clear and high quality</li>
                    <li>Duplicate team names are not allowed</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
