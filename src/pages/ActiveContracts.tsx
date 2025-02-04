import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

const ActiveContracts = () => {
  const contracts = [
    {
      title: "Book Cover Design",
      contractor: "Sarah Smith",
      status: "In Progress",
      dueDate: "March 30, 2024",
      value: "$500",
      progress: 60
    },
    {
      title: "Developmental Editing",
      contractor: "John Davis",
      status: "Review",
      dueDate: "April 15, 2024",
      value: "$1,200",
      progress: 90
    },
    {
      title: "Marketing Campaign",
      contractor: "Marketing Pros Inc",
      status: "Pending",
      dueDate: "May 1, 2024",
      value: "$800",
      progress: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Review":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">Active Contracts</h1>
            <p className="text-gray-600">Manage and track your ongoing service contracts.</p>
          </div>
          <Button>New Contract</Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts.map((contract, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{contract.title}</CardTitle>
                  <Badge className={getStatusColor(contract.status)}>{contract.status}</Badge>
                </div>
                <CardDescription>with {contract.contractor}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Due: {contract.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Value: {contract.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all" 
                      style={{ width: `${contract.progress}%` }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="w-full">View Details</Button>
                    <Button className="w-full">Update</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveContracts;