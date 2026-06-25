import React from 'react';
import { Card, CardContent } from '../ui/card';
import { IoCheckmarkCircle, IoTimeOutline, IoCloseCircle } from 'react-icons/io5';

export default function ReimbursementsList({ reimbursements, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!reimbursements || reimbursements.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl bg-gray-900/20">
        <IoTimeOutline className="h-12 w-12 text-gray-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-300">No Claims Found</h3>
        <p className="text-sm text-gray-500 mt-1">You have not raised any reimbursement claims yet.</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <IoCheckmarkCircle className="h-3.5 w-3.5" /> Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <IoCloseCircle className="h-3.5 w-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <IoTimeOutline className="h-3.5 w-3.5" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {reimbursements.map((r, idx) => (
        <Card key={idx} className="border-gray-800 bg-gray-900/40 hover:bg-gray-900/60 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className="text-lg font-bold text-white">{r.title}</h4>
                  {getStatusBadge(r.status)}
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{r.description}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount Claimed</p>
                <p className="text-2xl font-extrabold text-white mt-1">
                  ₹{Number(r.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Approval Stepper Progress */}
            <div className="mt-6 pt-4 border-t border-gray-850/30">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Approval Progress</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {/* Step 1: Raised */}
                <div className="flex flex-col gap-1.5">
                  <div className="h-2 rounded bg-blue-500 animate-pulse" />
                  <span className="font-semibold text-blue-400">1. Raised</span>
                  <span className="text-[10px] text-gray-500">Claim submitted</span>
                </div>

                {/* Step 2: RM Approval */}
                <div className="flex flex-col gap-1.5">
                  <div className={`h-2 rounded ${
                    r.status === 'APPROVED' ? 'bg-emerald-500' :
                    r.status === 'REJECTED' ? 'bg-red-500' :
                    'bg-gray-800'
                  }`} />
                  <span className={`font-semibold ${r.status === 'APPROVED' ? 'text-emerald-400' : r.status === 'REJECTED' ? 'text-red-400' : 'text-gray-400'}`}>
                    2. RM Review
                  </span>
                  <span className="text-[10px] text-gray-500">Reporting Manager</span>
                </div>

                {/* Step 3: APE Approval */}
                <div className="flex flex-col gap-1.5">
                  <div className={`h-2 rounded ${
                    r.status === 'APPROVED' ? 'bg-emerald-500' :
                    r.status === 'REJECTED' ? 'bg-red-500' :
                    'bg-gray-800'
                  }`} />
                  <span className={`font-semibold ${r.status === 'APPROVED' ? 'text-emerald-400' : r.status === 'REJECTED' ? 'text-red-400' : 'text-gray-400'}`}>
                    3. APE Review
                  </span>
                  <span className="text-[10px] text-gray-500">Accounts Payable</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
