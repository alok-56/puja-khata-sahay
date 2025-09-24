import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createExpense } from "@/api";

interface Expense {
  id: number;
  name: string;
  expenseName: string;
  items: string[];
  phone: string;
  amount: number;
}

interface ExpenseModalProps {
  expense?: Expense;
  onSave: (expense: Omit<Expense, 'id'>) => void;
  isEdit?: boolean;
}

// Import your existing createExpense function
// import { createExpense } from './your-api-file';

export function ExpenseModal({ expense, onSave, isEdit = false }: ExpenseModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: expense?.name || "",
    expenseName: expense?.expenseName || "",
    items: expense?.items?.join(", ") || "",
    phone: expense?.phone || "",
    amount: expense?.amount || 0,
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.expenseName || !formData.items || !formData.phone || formData.amount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all fields with valid data",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isEdit) {
        // For edit mode, just call the onSave callback (assuming no API for edit yet)
        const expenseData = {
          ...formData,
          items: formData.items.split(",").map(item => item.trim()).filter(item => item),
        };
        onSave(expenseData);
      } else {
        // Get token from localStorage
        const token = localStorage.getItem('admin_auth_token');
        
        if (!token) {
          toast({
            title: "Authentication Error",
            description: "Please login again",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        // Prepare data for API call
        const apiData = {
          name:formData.name,
          expence_name: formData.expenseName,
          number: formData.phone,
          items: formData.items.split(",").map(item => item.trim()).filter(item => item),
          amount: formData.amount,
          village: "", // Add village field or get from form if needed
        };

        // Call your existing createExpense API
        const response = await createExpense(token, apiData);
        
        // Transform API response to match local Expense interface
        const expenseData = {
          name: formData.name, // API doesn't return name, so use form data
          expenseName: response.expence_name,
          items: response.items,
          phone: response.number,
          amount: response.amount,
        };

        onSave(expenseData);
      }

      setOpen(false);
      
      if (!isEdit) {
        setFormData({ name: "", expenseName: "", items: "", phone: "", amount: 0 });
      }
      
      toast({
        title: isEdit ? "Expense Updated" : "Expense Added",
        description: `Successfully ${isEdit ? 'updated' : 'added'} expense: ${formData.expenseName}`,
      });

    } catch (error) {
      console.error('Error saving expense:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save expense",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="sm" disabled={isLoading}>
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="destructive" className="shadow-warm flex-1 sm:flex-none" disabled={isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Expense
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {isEdit ? "Edit Expense" : "Add New Expense"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Person Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter person name"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expenseName">Expense Name</Label>
            <Input
              id="expenseName"
              value={formData.expenseName}
              onChange={(e) => setFormData({ ...formData, expenseName: e.target.value })}
              placeholder="Enter expense category"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="items">Items (comma separated)</Label>
            <Textarea
              id="items"
              value={formData.items}
              onChange={(e) => setFormData({ ...formData, items: e.target.value })}
              placeholder="Enter items separated by commas"
              required
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Updating..." : "Adding..."}
              </>
            ) : (
              isEdit ? "Update Expense" : "Add Expense"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}