// import { useState, useEffect, useCallback, useRef } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { LoginModal } from "@/components/LoginModal";
// import { DonationModal } from "@/components/DonationModal";
// import { ExpenseModal } from "@/components/ExpenseModal";
// import {
//   IndianRupee,
//   Users,
//   ShoppingCart,
//   Wallet,
//   Trash2,
//   Search,
//   Loader2,
//   ChevronLeft,
//   ChevronRight,
//   Download,
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { deleteInvoice, fetchSummary, getInvoices, updateInvoice } from "@/api";

// interface Invoice {
//   _id: string;
//   name?: string;
//   expence_name?: string;
//   number: string;
//   items: string[];
//   amount: number;
//   due: number;
//   village: string;
//   invoice_type: "donation" | "expence";
//   createdAt: string;
//   updatedAt: string;
// }

// interface SummaryResponse {
//   totalReceived: number;
//   totalExpenses: number;
//   remaining: number;
//   totaldue: number;
// }

// export function Dashboard() {
//   const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState("donations");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSummaryLoading, setIsSummaryLoading] = useState(false);

//   // API Data State
//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [summary, setSummary] = useState<SummaryResponse>({
//     totalReceived: 0,
//     totalExpenses: 0,
//     remaining: 0,
//     totaldue: 0,
//   });

//   // Pagination State
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const limit = 10;

//   // Ref to maintain search input focus
//   const searchInputRef = useRef<HTMLInputElement>(null);
//   const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   const { toast } = useToast();

//   // Fetch summary data - No token needed
//   const loadSummary = useCallback(async () => {
//     setIsSummaryLoading(true);
//     try {
//       const summaryData = await fetchSummary();
//       if (summaryData) {
//         setSummary(summaryData);
//       }
//     } catch (error) {
//       console.error("Error loading summary:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load summary data",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSummaryLoading(false);
//     }
//   }, [toast]);

//   // Fetch invoices with pagination and filters - No token needed
//   const loadInvoices = useCallback(
//     async (page = 1, search = "", type?: "donation" | "expence") => {
//       setIsLoading(true);
//       try {
//         const response = await getInvoices({
//           page,
//           limit,
//           type,
//           name: search || undefined,
//         });

//         setInvoices(response.invoices);
//         setCurrentPage(response.page);
//         setTotalPages(response.totalPages);
//         setTotalItems(response.total);
//       } catch (error) {
//         console.error("Error loading invoices:", error);
//         toast({
//           title: "Error",
//           description: "Failed to load data",
//           variant: "destructive",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [toast]
//   );

//   // Load data when component mounts or dependencies change
//   useEffect(() => {
//     loadSummary();
//     loadInvoices(
//       1,
//       searchTerm,
//       activeTab === "donations" ? "donation" : "expence"
//     );
//   }, [activeTab, loadSummary]);

//   // Debounced search effect with focus preservation
//   useEffect(() => {
//     // Clear existing timeout
//     if (debounceTimeoutRef.current) {
//       clearTimeout(debounceTimeoutRef.current);
//     }

//     // Set new timeout
//     debounceTimeoutRef.current = setTimeout(() => {
//       setCurrentPage(1);
//       loadInvoices(
//         1,
//         searchTerm,
//         activeTab === "donations" ? "donation" : "expence"
//       );
//     }, 500);

//     // Cleanup function
//     return () => {
//       if (debounceTimeoutRef.current) {
//         clearTimeout(debounceTimeoutRef.current);
//       }
//     };
//   }, [searchTerm, activeTab, loadInvoices]);

//   const handleLogin = (isAdmin: boolean) => {
//     setIsAdminLoggedIn(isAdmin);
//   };

//   const handleLogout = () => {
//     setIsAdminLoggedIn(false);
//     // Don't clear invoices and summary on logout since they're publicly accessible
//   };

//   const handleAddDonation = (newDonation: any) => {
//     // Refresh data after adding
//     loadSummary();
//     loadInvoices(
//       currentPage,
//       searchTerm,
//       activeTab === "donations" ? "donation" : "expence"
//     );
//   };

//   const handleEditDonation = async (donation: Invoice, updatedData: any) => {
//     const token = localStorage.getItem("admin_auth_token");
//     if (!token) return;

//     try {
//       // Map form data to API format
//       const apiData = {
//         name: updatedData.name,
//         number: updatedData.phone,
//         items: [],
//         amount: updatedData.amount,
//         due: updatedData.due,
//         village: updatedData.village,
//       };

//       await updateInvoice(token, donation._id, apiData);

//       toast({
//         title: "Donation Updated",
//         description: `Successfully updated donation from ${updatedData.name}`,
//       });

//       // Refresh data
//       loadSummary();
//       loadInvoices(currentPage, searchTerm, "donation");
//     } catch (error) {
//       toast({
//         title: "Update Failed",
//         description:
//           error instanceof Error ? error.message : "Failed to update donation",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleDeleteDonation = async (donationId: string) => {
//     const token = localStorage.getItem("admin_auth_token");
//     if (!token) return;

//     if (!confirm("Are you sure you want to delete this donation?")) return;

//     try {
//       await deleteInvoice(token, donationId);

//       toast({
//         title: "Donation Deleted",
//         description: "Donation has been successfully deleted",
//       });

//       // Refresh data
//       loadSummary();
//       loadInvoices(currentPage, searchTerm, "donation");
//     } catch (error) {
//       toast({
//         title: "Delete Failed",
//         description:
//           error instanceof Error ? error.message : "Failed to delete donation",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleAddExpense = (newExpense: any) => {
//     // Refresh data after adding
//     loadSummary();
//     loadInvoices(
//       currentPage,
//       searchTerm,
//       activeTab === "donations" ? "donation" : "expence"
//     );
//   };

//   const handleEditExpense = async (expense: Invoice, updatedData: any) => {
//     const token = localStorage.getItem("admin_auth_token");
//     if (!token) return;

//     try {
//       // Map form data to API format
//       const apiData = {
//         expence_name: updatedData.expenseName,
//         number: updatedData.phone,
//         items: updatedData.items,
//         amount: updatedData.amount,
//         village: updatedData.village || expense.village,
//       };

//       await updateInvoice(token, expense._id, apiData);

