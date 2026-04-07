import { useState } from 'react';
import { Download, Upload, FileSpreadsheet, FileText, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import type { Client } from '../../types/roles';

interface DataExportImportProps {
  clients: Client[];
  salonName: string;
  onImport: (data: any[]) => void;
}

export function DataExportImport({ clients, salonName, onImport }: DataExportImportProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const exportToCSV = () => {
    // Create CSV content
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Total Bookings', 'Total Spent', 'Last Visit', 'Created At'];
    const rows = clients.map(client => [
      client.firstName,
      client.lastName,
      client.email,
      client.phone,
      client.totalBookings,
      client.totalSpent,
      client.lastVisit?.toISOString() || 'N/A',
      client.createdAt.toISOString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${salonName}_clients_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    // Create Excel-compatible CSV with BOM for UTF-8
    const BOM = '\uFEFF';
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Total Bookings', 'Total Spent', 'Last Visit', 'Created At'];
    const rows = clients.map(client => [
      client.firstName,
      client.lastName,
      client.email,
      client.phone,
      client.totalBookings,
      client.totalSpent,
      client.lastVisit?.toISOString().split('T')[0] || 'N/A',
      client.createdAt.toISOString().split('T')[0],
    ]);

    const csvContent = BOM + [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${salonName}_clients_${new Date().toISOString().split('T')[0]}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());

        // Validate headers
        const requiredHeaders = ['First Name', 'Last Name', 'Email', 'Phone'];
        const hasRequiredHeaders = requiredHeaders.every(h => headers.includes(h));

        if (!hasRequiredHeaders) {
          throw new Error('Invalid file format. Required columns: First Name, Last Name, Email, Phone');
        }

        // Parse data
        const data = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',').map(v => v.trim());
            const row: any = {};
            headers.forEach((header, index) => {
              row[header] = values[index];
            });
            return row;
          });

        onImport(data);
        setIsImporting(false);
        alert(`Successfully imported ${data.length} clients!`);
      } catch (error) {
        setImportError((error as Error).message);
        setIsImporting(false);
      }
    };

    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">Export Client Database</h3>
            <p className="text-sm text-gray-600">
              Download your client data in CSV or Excel format
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="flex-1 h-12"
          >
            <FileText className="w-4 h-4 mr-2" />
            Export as CSV
          </Button>
          <Button
            onClick={exportToExcel}
            className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export as Excel
          </Button>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            📊 <strong>{clients.length}</strong> clients ready to export
          </p>
        </div>
      </Card>

      {/* Import Section */}
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Upload className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">Import Client Data</h3>
            <p className="text-sm text-gray-600">
              Upload a CSV or Excel file with client information
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              as="span"
              variant="outline"
              className="w-full h-12 cursor-pointer"
              disabled={isImporting}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isImporting ? 'Importing...' : 'Choose File to Import'}
            </Button>
          </label>

          {importError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">Import Error</p>
                <p className="text-xs text-red-700 mt-1">{importError}</p>
              </div>
            </div>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Required Columns:</h4>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• <strong>First Name</strong> - Client's first name</li>
              <li>• <strong>Last Name</strong> - Client's last name</li>
              <li>• <strong>Email</strong> - Client's email address</li>
              <li>• <strong>Phone</strong> - Client's phone number</li>
            </ul>
            <p className="text-xs text-gray-600 mt-3">
              💡 Optional columns: Total Bookings, Total Spent, Last Visit, Notes
            </p>
          </div>
        </div>
      </Card>

      {/* Template Download */}
      <Card className="p-4 bg-purple-50 border-purple-200">
        <div className="flex items-start gap-3">
          <FileSpreadsheet className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              <strong>Need a template?</strong> Download our sample CSV file to see the correct format.
            </p>
            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium mt-1">
              Download Template →
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
