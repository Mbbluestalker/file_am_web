import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import Sidebar from '../components/client/Sidebar';
import { getAllClientsFromStorage } from '../utils/clientStorage';

const SubmitVATReturn = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Use first client as default for sidebar navigation
  const clients = getAllClientsFromStorage();
  const defaultClientId = clients[0]?.id || '1';
  const [authorizations, setAuthorizations] = useState({
    client: false,
    consultant: false,
  });

  // Mock data
  const filing = {
    clientName: 'Aflex Enterprises Ltd',
    filingPeriod: 'January 2026',
    outputVat: 2450000,
    inputVat: 1045000,
    netPayable: 1405591,
  };

  const verificationChecklist = [
    'All invoices uploaded and verified',
    'VAT calculation verified at standard rate (7.5%)',
    'Input VAT reconciliation complete',
    'Ensure proper record-keeping of all invoices',
  ];

  const authorizationItems = [
    {
      id: 'client',
      name: 'John Adeosun, Director Tax Compliance',
      role: 'Client Authorization',
      description: 'I hereby authorize the submission of this VAT return to the Federal Inland Revenue Service (FIRS) on behalf of Aflex Enterprises Ltd. I confirm that all information provided is accurate and complete to the best of my knowledge.',
    },
    {
      id: 'consultant',
      name: 'Sarah Adeyemi, Managing Partner',
      role: 'Senior Tax Consultant Authorization',
      description: 'As the supervising tax consultant, I have reviewed this VAT return and confirm that all calculations and supporting documentation comply with the requirements of the VAT Act. I authorize the submission of this return to FIRS.',
    },
  ];

  const handleAuthorizationChange = (id) => {
    setAuthorizations((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const canSubmit = authorizations.client && authorizations.consultant;

  const handleSubmit = () => {
    if (canSubmit) {
      // Navigate to payment confirmation
      navigate(`/filings/${id}/confirmation`);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
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
          <div className="bg-black text-white px-10 py-6">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6" />
              <h1 className="text-2xl font-semibold">Submit VAT Return - January 2026</h1>
            </div>
          </div>

          <div className="flex">
            {/* Main Content */}
            <div className="flex-1 p-8">
          <div className="max-w-4xl">
            {/* Success Banner */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800">
                <span className="font-semibold">Ready for Submission</span> - All pre-submission
                requirements have been successfully completed
              </p>
            </div>

            {/* Filing Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filing Summary</h2>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Filing Period</p>
                  <p className="text-base font-semibold text-gray-900 mt-1">{filing.filingPeriod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Client</p>
                  <p className="text-base font-semibold text-gray-900 mt-1">{filing.clientName}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Output VAT</p>
                  <p className="text-xl font-bold text-gray-900 mt-2">
                    {formatCurrency(filing.outputVat)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Input VAT</p>
                  <p className="text-xl font-bold text-gray-900 mt-2">
                    {formatCurrency(filing.inputVat)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Net VAT Payable</p>
                  <p className="text-xl font-bold text-green-600 mt-2">
                    {formatCurrency(filing.netPayable)}
                  </p>
                </div>
              </div>
            </div>

            {/* Pre-submission Verification */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Pre-submission Verification
              </h3>

              <div className="space-y-3">
                {verificationChecklist.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Authorization Required */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Authorization Required</h3>

              <div className="space-y-6">
                {authorizationItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id={item.id}
                        checked={authorizations[item.id]}
                        onChange={() => handleAuthorizationChange(item.id)}
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-offset-0 mt-1 cursor-pointer"
                      />
                      <div className="flex-1">
                        <label htmlFor={item.id} className="cursor-pointer">
                          <h4 className="font-medium text-gray-900">{item.role}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.name}</p>
                          <p className="text-sm text-gray-500 mt-2 leading-relaxed italic">
                            "{item.description}"
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning Message */}
            {!canSubmit && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800">Authorization Required</p>
                  <p className="text-sm text-orange-700 mt-1">
                    Please ensure all required authorizations are obtained before submitting the VAT
                    return to FIRS.
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                  canSubmit
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Submit VAT Return to FIRS
              </button>
            </div>
            </div>
            </div>

            {/* Sidebar - Submission Details */}
            <div className="w-80 bg-white border-l border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
            Submission Details
          </h3>

          <div className="space-y-4 text-sm">
            <div>
              <p className="text-gray-500">VAT Return (TIN)</p>
              <p className="font-medium text-gray-900 mt-1">0123456789-0001</p>
            </div>

            <div>
              <p className="text-gray-500">Filing Period</p>
              <p className="font-medium text-gray-900 mt-1">{filing.filingPeriod}</p>
            </div>

            <div>
              <p className="text-gray-500">Submission Date</p>
              <p className="font-medium text-gray-900 mt-1">17 February 2026</p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-gray-500">Due Date</p>
              <p className="font-medium text-gray-900 mt-1">21 February 2026</p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-gray-500">Status</p>
              <p className="font-medium text-green-600 mt-1">Ready to Submit</p>
            </div>
            </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SubmitVATReturn;