//       toast({
//         title: "Expense Updated",
//         description: `Successfully updated expense: ${updatedData.expenseName}`,
//       });

//       // Refresh data
//       loadSummary();
//       loadInvoices(currentPage, searchTerm, "expence");
//     } catch (error) {
//       toast({
//         title: "Update Failed",
//         description:
//           error instanceof Error ? error.message : "Failed to update expense",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleDeleteExpense = async (expenseId: string) => {
//     const token = localStorage.getItem("admin_auth_token");
//     if (!token) return;

//     if (!confirm("Are you sure you want to delete this expense?")) return;

//     try {
//       await deleteInvoice(token, expenseId);

//       toast({
//         title: "Expense Deleted",
//         description: "Expense has been successfully deleted",
//       });

//       // Refresh data
//       loadSummary();
//       loadInvoices(currentPage, searchTerm, "expence");
//     } catch (error) {
//       toast({
//         title: "Delete Failed",
//         description:
//           error instanceof Error ? error.message : "Failed to delete expense",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleTabChange = (tab: string) => {
//     setActiveTab(tab);
//     setCurrentPage(1);
//     setSearchTerm("");
//   };

//   const handlePageChange = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//       loadInvoices(
//         page,
//         searchTerm,
//         activeTab === "donations" ? "donation" : "expence"
//       );
//     }
//   };

//   // Handle search input change with focus preservation
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setSearchTerm(value);

//     // Preserve cursor position and focus
//     requestAnimationFrame(() => {
//       if (searchInputRef.current) {
//         const cursorPosition = e.target.selectionStart || 0;
//         searchInputRef.current.focus();
//         searchInputRef.current.setSelectionRange(
//           cursorPosition,
//           cursorPosition
//         );
//       }
//     });
//   };

//   // Generate PDF report
//   const generatePDF = async () => {
//     const printWindow = window.open("", "_blank");
//     if (!printWindow) return;

//     // Show loading in the new window
//     printWindow.document.write(`
//       <html>
//         <body style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
//           <div style="text-align: center;">
//             <div style="border: 4px solid #f3f3f3; border-top: 4px solid #8B5CF6; border-radius: 50%; width: 50px; height: 50px; animation: spin 2s linear infinite; margin: 0 auto 20px;"></div>
//             <p>Generating PDF report... Please wait</p>
//             <style>
//               @keyframes spin {
//                 0% { transform: rotate(0deg); }
//                 100% { transform: rotate(360deg); }
//               }
//             </style>
//           </div>
//         </body>
//       </html>
//     `);

//     try {
//       // Fetch all data for PDF export
//       const response = await getInvoices({
//         type: activeTab === "donations" ? "donation" : "expence",
//         name: searchTerm || undefined,
//         full: true, // This will get all matching records, not just current page
//       });

//       const allData = response.invoices.filter((invoice) =>
//         activeTab === "donations"
//           ? invoice.invoice_type === "donation"
//           : invoice.invoice_type === "expence"
//       );

//       const title =
//         activeTab === "donations" ? "Donations Report" : "Expenses Report";
//       const totalAmount = allData.reduce((sum, item) => sum + item.amount, 0);

//       const html = `
//         <!DOCTYPE html>
//         <html>
//           <head>
//             <title>${title} - Durga Puja Committee</title>
//             <style>
//               body {
//                 font-family: Arial, sans-serif;
//                 margin: 20px;
//                 color: #333;
//               }
//               .header {
//                 text-align: center;
//                 margin-bottom: 30px;
//                 border-bottom: 2px solid #8B5CF6;
//                 padding-bottom: 20px;
//               }
//               .header h1 {
//                 color: #8B5CF6;
//                 margin: 0;
//                 font-size: 24px;
//               }
//               .header h2 {
//                 color: #666;
//                 margin: 5px 0;
//                 font-size: 18px;
//               }
//               .header p {
//                 color: #888;
//                 margin: 5px 0;
//               }
//               .summary {
//                 background: #f8f9fa;
//                 padding: 15px;
//                 border-radius: 8px;
//                 margin-bottom: 20px;
//                 border-left: 4px solid #8B5CF6;
//               }
//               .summary h3 {
//                 margin: 0 0 10px 0;
//                 color: #8B5CF6;
//               }
//               table {
//                 width: 100%;
//                 border-collapse: collapse;
//                 margin-top: 20px;
//               }
//               th, td {
//                 border: 1px solid #ddd;
//                 padding: 12px;
//                 text-align: left;
//               }
//               th {
//                 background-color: #8B5CF6;
//                 color: white;
//                 font-weight: bold;
//               }
//               tr:nth-child(even) {
//                 background-color: #f9f9f9;
//               }
//               tr:hover {
//                 background-color: #f5f5f5;
//               }
//               .amount {
//                 font-weight: bold;
//                 color: #8B5CF6;
//               }
//               .due-amount {
//                 font-weight: bold;
//                 color: #dc3545;
//               }
//               .footer {
//                 margin-top: 30px;
//                 text-align: center;
//                 color: #666;
//                 border-top: 1px solid #ddd;
//                 padding-top: 20px;
//               }
//               .total-row {
//                 background-color: #e9ecef !important;
//                 font-weight: bold;
//               }
//               .total-row td {
//                 border-top: 2px solid #8B5CF6;
//               }
//               .date {
//                 color: #666;
//                 font-size: 12px;
//               }
//               @media print {
//                 body { margin: 0; }
//                 .no-print { display: none; }
//               }
//             </style>
//           </head>
//           <body>
//             <div class="header">
//               <h1>Durga Puja Committee</h1>
//               <h2>Tero Pakalmeri Dahutoli</h2>
//               <p><strong>${title}</strong></p>
//               <p class="date">Generated on: ${new Date().toLocaleDateString(
//                 "en-IN",
//                 {
//                   year: "numeric",
//                   month: "long",
//                   day: "numeric",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 }
//               )}</p>
//             </div>

