import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  X, 
  Edit, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Shield,
  UserCheck,
  UserX
} from "lucide-react";

interface TeamUser {
  id: string;
  team_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: 'competitor' | 'supervisor' | 'coach' | 'judge' | 'organizer';
  gender: 'male' | 'female';
  birth_date: string;
  license_number: string | null;
  medical_certificate: boolean;
  emergency_contact: string | null;
  emergency_phone: string | null;
  created_at: string;
}

interface TeamUserManagementProps {
  teamId: string;
  teamName: string;
  onClose: () => void;
}

const TeamUserManagement: React.FC<TeamUserManagementProps> = ({ teamId, teamName, onClose }) => {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<TeamUser | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'competitor' as const,
    gender: 'male' as const,
    birth_date: '',
    license_number: '',
    medical_certificate: false,
    emergency_contact: '',
    emergency_phone: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, [teamId]);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_users')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się załadować użytkowników",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        // Update existing user
        const { error } = await supabase
          .from('team_users')
          .update(formData)
          .eq('id', editingUser.id);

        if (error) throw error;

        toast({
          title: "Sukces!",
          description: "Użytkownik został zaktualizowany",
        });
      } else {
        // Add new user
        const { error } = await supabase
          .from('team_users')
          .insert({
            ...formData,
            team_id: teamId
          });

        if (error) throw error;

        toast({
          title: "Sukces!",
          description: "Użytkownik został dodany do drużyny",
        });
      }

      setShowAddForm(false);
      setEditingUser(null);
      resetForm();
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać użytkownika",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (user: TeamUser) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      gender: user.gender,
      birth_date: user.birth_date,
      license_number: user.license_number || '',
      medical_certificate: user.medical_certificate,
      emergency_contact: user.emergency_contact || '',
      emergency_phone: user.emergency_phone || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tego użytkownika?')) return;

    try {
      const { error } = await supabase
        .from('team_users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Sukces!",
        description: "Użytkownik został usunięty",
      });

      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć użytkownika",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: 'competitor',
      gender: 'male',
      birth_date: '',
      license_number: '',
      medical_certificate: false,
      emergency_contact: '',
      emergency_phone: ''
    });
  };

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'competitor':
        return { label: 'Zawodnik', color: 'bg-blue-100 text-blue-800', icon: User };
      case 'supervisor':
        return { label: 'Opiekun', color: 'bg-green-100 text-green-800', icon: Shield };
      case 'coach':
        return { label: 'Trener', color: 'bg-purple-100 text-purple-800', icon: UserCheck };
      case 'judge':
        return { label: 'Sędzia', color: 'bg-orange-100 text-orange-800', icon: UserCheck };
      case 'organizer':
        return { label: 'Organizator', color: 'bg-red-100 text-red-800', icon: UserCheck };
      default:
        return { label: 'Nieznany', color: 'bg-gray-100 text-gray-800', icon: User };
    }
  };

  const getGenderLabel = (gender: string) => {
    return gender === 'male' ? 'Mężczyzna' : 'Kobieta';
  };

  if (loading) {
    return <div className="text-center py-8">Ładowanie...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Zarządzanie użytkownikami - {teamName}</CardTitle>
              <CardDescription>
                Dodawaj i zarządzaj użytkownikami przypisanymi do tej drużyny
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                Zamknij
              </Button>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Dodaj użytkownika
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingUser ? 'Edytuj użytkownika' : 'Dodaj nowego użytkownika'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Imię *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Nazwisko *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rola *</Label>
                  <Select value={formData.role} onValueChange={(value: any) => setFormData({...formData, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz rolę" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="competitor">Zawodnik</SelectItem>
                      <SelectItem value="supervisor">Opiekun</SelectItem>
                      <SelectItem value="coach">Trener</SelectItem>
                      <SelectItem value="judge">Sędzia</SelectItem>
                      <SelectItem value="organizer">Organizator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Płeć *</Label>
                  <Select value={formData.gender} onValueChange={(value: any) => setFormData({...formData, gender: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz płeć" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Mężczyzna</SelectItem>
                      <SelectItem value="female">Kobieta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth_date">Data urodzenia *</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license_number">Numer licencji</Label>
                  <Input
                    id="license_number"
                    value={formData.license_number}
                    onChange={(e) => setFormData({...formData, license_number: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_contact">Kontakt awaryjny</Label>
                  <Input
                    id="emergency_contact"
                    value={formData.emergency_contact}
                    onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_phone">Telefon awaryjny</Label>
                  <Input
                    id="emergency_phone"
                    value={formData.emergency_phone}
                    onChange={(e) => setFormData({...formData, emergency_phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingUser(null);
                    resetForm();
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Anuluj
                </Button>
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  {editingUser ? 'Zaktualizuj' : 'Dodaj użytkownika'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      <div className="space-y-4">
        {users.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">Brak użytkowników w drużynie</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Dodaj pierwszego użytkownika
              </Button>
            </CardContent>
          </Card>
        ) : (
          users.map((user) => {
            const roleInfo = getRoleInfo(user.role);
            const RoleIcon = roleInfo.icon;

            return (
              <Card key={user.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {user.first_name} {user.last_name}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </span>
                        {user.phone && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {user.phone}
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(user.birth_date).toLocaleDateString('pl-PL')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={roleInfo.color}>
                        <RoleIcon className="h-3 w-3 mr-1" />
                        {roleInfo.label}
                      </Badge>
                      <Badge variant="secondary">
                        {getGenderLabel(user.gender)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Informacje dodatkowe</h5>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {user.license_number && (
                          <div>📄 Licencja: {user.license_number}</div>
                        )}
                        <div>🏥 Zaświadczenie: {user.medical_certificate ? 'Tak' : 'Nie'}</div>
                        {user.emergency_contact && (
                          <div>🚨 Kontakt awaryjny: {user.emergency_contact}</div>
                        )}
                        {user.emergency_phone && (
                          <div>📞 Tel. awaryjny: {user.emergency_phone}</div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Status</h5>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>📅 Dodano: {new Date(user.created_at).toLocaleDateString('pl-PL')}</div>
                        <div>👤 Rola: {roleInfo.label}</div>
                        <div>⚧ Płeć: {getGenderLabel(user.gender)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edytuj
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Usuń
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TeamUserManagement;
