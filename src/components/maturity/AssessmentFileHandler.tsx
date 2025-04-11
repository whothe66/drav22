
import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, FileSpreadsheet, ArrowLeft } from 'lucide-react';
import * as XLSX from 'xlsx';

interface AssessmentFileHandlerProps {
  onImport: (data: any) => void;
  onDownloadTemplate: () => void;
  onBack: () => void;
}

interface ExcelRowData {
  SiteId?: number;
  Auditor?: string;
  AssetId?: number;
  ParameterId?: number;
  Score?: number;
  Value?: string;
  Notes?: string;
  LastUpdated?: string;
  [key: string]: any;
}

const AssessmentFileHandler: React.FC<AssessmentFileHandlerProps> = ({
  onImport,
  onDownloadTemplate,
  onBack
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<ExcelRowData>(worksheet);
        
        const processedData: { [key: string]: any } = {};
        
        jsonData.forEach((row: ExcelRowData) => {
          if (row.AssetId && row.ParameterId) {
            const key = `${row.AssetId}-${row.ParameterId}`;
            processedData[key] = {
              score: row.Score !== undefined ? Number(row.Score) : undefined,
              value: row.Value || '',
              notes: row.Notes || '',
              lastUpdated: row.LastUpdated || new Date().toISOString()
            };
          }
        });
        
        onImport({
          siteId: jsonData[0]?.SiteId ? Number(jsonData[0].SiteId) : 1,
          auditor: jsonData[0]?.Auditor || '',
          data: processedData
        });
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        toast({
          title: "Invalid file format",
          description: "Please upload a valid assessment Excel file",
          variant: "destructive"
        });
      }
    };
    reader.readAsBinaryString(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center mb-4">
          <Button variant="ghost" onClick={onBack} className="mr-2 p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-6 w-6" />
              Assessment Files
            </CardTitle>
            <CardDescription>
              Import or export assessment data
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/40 rounded-lg p-6 text-center">
          <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-medium mb-2">Import Assessment</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload a previously exported assessment Excel file to continue working on it
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx, .xls"
            className="hidden"
          />
          <Button onClick={triggerFileInput} className="gap-2">
            <Upload className="h-4 w-4" />
            Select File
          </Button>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-medium mb-4">Assessment Templates</h3>
          <div className="bg-muted/40 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between">
            <div className="text-left mb-4 md:mb-0">
              <h4 className="font-medium">Download Template</h4>
              <p className="text-sm text-muted-foreground">
                Get a blank assessment Excel template that you can fill out and upload later
              </p>
            </div>
            <Button onClick={onDownloadTemplate} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download Template
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentFileHandler;