//             <div class="summary">
//               <h3>Summary</h3>
//               <p><strong>Total Received:</strong> ₹${summary.totalReceived.toLocaleString(
//                 "en-IN"
//               )}</p>
//               <p><strong>Total Expenses:</strong> ₹${summary.totalExpenses.toLocaleString(
//                 "en-IN"
//               )}</p>
//               <p><strong>Remaining Balance:</strong> ₹${summary.remaining.toLocaleString(
//                 "en-IN"
//               )}</p>
//               <p><strong>Total ${activeTab}:</strong> ₹${totalAmount.toLocaleString(
//         "en-IN"
//       )} (${allData.length} entries)</p>
//               ${
//                 activeTab === "donations"
//                   ? `
//               <p><strong>Total Due:</strong> ₹${allData
//                 .reduce((sum, item) => sum + (item.due || 0), 0)
//                 .toLocaleString("en-IN")}</p>
//               `
//                   : ""
//               }
//             </div>

//             <table>
//               <thead>
//                 <tr>
//                   <th>S.No.</th>
//                   <th>${
//                     activeTab === "donations" ? "Donor Name" : "Vendor/Purpose"
//                   }</th>
//                   ${activeTab === "expenses" ? "<th>Expense Type</th>" : ""}
//                   <th>Village</th>
//                   <th>Phone</th>
//                   ${activeTab === "expenses" ? "<th>Items</th>" : ""}
//                   <th>Amount (₹)</th>
//                   ${activeTab === "donations" ? "<th>Due (₹)</th>" : ""}
//                   <th>Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${allData
//                   .map((item, index) => {
//                     const due = item.due || 0;

//                     return `
//                       <tr>
//                         <td>${index + 1}</td>
//                         <td>${
//                           item.name ||
//                           (activeTab === "donations" ? "Anonymous" : "Unknown")
//                         }</td>
//                         ${
//                           activeTab === "expenses"
//                             ? `<td>${
//                                 item.expence_name || "General Expense"
//                               }</td>`
//                             : ""
//                         }
//                         <td>${item.village}</td>
//                         <td>${item.number}</td>
//                         ${
//                           activeTab === "expenses"
//                             ? `<td>${item.items.join(", ") || "N/A"}</td>`
//                             : ""
//                         }
//                         <td class="amount">₹${item.amount.toLocaleString(
//                           "en-IN"
//                         )}</td>
//                         ${
//                           activeTab === "donations"
//                             ? `<td class="due-amount">₹${due.toLocaleString(
//                                 "en-IN"
//                               )}</td>`
//                             : ""
//                         }
//                         <td>${new Date(item.createdAt).toLocaleDateString(
//                           "en-IN"
//                         )}</td>
//                       </tr>
//                     `;
//                   })
//                   .join("")}
//                 <tr class="total-row">
//                   <td colspan="${
//                     activeTab === "donations"
//                       ? "6"
//                       : activeTab === "expenses"
//                       ? "7"
//                       : "5"
//                   }" style="text-align: right;"><strong>Total:</strong></td>
//                   <td class="amount"><strong>₹${totalAmount.toLocaleString(
//                     "en-IN"
//                   )}</strong></td>
//                   ${
//                     activeTab === "donations"
//                       ? `
//                   <td class="due-amount"><strong>₹${allData
//                     .reduce((sum, item) => sum + (item.due || 0), 0)
//                     .toLocaleString("en-IN")}</strong></td>
//                   `
//                       : ""
//                   }
//                   <td></td>
//                 </tr>
//               </tbody>
//             </table>

//             <div class="footer">
//               <p>This report contains all ${activeTab} records as of ${new Date().toLocaleDateString(
//         "en-IN"
//       )}</p>
//             </div>

//             <script>
//               window.onload = function() {
//                 window.print();
//                 window.onafterprint = function() {
//                   window.close();
//                 }
//               }
//             </script>
//           </body>
//         </html>
//       `;

//       // Clear loading and write the actual content
//       printWindow.document.open();
//       printWindow.document.write(html);
//       printWindow.document.close();
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       printWindow.document.open();
//       printWindow.document.write(`
//         <html>
//           <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
//             <h2 style="color: #dc2626;">Error Generating PDF</h2>
//             <p>There was an error generating the PDF report. Please try again.</p>
//             <button onclick="window.close()" style="padding: 10px 20px; background: #8B5CF6; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
//           </body>
//         </html>
//       `);
//       printWindow.document.close();
//     }
//   };

//   // Transform API data for display
//   const donations = invoices.filter(
//     (invoice) => invoice.invoice_type === "donation"
//   );
//   const expenses = invoices.filter(
//     (invoice) => invoice.invoice_type === "expence"
//   );

//   return (
//     <div className="min-h-screen bg-gradient-warm">
//       {/* Header */}
//       <div className="bg-gradient-festival text-white py-6 md:py-8 shadow-festival">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div className="text-center sm:text-left">
//               <h1 className="text-2xl md:text-4xl font-bold mb-2">
//                 Durga Puja Committee
//               </h1>
//               <p className="text-lg md:text-xl opacity-90">
//                 Tero Pakalmeri Dahutoli
//               </p>
//               <p className="text-sm md:text-lg opacity-80 mt-2">
//                 Financial Transparency & Accounts
//               </p>
//             </div>
//             <div className="flex justify-center sm:justify-end">
//               <LoginModal
//                 onLogin={handleLogin}
//                 isLoggedIn={isAdminLoggedIn}
//                 onLogout={handleLogout}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-8">
//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
//           <Card className="shadow-warm border-festival-gold/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 Total Received
//               </CardTitle>
//               {isSummaryLoading ? (
//                 <Loader2 className="h-4 w-4 animate-spin text-primary" />
//               ) : (
//                 <Users className="h-4 w-4 text-primary" />
//               )}
//             </CardHeader>
//             <CardContent>
//               <div className="text-xl md:text-2xl font-bold text-primary flex items-center">
//                 <IndianRupee className="h-4 w-4 md:h-5 md:w-5 mr-1" />
//                 {summary.totalReceived.toLocaleString("en-IN")}
//               </div>
//               <p className="text-xs text-muted-foreground">From donations</p>
//             </CardContent>
//           </Card>

