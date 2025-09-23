import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IndianRupee, Users, ShoppingCart, Wallet } from "lucide-react";

// Mock data for demonstration
const mockData = {
  totalReceived: 245000,
  totalExpenses: 180000,
  remaining: 65000,
  donations: [
    { id: 1, name: "রমেশ চন্দ্র সাহা", phone: "9876543210", village: "তেরো পাকালমেরি", amount: 5000 },
    { id: 2, name: "সুমিত্রা দেবী", phone: "9876543211", village: "দাহুতলি", amount: 3000 },
    { id: 3, name: "অমিত কুমার", phone: "9876543212", village: "তেরো পাকালমেরি", amount: 7000 },
    { id: 4, name: "মালতী রানী", phone: "9876543213", village: "দাহুতলি", amount: 2500 },
  ],
  expenses: [
    { id: 1, name: "রাজেশ দাস", expenseName: "প্রতিমা তৈরি", items: ["মাটি", "রং", "চোখ"], phone: "9876543220", amount: 45000 },
    { id: 2, name: "সুধীর সাহা", expenseName: "পণ্ডাল সাজানো", items: ["বাঁশ", "কাপড়", "লাইট"], phone: "9876543221", amount: 35000 },
    { id: 3, name: "প্রিয়া মুখার্জী", expenseName: "ভোগ প্রসাদ", items: ["চাল", "ডাল", "মিষ্টি"], phone: "9876543222", amount: 15000 },
  ]
};

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <div className="bg-gradient-festival text-white py-8 shadow-festival">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">দুর্গা পূজা সমিতি</h1>
          <p className="text-xl opacity-90">তেরো পাকালমেরি দাহুতলি</p>
          <p className="text-lg opacity-80 mt-2">আর্থিক স্বচ্ছতা ও হিসাব পত্র</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-warm border-festival-gold/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">মোট প্রাপ্ত অর্থ</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary flex items-center">
                <IndianRupee className="h-5 w-5 mr-1" />
                {mockData.totalReceived.toLocaleString('bn-BD')}
              </div>
              <p className="text-xs text-muted-foreground">দাতাদের অনুদান</p>
            </CardContent>
          </Card>

          <Card className="shadow-warm border-festival-red/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">মোট খরচ</CardTitle>
              <ShoppingCart className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive flex items-center">
                <IndianRupee className="h-5 w-5 mr-1" />
                {mockData.totalExpenses.toLocaleString('bn-BD')}
              </div>
              <p className="text-xs text-muted-foreground">পূজার ব্যয়</p>
            </CardContent>
          </Card>

          <Card className="shadow-warm border-festival-gold/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">অবশিষ্ট অর্থ</CardTitle>
              <Wallet className="h-4 w-4 text-festival-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-festival-gold flex items-center">
                <IndianRupee className="h-5 w-5 mr-1" />
                {mockData.remaining.toLocaleString('bn-BD')}
              </div>
              <p className="text-xs text-muted-foreground">হাতে নগদ</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8 justify-center">
          <Button variant="default" className="shadow-warm">
            নতুন দান যোগ করুন
          </Button>
          <Button variant="destructive" className="shadow-warm">
            নতুন খরচ যোগ করুন
          </Button>
        </div>

        {/* Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Donations */}
          <Card className="shadow-warm">
            <CardHeader>
              <CardTitle className="text-xl text-primary flex items-center">
                <Users className="mr-2 h-5 w-5" />
                দাতাদের তালিকা
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.donations.map((donation) => (
                <div key={donation.id} className="border-l-4 border-primary pl-4 py-3 bg-festival-cream/50 rounded-r-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg">{donation.name}</h4>
                      <p className="text-sm text-muted-foreground">{donation.village}</p>
                      <p className="text-sm text-muted-foreground">{donation.phone}</p>
                    </div>
                    <Badge variant="secondary" className="bg-primary text-primary-foreground">
                      <IndianRupee className="h-3 w-3 mr-1" />
                      {donation.amount.toLocaleString('bn-BD')}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Expenses */}
          <Card className="shadow-warm">
            <CardHeader>
              <CardTitle className="text-xl text-destructive flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                খরচের তালিকা
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.expenses.map((expense) => (
                <div key={expense.id} className="border-l-4 border-destructive pl-4 py-3 bg-destructive/5 rounded-r-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg">{expense.name}</h4>
                      <p className="text-sm font-medium text-destructive">{expense.expenseName}</p>
                      <p className="text-xs text-muted-foreground">{expense.items.join(", ")}</p>
                      <p className="text-sm text-muted-foreground">{expense.phone}</p>
                    </div>
                    <Badge variant="destructive">
                      <IndianRupee className="h-3 w-3 mr-1" />
                      {expense.amount.toLocaleString('bn-BD')}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 p-6 bg-card rounded-lg shadow-warm">
          <p className="text-muted-foreground">
            সকল আর্থিক লেনদেন স্বচ্ছ ও জনসাধারণের জন্য উন্মুক্ত
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            যোগাযোগ: দুর্গা পূজা সমিতি তেরো পাকালমেরি দাহুতলি
          </p>
        </div>
      </div>
    </div>
  );
}