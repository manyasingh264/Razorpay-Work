import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import api from '../../api/axiosInstance';
import { API_ENDPOINTS } from '../../api/endpoints';
import { successToast, errorToast } from '../../utils/toast';
import { IoAddCircleOutline } from 'react-icons/io5';

export default function RaiseReimbursement({ onCreated }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !amount) {
      return errorToast('Please fill in all fields');
    }
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return errorToast('Amount must be a positive number');
    }

    setLoading(true);
    try {
      await api.post(API_ENDPOINTS.REIMBURSEMENTS, {
        title,
        description,
        amount: numAmount,
      });
      successToast('Reimbursement raised successfully!');
      setTitle('');
      setDescription('');
      setAmount('');
      setOpen(false);
      if (onCreated) onCreated();
    } catch (err) {
      errorToast(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
        <IoAddCircleOutline className="h-5 w-5" /> Raise Reimbursement
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>Raise Reimbursement</DialogTitle>
          <DialogDescription>
            Submit a new reimbursement request. It will start with a PENDING status.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase">Title</label>
              <Input
                placeholder="e.g. Client Dinner"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase">Description</label>
              <textarea
                placeholder="Detail the expenses incurred..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={loading}
                className="flex w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase">Amount (INR)</label>
              <Input
                type="number"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </DialogContent>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Claim'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
}