//           <Card className="shadow-warm border-festival-red/20">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 Total Expenses
//               </CardTitle>
//               {isSummaryLoading ? (
//                 <Loader2 className="h-4 w-4 animate-spin text-destructive" />
//               ) : (
//                 <ShoppingCart className="h-4 w-4 text-destructive" />
//               )}
//             </CardHeader>
//             <CardContent>
//               <div className="text-xl md:text-2xl font-bold text-destructive flex items-center">
//                 <IndianRupee className="h-4 w-4 md:h-5 md:w-5 mr-1" />
//                 {summary.totalExpenses.toLocaleString("en-IN")}
//               </div>
//               <p className="text-xs text-muted-foreground">Puja expenses</p>
//             </CardContent>
//           </Card>

//           <Card className="shadow-warm border-festival-gold/20 sm:col-span-2 md:col-span-1">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 Remaining
//               </CardTitle>
//               {isSummaryLoading ? (
//                 <Loader2 className="h-4 w-4 animate-spin text-festival-gold" />
//               ) : (
//                 <Wallet className="h-4 w-4 text-festival-gold" />
//               )}
//             </CardHeader>
//             <CardContent>
//               <div className="text-xl md:text-2xl font-bold text-festival-gold flex items-center">
//                 <IndianRupee className="h-4 w-4 md:h-5 md:w-5 mr-1" />
//                 {summary.remaining.toLocaleString("en-IN")}
//               </div>
//               <p className="text-xs text-muted-foreground">Cash in hand</p>
//             </CardContent>
//           </Card>

//           <Card className="shadow-warm border-festival-gold/20 sm:col-span-2 md:col-span-1">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 Total due Amount
//               </CardTitle>
//               {isSummaryLoading ? (
//                 <Loader2 className="h-4 w-4 animate-spin text-festival-gold" />
//               ) : (
//                 <Wallet className="h-4 w-4 text-festival-gold" />
//               )}
//             </CardHeader>
//             <CardContent>
//               <div className="text-xl md:text-2xl font-bold text-red-500 flex items-center">
//                 <IndianRupee className="h-4 w-4 md:h-5 md:w-5 mr-1" />
//                 {summary?.totaldue?.toLocaleString("en-IN")}
//               </div>
//               <p className="text-xs text-muted-foreground">Cash pending</p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Action Buttons - Only show if admin is logged in */}
//         {isAdminLoggedIn && (
//           <div className="flex flex-col sm:flex-row gap-3 mb-6 md:mb-8 px-4 sm:px-0 sm:justify-center">
//             <DonationModal onSave={handleAddDonation} />
//             <ExpenseModal onSave={handleAddExpense} />
//           </div>
//         )}

//         {/* Search and Export */}
//         <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
//           <div className="relative max-w-md">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//             <Input
//               ref={searchInputRef}
//               placeholder="Search by name, village, or phone..."
//               value={searchTerm}
//               onChange={handleSearchChange}
//               className="pl-10"
//               disabled={isLoading}
//             />
//           </div>
//           {/* Admin-only PDF Export */}

//           <Button
//             onClick={generatePDF}
//             variant="outline"
//             className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
//             disabled={isLoading || invoices.length === 0}
//           >
//             <Download className="h-4 w-4" />
//             Export {activeTab === "donations" ? "Donations" : "Expenses"} PDF
//           </Button>
//         </div>

//         {/* Transactions with Tabs - Now publicly accessible */}
//         <div className="w-full">
//           <Tabs
//             value={activeTab}
//             onValueChange={handleTabChange}
//             className="w-full"
//           >
//             <TabsList className="grid w-full grid-cols-2 mb-6">
//               <TabsTrigger
//                 value="donations"
//                 className="flex items-center gap-2"
//               >
//                 <Users className="h-4 w-4" />
//                 Donations ({donations.length})
//               </TabsTrigger>
//               <TabsTrigger value="expenses" className="flex items-center gap-2">
//                 <ShoppingCart className="h-4 w-4" />
//                 Expenses ({expenses.length})
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="donations">
//               <Card className="shadow-warm">
//                 <CardHeader>
//                   <CardTitle className="text-lg md:text-xl text-primary flex items-center">
//                     <Users className="mr-2 h-4 w-4 md:h-5 md:w-5" />
//                     Donations List
//                     {isLoading && (
//                       <Loader2 className="ml-2 h-4 w-4 animate-spin" />
//                     )}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-3 md:space-y-4">
//                   {isLoading ? (
//                     <div className="flex justify-center py-8">
//                       <Loader2 className="h-8 w-8 animate-spin" />
//                     </div>
//                   ) : donations.length === 0 ? (
//                     <div className="text-center py-8 text-muted-foreground">
//                       No donations found
//                     </div>
//                   ) : (
//                     donations.map((donation) => (
//                       <div
//                         key={donation._id}
//                         className="border-l-4 border-primary pl-3 md:pl-4 py-3 bg-festival-cream/50 rounded-r-lg"
//                       >
//                         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
//                           <div className="flex-1">
//                             <h4 className="font-semibold text-base md:text-lg">
//                               {donation.name || "Anonymous"}
//                             </h4>
//                             <p className="text-sm text-muted-foreground">
//                               {donation.village}
//                             </p>
//                             <p className="text-sm text-muted-foreground">
//                               {donation.number}
//                             </p>
//                             <p className="text-sm text-red-500 font-bold">
//                               Due: {donation.due}
//                             </p>

