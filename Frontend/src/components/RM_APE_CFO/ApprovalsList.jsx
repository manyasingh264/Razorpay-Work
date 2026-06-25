import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { IoCheckmark, IoClose, IoAlertCircleOutline } from 'react-icons/io5';
import api from '../../api/axiosInstance';
import { API_ENDPOINTS } from '../../api/endpoints';
import { successToast, errorToast } from '../../utils/toast';

export default function ApprovalsList({ reimbursements, loading, role, onAction, subordinateMode = false }) {
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const handleAction = async (reimbursementId, status) => {
    setActionLoadingId(reimbursementId);
    try {
      await api.patch(API_ENDPOINTS.REIMBURSEMENTS, {
        reimbursementId,
        status, // APPROVED or REJECTED
      });
      successToast(`Claim successfully ${status.toLowerCase()}`);
      if (onAction) onAction();
    } catch (err) {
      errorToast(err);
    } finally {
      setActionLoadingId(null);
    }
  };

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
        <IoAlertCircleOutline className="h-12 w-12 text-gray-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-300">No Claims to Display</h3>
        <p className="text-sm text-gray-500 mt-1">
          {subordinateMode 
            ? 'No claims have been submitted by this employee.' 
            : 'All caught up! No claims are waiting for your review.'}
        </p>
      </div>
    );
  }

  // Determine if the current user can act on this specific reimbursement in this view
  const canAct = (r) => {
    if (r.status === 'APPROVED' || r.status === 'REJECTED') return false;
    
    // CFO can act on anything not finalized
    if (role === 'CFO') return true;

    // RM can act on PENDING
    if (role === 'RM' && r.status === 'PENDING') return true;

    // APE can act on RM_APPROVED
    if (role === 'APE' && r.status === 'RM_APPROVED') return true;

    return false;
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {reimbursements.map((r, idx) => (
        <Card key={r.id || idx} className="border-gray-800 bg-gray-900/40 hover:bg-gray-900/60 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className="text-lg font-bold text-white">{r.title}</h4>
                  
                  {/* Status Badge */}
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    r.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    r.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    r.status === 'RM_APPROVED' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {r.status === 'RM_APPROVED' ? 'RM APPROVED (Pending APE)' : r.status}
                  </span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{r.description}</p>
                {r.id && (
                  <p className="text-[10px] text-gray-650 font-mono">Claim ID: {r.id}</p>
                )}
              </div>

              <div className="flex items-center md:items-end justify-between md:justify-center md:flex-col gap-4 shrink-0 w-full md:w-auto">
                <div className="text-left md:text-right">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount Claimed</p>
                  <p className="text-2xl font-extrabold text-white mt-1">
                    ₹{Number(r.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Actions */}
                {canAct(r) && (
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-1 font-semibold"
                      disabled={actionLoadingId !== null}
                      onClick={() => handleAction(r.id, 'REJECTED')}
                    >
                      <IoClose className="h-4 w-4" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-500 gap-1 font-semibold"
                      disabled={actionLoadingId !== null}
                      onClick={() => handleAction(r.id, 'APPROVED')}
                    >
                      <IoCheckmark className="h-4 w-4" /> Approve
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
