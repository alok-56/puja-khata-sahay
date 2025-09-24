import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Donation {
  id: number;
  name: string;
  phone: string;
  village: string;
  amount: number;
}

interface DonationModalProps {
  donation?: Donation;
  onSave: (donation: Omit<Donation, 'id'>) => void;
  isEdit?: boolean;
}

export function DonationModal({ donation, onSave, isEdit = false }: DonationModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: donation?.name || "",
    phone: donation?.phone || "",
    village: donation?.village || "",
    amount: donation?.amount || 0,
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.village || formData.amount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all fields with valid data",
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
    setOpen(false);
    
    if (!isEdit) {
      setFormData({ name: "", phone: "", village: "", amount: 0 });
    }
    
    toast({
      title: isEdit ? "Donation Updated" : "Donation Added",
      description: `Successfully ${isEdit ? 'updated' : 'added'} donation from ${formData.name}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="default" className="shadow-warm flex-1 sm:flex-none">
            <Plus className="h-4 w-4 mr-2" />
            Add New Donation
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {isEdit ? "Edit Donation" : "Add New Donation"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Donator Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter donator name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="village">Village</Label>
            <Input
              id="village"
              value={formData.village}
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              placeholder="Enter village name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              placeholder="Enter amount"
              min="1"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {isEdit ? "Update Donation" : "Add Donation"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}