import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndianRupee, Users, ShoppingCart, Wallet } from "lucide-react";

// Mock data for demonstration
const mockData = {
  totalReceived: 245000,
  totalExpenses: 180000,
  remaining: 65000,
  donations: [
    { id: 1, name: "Ramesh Chandra Saha", phone: "9876543210", village: "Tero Pakalmeri", amount: 5000 },
    { id: 2, name: "Sumitra Devi", phone: "9876543211", village: "Dahutoli", amount: 3000 },
    { id: 3, name: "Amit Kumar", phone: "9876543212", village: "Tero Pakalmeri", amount: 7000 },
    { id: 4, name: "Malati Rani", phone: "9876543213", village: "Dahutoli", amount: 2500 },
  ],
  expenses: [
    { id: 1, name: "Rajesh Das", expenseName: "Idol Making", items: ["Clay", "Paint", "Eyes"], phone: "9876543220", amount: 45000 },
    { id: 2, name: "Sudhir Saha", expenseName: "Pandal Decoration", items: ["Bamboo", "Cloth", "Lights"], phone: "9876543221", amount: 35000 },
    { id: 3, name: "Priya Mukherjee", expenseName: "Food & Prasad", items: ["Rice", "Lentils", "Sweets"], phone: "9876543222", amount: 15000 },
  ]
};

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <div className="bg-gradient-festival text-white py-6 md:py-8 shadow-festival">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Durga Puja Committee</h1>
          <p className="text-lg md:text-xl opacity-90">Tero Pakalmeri Dahutoli</p>
          <p className="text-sm md:text-lg opacity-80 mt-2">Financial Transparency & Accounts</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="shadow-warm border-festival-gold/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Received</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-primary flex items-center">
                <IndianRupee className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                {mockData.totalReceived.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-muted-foreground">From donations</p>
            </CardContent>
          </Card>

          <Card className="shadow-warm border-festival-red/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
              <ShoppingCart className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-destructive flex items-center">
                <IndianRupee className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                {mockData.totalExpenses.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-muted-foreground">Puja expenses</p>
            </CardContent>
          </Card>

          <Card className="shadow-warm border-festival-gold/20 sm:col-span-2 md:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
              <Wallet className="h-4 w-4 text-festival-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-festival-gold flex items-center">
                <IndianRupee className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                {mockData.remaining.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-muted-foreground">Cash in hand</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 md:mb-8 px-4 sm:px-0 sm:justify-center">
          <Button variant="default" className="shadow-warm flex-1 sm:flex-none">
            Add New Donation
          </Button>
          <Button variant="destructive" className="shadow-warm flex-1 sm:flex-none">
            Add New Expense
          </Button>
        </div>

        {/* Transactions with Tabs */}
        <Tabs defaultValue="donations" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="donations" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Donations
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Expenses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="donations">
            <Card className="shadow-warm">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl text-primary flex items-center">
                  <Users className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Donations List
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                {mockData.donations.map((donation) => (
                  <div key={donation.id} className="border-l-4 border-primary pl-3 md:pl-4 py-3 bg-festival-cream/50 rounded-r-lg">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-base md:text-lg">{donation.name}</h4>
                        <p className="text-sm text-muted-foreground">{donation.village}</p>
                        <p className="text-sm text-muted-foreground">{donation.phone}</p>
                      </div>
                      <Badge variant="secondary" className="bg-primary text-primary-foreground self-start">
                        <IndianRupee className="h-3 w-3 mr-1" />
                        {donation.amount.toLocaleString('en-IN')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses">
            <Card className="shadow-warm">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl text-destructive flex items-center">
                  <ShoppingCart className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Expenses List
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                {mockData.expenses.map((expense) => (
                  <div key={expense.id} className="border-l-4 border-destructive pl-3 md:pl-4 py-3 bg-destructive/5 rounded-r-lg">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-base md:text-lg">{expense.name}</h4>
                        <p className="text-sm font-medium text-destructive">{expense.expenseName}</p>
                        <p className="text-xs text-muted-foreground">{expense.items.join(", ")}</p>
                        <p className="text-sm text-muted-foreground">{expense.phone}</p>
                      </div>
                      <Badge variant="destructive" className="self-start">
                        <IndianRupee className="h-3 w-3 mr-1" />
                        {expense.amount.toLocaleString('en-IN')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center mt-8 md:mt-12 p-4 md:p-6 bg-card rounded-lg shadow-warm mx-2 sm:mx-0">
          <p className="text-sm md:text-base text-muted-foreground">
            All financial transactions are transparent and open to the public
          </p>
          <p className="text-xs md:text-sm text-muted-foreground mt-2">
            Contact: Durga Puja Committee Tero Pakalmeri Dahutoli
          </p>
        </div>
      </div>
    </div>
  );
}