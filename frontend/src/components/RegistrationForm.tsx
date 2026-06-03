import { useState, useCallback, useMemo } from 'react';
import { useSubmitRegistration, useGetRegistrationStatus, useGetRegistrationSummary } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';
import type { TeamMember, CaptainInfo } from '../backend';

export default function RegistrationForm() {
  const [teamName, setTeamName] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [captainPhone, setCaptainPhone] = useState('');
  const [members, setMembers] = useState<TeamMember[]>([{ name: '', playerId: '' }]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const submitRegistration = useSubmitRegistration();
  const { data: isRegistrationOpen = true, isLoading: statusLoading } = useGetRegistrationStatus();
  const { data: summary, isLoading: summaryLoading } = useGetRegistrationSummary();

  // Memoized validation function
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!teamName?.trim()) {
      errors.teamName = 'Team name is required';
    }
    if (!captainName?.trim()) {
      errors.captainName = 'Captain name is required';
    }
    if (!captainPhone?.trim()) {
      errors.captainPhone = 'Captain phone is required';
    } else if (!/^[\d\s\-+()]+$/.test(captainPhone)) {
      errors.captainPhone = 'Please enter a valid phone number';
    }
    if (!logoFile) {
      errors.logo = 'Team logo is required';
    }
    if (members.length === 0 || !members.some((m) => m.name?.trim())) {
      errors.members = 'At least one team member is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [teamName, captainName, captainPhone, logoFile, members]);

  const handleLogoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setValidationErrors(prev => ({ ...prev, logo: 'Please select an image file' }));
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setValidationErrors(prev => ({ ...prev, logo: 'Image size must be less than 5MB' }));
      return;
    }

    setLogoFile(file);
    setValidationErrors(prev => {
      const { logo, ...rest } = prev;
      return rest;
    });

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.onerror = () => {
      setValidationErrors(prev => ({ ...prev, logo: 'Failed to load image preview' }));
    };
    reader.readAsDataURL(file);
  }, []);

  const addMember = useCallback(() => {
    setMembers(prev => [...prev, { name: '', playerId: '' }]);
  }, []);

  const removeMember = useCallback((index: number) => {
    setMembers(prev => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const updateMember = useCallback((index: number, field: 'name' | 'playerId', value: string) => {
    setMembers(prev => {
      const updated = [...prev];
      if (field === 'playerId') {
        updated[index] = { ...updated[index], playerId: value || undefined };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setValidationErrors({});

    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    try {
      // Convert logo to bytes with progress tracking
      const arrayBuffer = await logoFile!.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const logoBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const captain: CaptainInfo = {
        name: captainName.trim(),
        phone: captainPhone.trim(),
      };

      const validMembers = members
        .filter((m) => m.name?.trim())
        .map((m) => ({
          name: m.name.trim(),
          playerId: m.playerId?.trim() || undefined,
        }));

      await submitRegistration.mutateAsync({
        teamName: teamName.trim(),
        logo: logoBlob,
        captain,
        members: validMembers,
      });

      toast.success('Registration submitted successfully! Your team has been approved.');
      setIsSubmitted(true);

      // Reset form
      setTeamName('');
      setCaptainName('');
      setCaptainPhone('');
      setMembers([{ name: '', playerId: '' }]);
      setLogoFile(null);
      setLogoPreview('');
      setUploadProgress(0);
      setValidationErrors({});
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to submit registration';
      
      // Handle specific error messages gracefully
      if (errorMessage.includes('already registered')) {
        toast.error('You have already registered a team');
      } else if (errorMessage.includes('Registrations are full')) {
        toast.error('Registrations are full. Please try again later.');
      } else if (errorMessage.includes('Registration is closed')) {
        toast.error('Registration is currently closed');
      } else if (errorMessage.includes('Team name already registered')) {
        toast.error('This team name is already taken. Please choose a different name.');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    }
  }, [validateForm, logoFile, captainName, captainPhone, teamName, members, submitRegistration]);

  // Memoized computed values
  const { totalTeams, maxTeams, isLimitReached } = useMemo(() => {
    const total = summary ? Number(summary.totalTeams) : 0;
    const max = summary?.maxTeams !== undefined ? Number(summary.maxTeams) : null;
    const limitReached = max !== null && total >= max;
    return { totalTeams: total, maxTeams: max, isLimitReached: limitReached };
  }, [summary]);

  if (statusLoading || summaryLoading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading registration form...</p>
          </div>
        </div>
      </section>
    );
  }

  if (isSubmitted) {
    return (
      <section className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto text-center border-primary/50 glow-primary">
          <CardContent className="pt-12 pb-12">
            <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Registration Successful!</h2>
            <p className="text-muted-foreground mb-6">
              Your team has been registered and automatically approved for the BOOYAH Battle of Supremacy tournament. Good luck!
            </p>
            <Button onClick={() => setIsSubmitted(false)} variant="outline">
              Register Another Team
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!isRegistrationOpen) {
    return (
      <section className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto border-yellow-500/50">
          <CardContent className="pt-12 pb-12">
            <Alert className="border-yellow-500/50 bg-yellow-500/10">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <AlertTitle className="text-yellow-500 text-xl font-bold">Registration is Currently Closed</AlertTitle>
              <AlertDescription className="text-muted-foreground mt-2">
                Team registration for the BOOYAH Battle of Supremacy is currently closed. Please check back later or contact the tournament organizers for more information.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (isLimitReached) {
    return (
      <section className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto border-red-500/50">
          <CardContent className="pt-12 pb-12">
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <AlertTitle className="text-red-500 text-xl font-bold">Registrations are Full</AlertTitle>
              <AlertDescription className="text-muted-foreground mt-2">
                We have reached the maximum number of team registrations ({maxTeams}) for the BOOYAH Battle of Supremacy tournament. Registration is now closed.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Team Registration</CardTitle>
          <CardDescription>
            Fill out the form below to register your team
            {maxTeams !== null ? (
              <span className="block mt-1 text-primary font-medium">
                {totalTeams} / {maxTeams} teams registered
              </span>
            ) : (
              <span className="block mt-1 text-primary font-medium">
                {totalTeams} teams registered
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Name */}
            <div className="space-y-2">
              <Label htmlFor="teamName">
                Team Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="teamName"
                value={teamName}
                onChange={(e) => {
                  setTeamName(e.target.value);
                  setValidationErrors(prev => {
                    const { teamName, ...rest } = prev;
                    return rest;
                  });
                }}
                placeholder="Enter your team name"
                className={validationErrors.teamName ? 'border-destructive' : ''}
              />
              {validationErrors.teamName && (
                <p className="text-sm text-destructive">{validationErrors.teamName}</p>
              )}
            </div>

            {/* Team Logo */}
            <div className="space-y-2">
              <Label htmlFor="logo">
                Team Logo <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className={`cursor-pointer ${validationErrors.logo ? 'border-destructive' : ''}`}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Max size: 5MB</p>
                  {validationErrors.logo && (
                    <p className="text-sm text-destructive mt-1">{validationErrors.logo}</p>
                  )}
                </div>
                {logoPreview && (
                  <div className="w-24 h-24 border-2 border-border rounded-lg overflow-hidden bg-muted">
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Captain Info */}
            <div className="space-y-4 border-t border-border pt-6">
              <h3 className="text-lg font-semibold">Captain Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="captainName">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="captainName"
                    value={captainName}
                    onChange={(e) => {
                      setCaptainName(e.target.value);
                      setValidationErrors(prev => {
                        const { captainName, ...rest } = prev;
                        return rest;
                      });
                    }}
                    placeholder="Captain's name"
                    className={validationErrors.captainName ? 'border-destructive' : ''}
                  />
                  {validationErrors.captainName && (
                    <p className="text-sm text-destructive">{validationErrors.captainName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="captainPhone">
                    Phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="captainPhone"
                    type="tel"
                    value={captainPhone}
                    onChange={(e) => {
                      setCaptainPhone(e.target.value);
                      setValidationErrors(prev => {
                        const { captainPhone, ...rest } = prev;
                        return rest;
                      });
                    }}
                    placeholder="+1234567890"
                    className={validationErrors.captainPhone ? 'border-destructive' : ''}
                  />
                  {validationErrors.captainPhone && (
                    <p className="text-sm text-destructive">{validationErrors.captainPhone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="space-y-4 border-t border-border pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Team Members</h3>
                <Button type="button" onClick={addMember} size="sm" variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Member
                </Button>
              </div>
              <div className="space-y-3">
                {members.map((member, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 grid sm:grid-cols-2 gap-2">
                      <Input
                        value={member.name}
                        onChange={(e) => updateMember(index, 'name', e.target.value)}
                        placeholder="Player name"
                      />
                      <Input
                        value={member.playerId || ''}
                        onChange={(e) => updateMember(index, 'playerId', e.target.value)}
                        placeholder="Player ID (optional)"
                      />
                    </div>
                    {members.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeMember(index)}
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {validationErrors.members && (
                <p className="text-sm text-destructive">{validationErrors.members}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={submitRegistration.isPending}
            >
              {submitRegistration.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Registration'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
