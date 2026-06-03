import { useState, useEffect } from 'react';
import { useGetSocialMediaLinks, useUpdateSocialMediaLinks } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { SiInstagram, SiDiscord, SiYoutube } from 'react-icons/si';
import { MessageCircle, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import type { SocialMediaLinks } from '../backend';

export default function SocialLinksManagement() {
  const { data: socialLinks, isLoading } = useGetSocialMediaLinks();
  const updateLinks = useUpdateSocialMediaLinks();

  const [formData, setFormData] = useState<SocialMediaLinks>({
    instagram: undefined,
    discord: undefined,
    youtube: undefined,
    whatsapp: undefined,
  });

  useEffect(() => {
    if (socialLinks) {
      setFormData(socialLinks);
    }
  }, [socialLinks]);

  const handleInputChange = (field: keyof SocialMediaLinks, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.trim() === '' ? undefined : value.trim(),
    }));
  };

  const handleSave = async () => {
    try {
      await updateLinks.mutateAsync(formData);
      toast.success('Social media links updated successfully');
    } catch (error: any) {
      toast.error(`Failed to update links: ${error.message}`);
    }
  };

  const handleReset = () => {
    if (socialLinks) {
      setFormData(socialLinks);
      toast.info('Form reset to saved values');
    }
  };

  const isUrlValid = (url: string | undefined): boolean => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(socialLinks);
  const allUrlsValid = 
    isUrlValid(formData.instagram) &&
    isUrlValid(formData.discord) &&
    isUrlValid(formData.youtube) &&
    isUrlValid(formData.whatsapp);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading social links...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Social Media Links</CardTitle>
        <CardDescription>
          Manage social media links displayed in the footer and homepage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Instagram */}
          <div className="space-y-2">
            <Label htmlFor="instagram" className="flex items-center gap-2">
              <SiInstagram className="w-4 h-4 text-pink-500" />
              Instagram
            </Label>
            <Input
              id="instagram"
              type="url"
              placeholder="https://instagram.com/yourprofile"
              value={formData.instagram || ''}
              onChange={(e) => handleInputChange('instagram', e.target.value)}
              className={!isUrlValid(formData.instagram) ? 'border-destructive' : ''}
            />
            {formData.instagram && !isUrlValid(formData.instagram) && (
              <p className="text-xs text-destructive">Please enter a valid URL</p>
            )}
          </div>

          {/* Discord */}
          <div className="space-y-2">
            <Label htmlFor="discord" className="flex items-center gap-2">
              <SiDiscord className="w-4 h-4 text-indigo-500" />
              Discord
            </Label>
            <Input
              id="discord"
              type="url"
              placeholder="https://discord.gg/yourinvite"
              value={formData.discord || ''}
              onChange={(e) => handleInputChange('discord', e.target.value)}
              className={!isUrlValid(formData.discord) ? 'border-destructive' : ''}
            />
            {formData.discord && !isUrlValid(formData.discord) && (
              <p className="text-xs text-destructive">Please enter a valid URL</p>
            )}
          </div>

          {/* YouTube */}
          <div className="space-y-2">
            <Label htmlFor="youtube" className="flex items-center gap-2">
              <SiYoutube className="w-4 h-4 text-red-500" />
              YouTube
            </Label>
            <Input
              id="youtube"
              type="url"
              placeholder="https://youtube.com/@yourchannel"
              value={formData.youtube || ''}
              onChange={(e) => handleInputChange('youtube', e.target.value)}
              className={!isUrlValid(formData.youtube) ? 'border-destructive' : ''}
            />
            {formData.youtube && !isUrlValid(formData.youtube) && (
              <p className="text-xs text-destructive">Please enter a valid URL</p>
            )}
          </div>

          {/* WhatsApp */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-500" />
              WhatsApp
            </Label>
            <Input
              id="whatsapp"
              type="url"
              placeholder="https://wa.me/1234567890"
              value={formData.whatsapp || ''}
              onChange={(e) => handleInputChange('whatsapp', e.target.value)}
              className={!isUrlValid(formData.whatsapp) ? 'border-destructive' : ''}
            />
            {formData.whatsapp && !isUrlValid(formData.whatsapp) && (
              <p className="text-xs text-destructive">Please enter a valid URL</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-primary/20">
          <p className="text-sm text-muted-foreground">
            Leave fields empty to hide specific social media links
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!hasChanges || updateLinks.isPending}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || !allUrlsValid || updateLinks.isPending}
            >
              {updateLinks.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
