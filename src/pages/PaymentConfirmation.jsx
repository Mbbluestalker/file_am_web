import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, FileText, Download, Share2, Printer } from 'lucide-react';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import { clients } from '../data/clientsData';

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Use first client as default for sidebar navigation
  const defaultClientId = clients[0]?.id || '1';

  // Mock data
  const confirmation = {
    firsReference: 'FIRS/VAT/20260215/34167',
    paymentDate: '17 February 2026',
    paymentAmount: 1442250.0,
    bankName: 'First Bank of Nigeria',
    accountNumber: 'FIRS VAT Collection A/C',
    transactionRef: 'FBN/TXN/2026/089842',
    filingPeriod: 'January 2026',
    dueDate: '21 February 2026',
    outputVat: 2450000,
    inputVat: 1007750,
    netPayable: 1442250,
    paymentMethod: 'Bank Transfer',
    processingTime: '2026-02-17 14:30',
    clientName: 'Aflex Enterprises Ltd',
    clientTin: '0123456789-0001',
    consultantName: 'FileAm Tax Consultants',
    consultantAddress: '123 Business District, Lagos, Nigeria',
  };

  const taxBreakdown = [
    { label: 'Output VAT (Sales)', amount: confirmation.outputVat },
    { label: 'Input VAT (Purchases)', amount: -confirmation.inputVat },
    { label: 'Net VAT Payable', amount: confirmation.netPayable, isTotal: true },
  ];

  const supportingDocs = [
    { name: 'Input Payment Receipt', size: '2.3mb', icon: FileText },
    { name: 'VAT Computation Sheet', size: '1.8mb', icon: FileText },
    { name: 'Output VAT Summary', size: '945kb', icon: FileText },
    { name: 'Input VAT Reconciliation', size: '1.2mb', icon: FileText },
  ];

  const approvalTrail = [
    {
      name: 'John Adeosun, Director Tax Compliance',
      role: 'Client Authorization',
      timestamp: '2026-02-15 11:45',
    },
    {
      name: 'Sarah Adeyemi, Managing Partner',
      role: 'Senior Tax Consultant',
      timestamp: '2026-02-15 14:20',
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(Math.abs(amount));
  };

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar clientId={defaultClientId} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header hideLogo={true} />

        {/* Page Content */}
        <main className="flex-1 bg-gray-50 overflow-y-auto">
          {/* Page Header */}
          <div className="bg-white border-b border-gray-200 px-10 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <h1 className="text-xl font-semibold text-gray-900">Payment Confirmation Report</h1>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>

          <div className="p-8">
        <div className="max-w-5xl mx-auto">
          {/* Confirmation Badge */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">TAX PAYMENT CONFIRMATION</h2>
            <p className="text-green-700">
              Your VAT return has been successfully submitted and payment confirmed by FIRS
            </p>
            <div className="mt-4 inline-block bg-green-100 px-4 py-2 rounded-lg">
              <p className="text-sm text-green-700 font-medium">FIRS Reference Number</p>
              <p className="text-lg font-bold text-green-900 mt-1">{confirmation.firsReference}</p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Payment Amount (IFRS)</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(confirmation.paymentAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Amount (TIN)</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(confirmation.dueDate === '21 February 2026' ? 0 : confirmation.paymentAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Filing Period</p>
                <p className="text-base font-medium text-gray-900 mt-1">{confirmation.filingPeriod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Date</p>
                <p className="text-base font-medium text-gray-900 mt-1">{confirmation.paymentDate}</p>
              </div>
            </div>
          </div>

          {/* Tax Computation Breakdown */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Computation Breakdown</h3>
            <div className="space-y-3">
              {taxBreakdown.map((item, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center py-3 ${
                    item.isTotal ? 'border-t-2 border-gray-300 pt-4' : ''
                  }`}
                >
                  <span
                    className={`text-sm ${
                      item.isTotal ? 'font-semibold text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`text-base ${
                      item.isTotal
                        ? 'font-bold text-green-600 text-lg'
                        : item.amount < 0
                        ? 'text-red-600 font-medium'
                        : 'font-medium text-gray-900'
                    }`}
                  >
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Amount Paid */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-green-900">Total Amount Paid</span>
              <span className="text-3xl font-bold text-green-600">
                {formatCurrency(confirmation.netPayable)}
              </span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Bank Name</p>
                <p className="text-base font-medium text-gray-900 mt-1">{confirmation.bankName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Transaction Reference</p>
                <p className="text-base font-medium text-gray-900 mt-1">{confirmation.transactionRef}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="text-base font-medium text-gray-900 mt-1">{confirmation.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Processing Time</p>
                <p className="text-base font-medium text-gray-900 mt-1">{confirmation.processingTime}</p>
              </div>
            </div>
          </div>

          {/* Party Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Party Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-3">Taxpayer Information</p>
                <p className="text-base font-medium text-gray-900">{confirmation.clientName}</p>
                <p className="text-sm text-gray-600 mt-1">TIN: {confirmation.clientTin}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-3">Tax Consultant Information</p>
                <p className="text-base font-medium text-gray-900">{confirmation.consultantName}</p>
                <p className="text-sm text-gray-600 mt-1">{confirmation.consultantAddress}</p>
              </div>
            </div>
          </div>

          {/* Supporting Evidence */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Supporting Evidence</h3>
            <div className="space-y-2">
              {supportingDocs.map((doc, index) => {
                const Icon = doc.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.size}</p>
                      </div>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Approval Trail */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Trail</h3>
            <div className="space-y-4">
              {approvalTrail.map((approval, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{approval.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{approval.role}</p>
                      </div>
                      <p className="text-xs text-gray-500">{approval.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Official Certification */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 text-sm uppercase tracking-wide mb-2">
                  OFFICIAL CERTIFICATION
                </h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  This payment confirmation report has been generated by the Federal Inland Revenue
                  Service (FIRS) and serves as official proof of VAT payment for the specified
                  filing period. This document should be retained for record-keeping purposes in
                  accordance with Section 55 of the VAT Act and FIRS record-keeping guidelines for a
                  minimum period of six (6) years from the date of transaction.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/filings')}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            >
              Back to Filings
            </button>
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </button>
            </div>
          </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
