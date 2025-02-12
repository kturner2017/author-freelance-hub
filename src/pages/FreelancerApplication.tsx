
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PlusCircle, MinusCircle } from 'lucide-react';

const expertiseAreas = [
  'editing',
  'cover_design',
  'marketing',
  'ghostwriting',
  'illustration',
  'formatting',
  'proofreading'
] as const;

const FreelancerApplication = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    headline: '',
    bio: '',
    expertiseAreas: [] as typeof expertiseAreas[number][],
    skills: [''],
    hourlyRate: '',
    portfolioLinks: [''],
    education: [''],
    experience: ['']
  });

  const handleArrayInputChange = (
    field: 'skills' | 'portfolioLinks' | 'education' | 'experience',
    index: number,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item))
    }));
  };

  const addArrayItem = (field: 'skills' | 'portfolioLinks' | 'education' | 'experience') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'skills' | 'portfolioLinks' | 'education' | 'experience', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to submit your application");
        navigate('/auth');
        return;
      }

      const { error } = await supabase.from('freelancers').insert({
        user_id: user.id,
        full_name: formData.fullName,
        email: formData.email,
        headline: formData.headline,
        bio: formData.bio,
        expertise_areas: formData.expertiseAreas,
        skills: formData.skills.filter(Boolean),
        hourly_rate: parseFloat(formData.hourlyRate),
        portfolio_links: formData.portfolioLinks.filter(Boolean),
        education: formData.education.filter(Boolean),
        experience: formData.experience.filter(Boolean)
      });

      if (error) throw error;

      toast.success("Application submitted successfully!");
      navigate('/professional-network');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-serif font-bold text-primary mb-8">
          Freelancer Application
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="headline">Professional Headline</Label>
              <Input
                id="headline"
                placeholder="e.g., Professional Book Editor with 5+ years experience"
                value={formData.headline}
                onChange={e => setFormData(prev => ({ ...prev, headline: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                required
                className="min-h-[150px]"
              />
            </div>
          </div>

          {/* Expertise Areas */}
          <div>
            <Label>Areas of Expertise</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {expertiseAreas.map(area => (
                <label key={area} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.expertiseAreas.includes(area)}
                    onChange={e => {
                      setFormData(prev => ({
                        ...prev,
                        expertiseAreas: e.target.checked
                          ? [...prev.expertiseAreas, area]
                          : prev.expertiseAreas.filter(a => a !== area)
                      }));
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="capitalize">{area.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <Label>Skills</Label>
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Input
                  value={skill}
                  onChange={e => handleArrayInputChange('skills', index, e.target.value)}
                  placeholder="e.g., Manuscript Editing"
                />
                {index === formData.skills.length - 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => addArrayItem('skills')}
                  >
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeArrayItem('skills', index)}
                  >
                    <MinusCircle className="h-5 w-5" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Hourly Rate */}
          <div>
            <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
            <Input
              id="hourlyRate"
              type="number"
              min="0"
              step="0.01"
              value={formData.hourlyRate}
              onChange={e => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
              required
            />
          </div>

          {/* Portfolio Links */}
          <div>
            <Label>Portfolio Links</Label>
            {formData.portfolioLinks.map((link, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Input
                  value={link}
                  onChange={e => handleArrayInputChange('portfolioLinks', index, e.target.value)}
                  placeholder="https://..."
                  type="url"
                />
                {index === formData.portfolioLinks.length - 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => addArrayItem('portfolioLinks')}
                  >
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeArrayItem('portfolioLinks', index)}
                  >
                    <MinusCircle className="h-5 w-5" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Education */}
          <div>
            <Label>Education</Label>
            {formData.education.map((edu, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Input
                  value={edu}
                  onChange={e => handleArrayInputChange('education', index, e.target.value)}
                  placeholder="e.g., BA in English Literature"
                />
                {index === formData.education.length - 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => addArrayItem('education')}
                  >
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeArrayItem('education', index)}
                  >
                    <MinusCircle className="h-5 w-5" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Experience */}
          <div>
            <Label>Professional Experience</Label>
            {formData.experience.map((exp, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <Input
                  value={exp}
                  onChange={e => handleArrayInputChange('experience', index, e.target.value)}
                  placeholder="e.g., Senior Editor at Publishing House (2018-2022)"
                />
                {index === formData.experience.length - 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => addArrayItem('experience')}
                  >
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeArrayItem('experience', index)}
                  >
                    <MinusCircle className="h-5 w-5" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default FreelancerApplication;
