import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Image, 
  X, 
  Save,
  Download,
  Eye
} from "lucide-react";

interface Logo {
  id: string;
  name: string;
  type: 'partner' | 'sponsor' | 'organizer' | 'other';
  url: string;
  width: number;
  height: number;
  position: 'header' | 'footer' | 'sidebar';
  priority: number;
  is_active: boolean;
  created_at: string;
}

const LogoManager: React.FC = () => {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLogo, setEditingLogo] = useState<Logo | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'partner' as const,
    width: 200,
    height: 100,
    position: 'header' as const,
    priority: 1,
    is_active: true
  });

  const { toast } = useToast();

  useEffect(() => {
    loadLogos();
  }, []);

  const loadLogos = async () => {
    try {
      const { data, error } = await supabase
        .from('logos')
        .select('*')
        .order('priority', { ascending: true });

      if (error) throw error;
      setLogos(data || []);
    } catch (error) {
      console.error('Error loading logos:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się załadować logo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się przesłać pliku",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('logo-file') as HTMLInputElement;
    const file = fileInput?.files?.[0];
    
    if (!file) {
      toast({
        title: "Błąd",
        description: "Wybierz plik logo",
        variant: "destructive"
      });
      return;
    }

    try {
      const logoUrl = await handleFileUpload(file);
      if (!logoUrl) return;

      if (editingLogo) {
        // Update existing logo
        const { error } = await supabase
          .from('logos')
          .update({
            ...formData,
            url: logoUrl
          })
          .eq('id', editingLogo.id);

        if (error) throw error;

        toast({
          title: "Sukces!",
          description: "Logo zostało zaktualizowane",
        });
      } else {
        // Add new logo
        const { error } = await supabase
          .from('logos')
          .insert({
            ...formData,
            url: logoUrl
          });

        if (error) throw error;

        toast({
          title: "Sukces!",
          description: "Logo zostało dodane",
        });
      }

      setShowAddForm(false);
      setEditingLogo(null);
      resetForm();
      loadLogos();
    } catch (error) {
      console.error('Error saving logo:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać logo",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (logo: Logo) => {
    setEditingLogo(logo);
    setFormData({
      name: logo.name,
      type: logo.type,
      width: logo.width,
      height: logo.height,
      position: logo.position,
      priority: logo.priority,
      is_active: logo.is_active
    });
    setShowAddForm(true);
  };

  const handleDelete = async (logoId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć to logo?')) return;

    try {
      const { error } = await supabase
        .from('logos')
        .delete()
        .eq('id', logoId);

      if (error) throw error;

      toast({
        title: "Sukces!",
        description: "Logo zostało usunięte",
      });

      loadLogos();
    } catch (error) {
      console.error('Error deleting logo:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć logo",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'partner',
      width: 200,
      height: 100,
      position: 'header',
      priority: 1,
      is_active: true
    });
  };

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'partner':
        return { label: 'Partner', color: 'bg-blue-100 text-blue-800' };
      case 'sponsor':
        return { label: 'Sponsor', color: 'bg-green-100 text-green-800' };
      case 'organizer':
        return { label: 'Organizator', color: 'bg-purple-100 text-purple-800' };
      case 'other':
        return { label: 'Inne', color: 'bg-gray-100 text-gray-800' };
      default:
        return { label: 'Nieznany', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getPositionInfo = (position: string) => {
    switch (position) {
      case 'header':
        return { label: 'Nagłówek', color: 'bg-orange-100 text-orange-800' };
      case 'footer':
        return { label: 'Stopka', color: 'bg-red-100 text-red-800' };
      case 'sidebar':
        return { label: 'Bok', color: 'bg-yellow-100 text-yellow-800' };
      default:
        return { label: 'Nieznane', color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (loading) {
    return <div className="text-center py-8">Ładowanie logo...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Zarządzanie logo</CardTitle>
              <CardDescription>
                Dodawaj i zarządzaj logo partnerów, sponsorów i organizatorów
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Dodaj logo
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingLogo ? 'Edytuj logo' : 'Dodaj nowe logo'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nazwa logo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="np. Partner Główny"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Typ *</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="partner">Partner</option>
                    <option value="sponsor">Sponsor</option>
                    <option value="organizer">Organizator</option>
                    <option value="other">Inne</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="width">Szerokość (px) *</Label>
                  <Input
                    id="width"
                    type="number"
                    value={formData.width}
                    onChange={(e) => setFormData({...formData, width: parseInt(e.target.value)})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Wysokość (px) *</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: parseInt(e.target.value)})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Pozycja *</Label>
                  <select
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value as any})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="header">Nagłówek</option>
                    <option value="footer">Stopka</option>
                    <option value="sidebar">Bok</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priorytet (1-10) *</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo-file">Plik logo *</Label>
                <Input
                  id="logo-file"
                  type="file"
                  accept="image/*"
                  required={!editingLogo}
                />
                <p className="text-sm text-muted-foreground">
                  Obsługiwane formaty: JPG, PNG, SVG. Maksymalny rozmiar: 5MB
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                />
                <Label htmlFor="is_active">Aktywne</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingLogo(null);
                    resetForm();
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Anuluj
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      Przesyłanie...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingLogo ? 'Zaktualizuj' : 'Dodaj logo'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Logos List */}
      <div className="space-y-4">
        {logos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">Brak dodanych logo</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Dodaj pierwsze logo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {logos.map((logo) => {
              const typeInfo = getTypeInfo(logo.type);
              const positionInfo = getPositionInfo(logo.position);

              return (
                <Card key={logo.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{logo.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={typeInfo.color}>
                          {typeInfo.label}
                        </Badge>
                        {logo.is_active ? (
                          <Badge variant="secondary">Aktywne</Badge>
                        ) : (
                          <Badge variant="outline">Nieaktywne</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Logo Preview */}
                      <div className="flex justify-center">
                        <img
                          src={logo.url}
                          alt={logo.name}
                          className="max-w-full h-20 object-contain border rounded"
                          style={{ maxWidth: `${logo.width}px`, maxHeight: `${logo.height}px` }}
                        />
                      </div>

                      {/* Logo Details */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Wymiary:</span>
                          <span>{logo.width} × {logo.height}px</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Pozycja:</span>
                          <Badge className={positionInfo.color}>
                            {positionInfo.label}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Priorytet:</span>
                          <span>{logo.priority}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Dodano:</span>
                          <span>{new Date(logo.created_at).toLocaleDateString('pl-PL')}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4 border-t">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(logo)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edytuj
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(logo.url, '_blank')}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Podgląd
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(logo.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Usuń
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoManager;
