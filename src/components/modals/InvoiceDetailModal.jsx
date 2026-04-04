import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getInvoiceById, markInvoicePaid } from '../../services/financialsApi';

const InvoiceDetailModal = ({ open, onClose, clientId, invoiceId, onStatusChange }) => {
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);

  useEffect(() => {
    if (!open || !clientId || !invoiceId) return;
    const fetch = async () => {
      setIsLoading(true);
      try {
        const res = await getInvoiceById(clientId, invoiceId);
        if (res?.status && res.data) setInvoice(res.data);
      } catch (err) {
        console.error('Invoice detail error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [open, clientId, invoiceId]);

  const handleMarkPaid = async () => {
    if (isMarkingPaid) return;
    try {
      setIsMarkingPaid(true);
      const res = await markInvoicePaid(clientId, invoiceId);
      if (res?.status) {
        toast.success('Invoice marked as paid');
        setInvoice((prev) => prev ? { ...prev, paymentStatus: 'Paid' } : prev);
        onStatusChange?.();
      } else {
        toast.error(res?.message || 'Failed to mark as paid');
      }
    } catch (err) {
      console.error('Mark paid error:', err);
      toast.error('Failed to mark as paid');
    } finally {
      setIsMarkingPaid(false);
    }
  };

  if (!open) return null;

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  const fmtCurrency = (n) =>
    n != null ? `₦${Number(n).toLocaleString('en-NG', { minimumFractionDigits: 2 })}` : '—';

  const isPaid = invoice?.paymentStatus?.toLowerCase() === 'paid';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Invoice Detail</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : invoice ? (
            <div className="space-y-5">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Invoice #{invoice.invoiceNumber || '—'}</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    isPaid
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-green-500' : 'bg-amber-500'}`} />
                  {invoice.paymentStatus || '—'}
                </span>
              </div>

              {/* Client Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Client Name</p>
                    <p className="text-sm font-semibold text-gray-900">{invoice.clientName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Client Email</p>
                    <p className="text-sm text-gray-700">{invoice.clientEmail || '—'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Client Address</p>
                  <p className="text-sm text-gray-700">{invoice.clientAddress || '—'}</p>
                </div>
              </div>

              {/* Dates & Amount */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Date Issued</p>
                  <p className="text-sm font-semibold text-gray-900">{fmtDate(invoice.dateIssued)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Due Date</p>
                  <p className="text-sm font-semibold text-gray-900">{fmtDate(invoice.dueDate)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Total Amount</p>
                  <p className="text-sm font-bold text-gray-900">{fmtCurrency(invoice.totalAmount)}</p>
                </div>
              </div>

              {/* Line Items */}
              {invoice.lineItems && invoice.lineItems.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-900 mb-2">Line Items</p>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-gray-50 text-[10px] font-semibold text-gray-400 uppercase">
                      <div className="col-span-5">Description</div>
                      <div className="col-span-2 text-right">Qty</div>
                      <div className="col-span-2 text-right">Unit Price</div>
                      <div className="col-span-3 text-right">Total</div>
                    </div>
                    {invoice.lineItems.map((item, i) => (
                      <div key={i} className="grid grid-cols-12 gap-2 px-3 py-2.5 border-t border-gray-100 text-sm">
                        <div className="col-span-5 text-gray-800">{item.description || '—'}</div>
                        <div className="col-span-2 text-right text-gray-600">{item.quantity ?? '—'}</div>
                        <div className="col-span-2 text-right text-gray-600">{fmtCurrency(item.unitPrice)}</div>
                        <div className="col-span-3 text-right font-semibold text-gray-900">{fmtCurrency(item.total)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {invoice.lineItems?.length === 0 && (
                <div className="text-center py-4 text-sm text-gray-400">No line items</div>
              )}

              {/* Notes */}
              {invoice.notes && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Notes</p>
                  <p className="text-sm text-gray-600">{invoice.notes}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400">Created</p>
                  <p className="text-xs text-gray-500">{fmtDate(invoice.createdAt)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">Last Updated</p>
                  <p className="text-xs text-gray-500">{fmtDate(invoice.updatedAt)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-gray-400">Invoice not found</div>
          )}
        </div>

        {/* Footer */}
        {invoice && !isLoading && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            {!isPaid && (
              <button
                onClick={handleMarkPaid}
                disabled={isMarkingPaid}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-colors disabled:opacity-60"
              >
                {isMarkingPaid && (
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {isMarkingPaid ? 'Updating...' : 'Mark as Paid'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetailModal;