//                             <p className="text-xs text-muted-foreground">
//                               {new Date(donation.createdAt).toLocaleDateString(
//                                 "en-IN"
//                               )}
//                             </p>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <Badge
//                               variant="secondary"
//                               className="bg-primary text-primary-foreground"
//                             >
//                               <IndianRupee className="h-3 w-3 mr-1" />
//                               {donation.amount.toLocaleString("en-IN")}
//                             </Badge>
//                             {/* Admin-only edit/delete buttons */}
//                             {isAdminLoggedIn && (
//                               <div className="flex gap-1">
//                                 <DonationModal
//                                   donation={{
//                                     id: donation._id,
//                                     name: donation.name || "",
//                                     phone: donation.number,
//                                     village: donation.village,
//                                     amount: donation.amount,
//                                     due: donation.due,
//                                   }}
//                                   onSave={(updatedDonation) =>
//                                     handleEditDonation(
//                                       donation,
//                                       updatedDonation
//                                     )
//                                   }
//                                   isEdit
//                                 />
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   onClick={() =>
//                                     handleDeleteDonation(donation._id)
//                                   }
//                                 >
//                                   <Trash2 className="h-4 w-4 text-destructive" />
//                                 </Button>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="expenses">
//               <Card className="shadow-warm">
//                 <CardHeader>
//                   <CardTitle className="text-lg md:text-xl text-destructive flex items-center">
//                     <ShoppingCart className="mr-2 h-4 w-4 md:h-5 md:w-5" />
//                     Expenses List
//                     {isLoading && (
//                       <Loader2 className="ml-2 h-4 w-4 animate-spin" />
//                     )}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-3 md:space-y-4">
//                   {isLoading ? (
//                     <div className="flex justify-center py-8">
//                       <Loader2 className="h-8 w-8 animate-spin" />
//                     </div>
//                   ) : expenses.length === 0 ? (
//                     <div className="text-center py-8 text-muted-foreground">
//                       No expenses found
//                     </div>
//                   ) : (
//                     expenses.map((expense) => (
//                       <div
//                         key={expense._id}
//                         className="border-l-4 border-destructive pl-3 md:pl-4 py-3 bg-destructive/5 rounded-r-lg"
//                       >
//                         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
//                           <div className="flex-1">
//                             <h4 className="font-semibold text-base md:text-lg">
//                               {expense.name || "Unknown"}
//                             </h4>
//                             <p className="text-sm font-medium text-destructive">
//                               {expense.expence_name || "Expense"}
//                             </p>
//                             <p className="text-xs text-muted-foreground">
//                               {expense.items.join(", ")}
//                             </p>
//                             <p className="text-sm text-muted-foreground">
//                               {expense.number}
//                             </p>
//                             <p className="text-xs text-muted-foreground">
//                               {new Date(expense.createdAt).toLocaleDateString(
//                                 "en-IN"
//                               )}
//                             </p>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <Badge variant="destructive">
//                               <IndianRupee className="h-3 w-3 mr-1" />
//                               {expense.amount.toLocaleString("en-IN")}
//                             </Badge>
//                             {/* Admin-only edit/delete buttons */}
//                             {isAdminLoggedIn && (
//                               <div className="flex gap-1">
//                                 <ExpenseModal
//                                   expense={{
//                                     id: expense._id,
//                                     name: expense.name || "",
//                                     expenseName: expense.expence_name || "",
//                                     items: expense.items,
//                                     phone: expense.number,
//                                     amount: expense.amount,
//                                   }}
//                                   onSave={(updatedExpense) =>
//                                     handleEditExpense(expense, updatedExpense)
//                                   }
//                                   isEdit
//                                 />
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   onClick={() =>
//                                     handleDeleteExpense(expense._id)
//                                   }
//                                 >
//                                   <Trash2 className="h-4 w-4 text-destructive" />
//                                 </Button>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>

//         {/* Pagination - Show for everyone if there are multiple pages */}
//         {totalPages > 1 && (
//           <div className="flex justify-center items-center gap-4 mt-6">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1 || isLoading}
//             >
//               <ChevronLeft className="h-4 w-4" />
//               Previous
//             </Button>

//             <div className="flex items-center gap-2">
//               <span className="text-sm text-muted-foreground">
//                 Page {currentPage} of {totalPages} ({totalItems} items)
//               </span>
//             </div>

//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages || isLoading}
//             >
//               Next
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div>
//         )}

//         {/* Footer */}
//         <div className="text-center mt-8 md:mt-12 p-4 md:p-6 bg-card rounded-lg shadow-warm mx-2 sm:mx-0">
//           <p className="text-sm md:text-base text-muted-foreground">
//             All financial transactions are transparent and open to the public
//           </p>
//           <p className="text-xs md:text-sm text-muted-foreground mt-2">
//             Contact: Durga Puja Committee Tero Pakalmeri Dahutoli
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoginModal } from "@/components/LoginModal";
import { DonationModal } from "@/components/DonationModal";
import { ExpenseModal } from "@/components/ExpenseModal";
import {
  IndianRupee,
  Users,
  ShoppingCart,
  Wallet,
  Trash2,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { deleteInvoice, fetchSummary, getInvoices, updateInvoice } from "@/api";

interface Invoice {
  _id: string;
  name?: string;
  expence_name?: string;
  number: string;
  items: string[];
  amount: number;
  due: number;
  village: string;
  invoice_type: "donation" | "expence";
  createdAt: string;
  updatedAt: string;
}

interface SummaryResponse {
  totalReceived: number;
  totalExpenses: number;
  remaining: number;
  totaldue: number;
}

export function Dashboard() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("donations");
  const [isLoading, setIsLoading] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [dueFilter, setDueFilter] = useState<string>("all"); // "all", "due", "nodule"

  // API Data State
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [summary, setSummary] = useState<SummaryResponse>({
    totalReceived: 0,
    totalExpenses: 0,
    remaining: 0,
    totaldue: 0,
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  // Ref to maintain search input focus
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { toast } = useToast();

  // Fetch summary data - No token needed
  const loadSummary = useCallback(async () => {
    setIsSummaryLoading(true);
    try {
      const summaryData = await fetchSummary();
      if (summaryData) {
        setSummary(summaryData);
      }
    } catch (error) {
      console.error("Error loading summary:", error);
      toast({
        title: "Error",
        description: "Failed to load summary data",
        variant: "destructive",
      });
    } finally {
      setIsSummaryLoading(false);
    }
  }, [toast]);

  // Fetch invoices with pagination and filters - No token needed
  const loadInvoices = useCallback(
    async (page = 1, search = "", type?: "donation" | "expence", onlyDue?: boolean) => {
      setIsLoading(true);
      try {
        const response = await getInvoices({
          page,
          limit,
          type,
          name: search || undefined,
          onlyDue,
        });

        setInvoices(response.invoices);
        setCurrentPage(response.page);
        setTotalPages(response.totalPages);
        setTotalItems(response.total);
      } catch (error) {
        console.error("Error loading invoices:", error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  // Load data when component mounts or dependencies change
  useEffect(() => {
    loadSummary();
    const isDueFilter = dueFilter === "due";
    loadInvoices(
      1,
      searchTerm,
      activeTab === "donations" ? "donation" : "expence",
      activeTab === "donations" ? isDueFilter : undefined
    );
  }, [activeTab, dueFilter, loadSummary]);

  // Debounced search effect with focus preservation
  useEffect(() => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      const isDueFilter = dueFilter === "due";
      loadInvoices(
        1,
        searchTerm,
        activeTab === "donations" ? "donation" : "expence",
        activeTab === "donations" ? isDueFilter : undefined
      );
    }, 500);

    // Cleanup function
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm, activeTab, dueFilter, loadInvoices]);

  const handleLogin = (isAdmin: boolean) => {
    setIsAdminLoggedIn(isAdmin);
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    // Don't clear invoices and summary on logout since they're publicly accessible
  };

  const handleAddDonation = (newDonation: any) => {
    // Refresh data after adding
    loadSummary();
    const isDueFilter = dueFilter === "due";
    loadInvoices(
      currentPage,
      searchTerm,
      activeTab === "donations" ? "donation" : "expence",
      activeTab === "donations" ? isDueFilter : undefined
    );
  };

  const handleEditDonation = async (donation: Invoice, updatedData: any) => {
    const token = localStorage.getItem("admin_auth_token");
    if (!token) return;

    try {
      // Map form data to API format
      const apiData = {
        name: updatedData.name,
        number: updatedData.phone,
        items: [],
        amount: updatedData.amount,
        due: updatedData.due,
        village: updatedData.village,
      };

      await updateInvoice(token, donation._id, apiData);

      toast({
        title: "Donation Updated",
        description: `Successfully updated donation from ${updatedData.name}`,
      });

      // Refresh data
      loadSummary();
      const isDueFilter = dueFilter === "due";
      loadInvoices(currentPage, searchTerm, "donation", isDueFilter);
    } catch (error) {
      toast({
        title: "Update Failed",
        description:
          error instanceof Error ? error.message : "Failed to update donation",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDonation = async (donationId: string) => {
    const token = localStorage.getItem("admin_auth_token");
    if (!token) return;

    if (!confirm("Are you sure you want to delete this donation?")) return;

    try {
      await deleteInvoice(token, donationId);

      toast({
        title: "Donation Deleted",
        description: "Donation has been successfully deleted",
      });

      // Refresh data
      loadSummary();
      const isDueFilter = dueFilter === "due";
      loadInvoices(currentPage, searchTerm, "donation", isDueFilter);
    } catch (error) {
      toast({
        title: "Delete Failed",
        description:
          error instanceof Error ? error.message : "Failed to delete donation",
        variant: "destructive",
      });
    }
  };

  const handleAddExpense = (newExpense: any) => {
    // Refresh data after adding
    loadSummary();
    loadInvoices(
      currentPage,
      searchTerm,
      activeTab === "donations" ? "donation" : "expence"
    );
  };

  const handleEditExpense = async (expense: Invoice, updatedData: any) => {
    const token = localStorage.getItem("admin_auth_token");
    if (!token) return;

    try {
      // Map form data to API format
      const apiData = {
        expence_name: updatedData.expenseName,
        number: updatedData.phone,
        items: updatedData.items,
        amount: updatedData.amount,
        village: updatedData.village || expense.village,
      };

      await updateInvoice(token, expense._id, apiData);

      toast({
        title: "Expense Updated",
        description: `Successfully updated expense: ${updatedData.expenseName}`,
      });

      // Refresh data
      loadSummary();
      loadInvoices(currentPage, searchTerm, "expence");
    } catch (error) {
      toast({
        title: "Update Failed",
        description:
          error instanceof Error ? error.message : "Failed to update expense",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    const token = localStorage.getItem("admin_auth_token");
    if (!token) return;

    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      await deleteInvoice(token, expenseId);

      toast({
        title: "Expense Deleted",
        description: "Expense has been successfully deleted",
      });

      // Refresh data
      loadSummary();
      loadInvoices(currentPage, searchTerm, "expence");
    } catch (error) {
      toast({
        title: "Delete Failed",
        description:
          error instanceof Error ? error.message : "Failed to delete expense",
        variant: "destructive",
      });
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm("");
    setDueFilter("all"); // Reset due filter when changing tabs
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const isDueFilter = dueFilter === "due";
      loadInvoices(
        page,
        searchTerm,
        activeTab === "donations" ? "donation" : "expence",
        activeTab === "donations" ? isDueFilter : undefined
      );
    }
  };

  // Handle search input change with focus preservation
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Preserve cursor position and focus
    requestAnimationFrame(() => {
      if (searchInputRef.current) {
        const cursorPosition = e.target.selectionStart || 0;
        searchInputRef.current.focus();
        searchInputRef.current.setSelectionRange(
          cursorPosition,
          cursorPosition
        );
      }
    });
  };

  // Handle due filter change
  const handleDueFilterChange = (value: string) => {
    setDueFilter(value);
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setDueFilter("all");
    setCurrentPage(1);
  };

  // Generate PDF report
  const generatePDF = async () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Show loading in the new window
    printWindow.document.write(`
      <html>
        <body style="font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
          <div style="text-align: center;">
            <div style="border: 4px solid #f3f3f3; border-top: 4px solid #8B5CF6; border-radius: 50%; width: 50px; height: 50px; animation: spin 2s linear infinite; margin: 0 auto 20px;"></div>
            <p>Generating PDF report... Please wait</p>
            <style>
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            </style>
          </div>
        </body>
      </html>
    `);

    try {
      // Fetch all data for PDF export
      const isDueFilter = dueFilter === "due";
      const response = await getInvoices({
        type: activeTab === "donations" ? "donation" : "expence",
        name: searchTerm || undefined,
        onlyDue: activeTab === "donations" ? isDueFilter : undefined,
        full: true, // This will get all matching records, not just current page
      });

      const allData = response.invoices.filter((invoice) =>
        activeTab === "donations"
          ? invoice.invoice_type === "donation"
          : invoice.invoice_type === "expence"
      );

      const title = activeTab === "donations" 
        ? `Donations Report${dueFilter === "due" ? " (Due Only)" : ""}` 
        : "Expenses Report";
      const totalAmount = allData.reduce((sum, item) => sum + item.amount, 0);

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title} - Durga Puja Committee</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                color: #333;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #8B5CF6;
                padding-bottom: 20px;
              }
              .header h1 {
                color: #8B5CF6;
                margin: 0;
                font-size: 24px;
              }
              .header h2 {
                color: #666;
                margin: 5px 0;
                font-size: 18px;
              }
              .header p {
                color: #888;
                margin: 5px 0;
              }
              .summary {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                border-left: 4px solid #8B5CF6;
              }
              .summary h3 {
                margin: 0 0 10px 0;
                color: #8B5CF6;
              }
              .filter-info {
                background: #e3f2fd;
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 20px;
                border-left: 3px solid #2196f3;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
              }
              th {
                background-color: #8B5CF6;
                color: white;
                font-weight: bold;
              }
              tr:nth-child(even) {
                background-color: #f9f9f9;
              }
              tr:hover {
                background-color: #f5f5f5;
              }
              .amount {
                font-weight: bold;
                color: #8B5CF6;
              }
              .due-amount {
                font-weight: bold;
                color: #dc3545;
              }
              .footer {
                margin-top: 30px;
                text-align: center;
                color: #666;
                border-top: 1px solid #ddd;
                padding-top: 20px;
              }
              .total-row {
                background-color: #e9ecef !important;
                font-weight: bold;
              }
              .total-row td {
                border-top: 2px solid #8B5CF6;
              }
              .date {
                color: #666;
                font-size: 12px;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Durga Puja Committee</h1>
              <h2>Tero Pakalmeri Dahutoli</h2>
              <p><strong>${title}</strong></p>
              <p class="date">Generated on: ${new Date().toLocaleDateString(
                "en-IN",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}</p>
            </div>

            ${searchTerm || dueFilter !== "all" ? `
            <div class="filter-info">
              <strong>Applied Filters:</strong>
              ${searchTerm ? `<span>Search: "${searchTerm}"</span>` : ""}
              ${searchTerm && dueFilter !== "all" ? " | " : ""}
              ${dueFilter === "due" ? "<span>Due Status: Due Only</span>" : dueFilter === "nodule" ? "<span>Due Status: No Due</span>" : ""}
            </div>
            ` : ""}

            <div class="summary">
              <h3>Summary</h3>
              <p><strong>Total Received:</strong> ₹${summary.totalReceived.toLocaleString(
                "en-IN"
              )}</p>
              <p><strong>Total Expenses:</strong> ₹${summary.totalExpenses.toLocaleString(
                "en-IN"
              )}</p>
              <p><strong>Remaining Balance:</strong> ₹${summary.remaining.toLocaleString(
                "en-IN"
              )}</p>
              <p><strong>Total ${activeTab}:</strong> ₹${totalAmount.toLocaleString(
        "en-IN"
      )} (${allData.length} entries)</p>
              ${
                activeTab === "donations"
                  ? `
              <p><strong>Total Due:</strong> ₹${allData
                .reduce((sum, item) => sum + (item.due || 0), 0)
                .toLocaleString("en-IN")}</p>
              `
                  : ""
              }
            </div>

            <table>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>${
                    activeTab === "donations" ? "Donor Name" : "Vendor/Purpose"
                  }</th>
                  ${activeTab === "expenses" ? "<th>Expense Type</th>" : ""}
                  <th>Village</th>
                  <th>Phone</th>
                  ${activeTab === "expenses" ? "<th>Items</th>" : ""}
                  <th>Amount (₹)</th>
                  ${activeTab === "donations" ? "<th>Due (₹)</th>" : ""}
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                ${allData
                  .map((item, index) => {
                    const due = item.due || 0;

                    return `
                      <tr>
                        <td>${index + 1}</td>
                        <td>${
                          item.name ||
                          (activeTab === "donations" ? "Anonymous" : "Unknown")
                        }</td>
                        ${
                          activeTab === "expenses"
                            ? `<td>${
                                item.expence_name || "General Expense"
                              }</td>`
                            : ""
                        }
                        <td>${item.village}</td>
                        <td>${item.number}</td>
                        ${
                          activeTab === "expenses"
                            ? `<td>${item.items.join(", ") || "N/A"}</td>`
                            : ""
                        }
                        <td class="amount">₹${item.amount.toLocaleString(
                          "en-IN"
                        )}</td>
                        ${
                          activeTab === "donations"
                            ? `<td class="due-amount">₹${due.toLocaleString(
                                "en-IN"
                              )}</td>`
                            : ""
                        }
                        <td>${new Date(item.createdAt).toLocaleDateString(
                          "en-IN"
                        )}</td>
                      </tr>
                    `;
                  })
                  .join("")}
                <tr class="total-row">
                  <td colspan="${
                    activeTab === "donations"
                      ? "6"
                      : activeTab === "expenses"
                      ? "7"
                      : "5"
                  }" style="text-align: right;"><strong>Total:</strong></td>
                  <td class="amount"><strong>₹${totalAmount.toLocaleString(
                    "en-IN"
                  )}</strong></td>
                  ${
                    activeTab === "donations"
                      ? `
                  <td class="due-amount"><strong>₹${allData
                    .reduce((sum, item) => sum + (item.due || 0), 0)
                    .toLocaleString("en-IN")}</strong></td>
                  `
                      : ""
                  }
                  <td></td>
                </tr>
              </tbody>
            </table>

            <div class="footer">
              <p>This report contains ${dueFilter === "due" ? "due " : dueFilter === "nodule" ? "no due " : "all "}${activeTab} records as of ${new Date().toLocaleDateString(
        "en-IN"
      )}</p>
            </div>

            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                }
              }
            </script>
          </body>
        </html>
      `;

      // Clear loading and write the actual content
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
    } catch (error) {
      console.error("Error generating PDF:", error);
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2 style="color: #dc2626;">Error Generating PDF</h2>
            <p>There was an error generating the PDF report. Please try again.</p>
            <button onclick="window.close()" style="padding: 10px 20px; background: #8B5CF6; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Transform API data for display
  const donations = invoices.filter(
    (invoice) => invoice.invoice_type === "donation"
  );
  const expenses = invoices.filter(
    (invoice) => invoice.invoice_type === "expence"
  );

  // Get active filters count for badge
  const activeFiltersCount = [
    searchTerm,
    dueFilter !== "all" ? dueFilter : null,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <div className="bg-gradient-festival text-white py-6 md:py-8 shadow-festival">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl md:text-4xl font-bold mb-2">
                Durga Puja Committee
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Tero Pakalmeri Dahutoli
              </p>
              <p className="text-sm md:text-lg opacity-80 mt-2">
                Financial Transparency & Accounts
              </p>
            </div>
            <div className="flex justify-center sm:justify-end">
              <LoginModal
                onLogin={handleLogin}
                isLoggedIn={isAdminLoggedIn}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card className="shadow-warm border-festival-gold/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Received
              </CardTitle>
              {isSummaryLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <Users className="h-4 w-4 text-primary" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-primary flex items-center">
                <IndianRupee className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                {summary.totalReceived.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-muted-foreground">From donations</p>
            </CardContent>
          </Card>

          <Card className="shadow-warm border-festival-red/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Expenses
              </CardTitle>
              {isSummaryLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-destructive" />
              ) : (
                <ShoppingCart className="h-4 w-4 text-destructive" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-destructive flex items-center">
                <IndianRupee className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                {summary.totalExpenses.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-muted-foreground">Puja expenses</p>
            </CardContent>
          </Card>

          <Card className="shadow-warm border-festival-gold/20 sm:col-span-2 md:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Remaining
              </CardTitle>
              {isSummaryLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-festival-gold" />
              ) : (
                <Wallet className="h-4 w-4 text-festival-gold" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-festival-gold flex items-center">
                <IndianRupee className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                {summary.remaining.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-muted-foreground">Cash in hand</p>
            </CardContent>
          </Card>

          <Card className="shadow-warm border-festival-gold/20 sm:col-span-2 md:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Due Amount
              </CardTitle>
              {isSummaryLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-festival-gold" />
              ) : (
                <Wallet className="h-4 w-4 text-festival-gold" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-red-500 flex items-center">
                <IndianRupee className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                {summary?.totaldue?.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-muted-foreground">Cash pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons - Only show if admin is logged in */}
        {isAdminLoggedIn && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6 md:mb-8 px-4 sm:px-0 sm:justify-center">
            <DonationModal onSave={handleAddDonation} />
            <ExpenseModal onSave={handleAddExpense} />
          </div>
        )}

        {/* Search, Filter and Export */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4 items-center justify-center">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              ref={searchInputRef}
              placeholder="Search by name, village, or phone..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
              disabled={isLoading}
            />
          </div>

          {/* Due Filter - Only show for donations tab */}
          {activeTab === "donations" && (
            <Select value={dueFilter} onValueChange={handleDueFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by due" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Donations</SelectItem>
                <SelectItem value="due">Due Only</SelectItem>
                <SelectItem value="nodule">No Due</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Clear Filters Button */}
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear Filters
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            </Button>
          )}

          {/* PDF Export */}
          <Button
            onClick={generatePDF}
            variant="outline"
            className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
            disabled={isLoading || invoices.length === 0}
          >
            <Download className="h-4 w-4" />
            Export {activeTab === "donations" ? "Donations" : "Expenses"} PDF
          </Button>
        </div>

        {/* Transactions with Tabs - Now publicly accessible */}
        <div className="w-full">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger
                value="donations"
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Donations ({donations.length})
              </TabsTrigger>
              <TabsTrigger value="expenses" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Expenses ({expenses.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="donations">
              <Card className="shadow-warm">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl text-primary flex items-center">
                    <Users className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    Donations List
                    {isLoading && (
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : donations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No donations found
                    </div>
                  ) : (
                    donations.map((donation) => (
                      <div
                        key={donation._id}
                        className="border-l-4 border-primary pl-3 md:pl-4 py-3 bg-festival-cream/50 rounded-r-lg"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-base md:text-lg">
                              {donation.name || "Anonymous"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {donation.village}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {donation.number}
                            </p>
                            <p className="text-sm text-red-500 font-bold">
                              Due: ₹{(donation.due || 0).toLocaleString("en-IN")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(donation.createdAt).toLocaleDateString(
                                "en-IN"
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="bg-primary text-primary-foreground"
                            >
                              <IndianRupee className="h-3 w-3 mr-1" />
                              {donation.amount.toLocaleString("en-IN")}
                            </Badge>
                            {/* Admin-only edit/delete buttons */}
                            {isAdminLoggedIn && (
                              <div className="flex gap-1">
                                <DonationModal
                                  donation={{
                                    id: donation._id,
                                    name: donation.name || "",
                                    phone: donation.number,
                                    village: donation.village,
                                    amount: donation.amount,
                                    due: donation.due,
                                  }}
                                  onSave={(updatedDonation) =>
                                    handleEditDonation(
                                      donation,
                                      updatedDonation
                                    )
                                  }
                                  isEdit
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteDonation(donation._id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expenses">
              <Card className="shadow-warm">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl text-destructive flex items-center">
                    <ShoppingCart className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    Expenses List
                    {isLoading && (
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : expenses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No expenses found
                    </div>
                  ) : (
                    expenses.map((expense) => (
                      <div
                        key={expense._id}
                        className="border-l-4 border-destructive pl-3 md:pl-4 py-3 bg-destructive/5 rounded-r-lg"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-base md:text-lg">
                              {expense.name || "Unknown"}
                            </h4>
                            <p className="text-sm font-medium text-destructive">
                              {expense.expence_name || "Expense"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {expense.items.join(", ")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {expense.number}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(expense.createdAt).toLocaleDateString(
                                "en-IN"
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive">
                              <IndianRupee className="h-3 w-3 mr-1" />
                              {expense.amount.toLocaleString("en-IN")}
                            </Badge>
                            {/* Admin-only edit/delete buttons */}
                            {isAdminLoggedIn && (
                              <div className="flex gap-1">
                                <ExpenseModal
                                  expense={{
                                    id: expense._id,
                                    name: expense.name || "",
                                    expenseName: expense.expence_name || "",
                                    items: expense.items,
                                    phone: expense.number,
                                    amount: expense.amount,
                                  }}
                                  onSave={(updatedExpense) =>
                                    handleEditExpense(expense, updatedExpense)
                                  }
                                  isEdit
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteExpense(expense._id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Pagination - Show for everyone if there are multiple pages */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} ({totalItems} items)
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

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