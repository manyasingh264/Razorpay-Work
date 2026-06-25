import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import ApprovalsList from './ApprovalsList';
import api from '../../api/axiosInstance';
import { API_ENDPOINTS } from '../../api/endpoints';
import { errorToast } from '../../utils/toast';
import { IoPersonOutline, IoRefresh } from 'react-icons/io5';

export default function SubordinateReimbursements({ role, users }) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [reimbursements, setReimbursements] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter available employees to view.
  // RM can see their subordinates (which are already pre-filtered by the backend in GET /rest/employees)
  // APE/CFO see everyone from GET /rest/employees, but we filter for EMP role because the endpoint
  // GET /rest/reimbursements/<user-id> only allows EMP target users.
  const employees = users.filter((u) => u.role === 'EMP');

  const fetchClaims = useCallback(async (userId) => {
    if (!userId) {
      setReimbursements([]);
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`${API_ENDPOINTS.REIMBURSEMENTS}/${userId}`);
      setReimbursements(response.data.data.reimbursements);
    } catch (err) {
      errorToast(err);
      setReimbursements([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClaims(selectedUserId);
  }, [selectedUserId, fetchClaims]);

  return (
    <div className="space-y-6">
      
      {/* Subordinate Selector */}
      <Card className="border-gray-800 bg-gray-900/40">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Subordinate Claims Viewer</CardTitle>
            <CardDescription>Select an employee to view their individual claims history</CardDescription>
          </div>
          {selectedUserId && (
            <Button
              variant="outline"
              size="icon"
              className="border-gray-800 hover:bg-gray-850"
              onClick={() => fetchClaims(selectedUserId)}
              disabled={loading}
            >
              <IoRefresh className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-full sm:max-w-xs">
              <Select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">-- Choose Employee --</option>
                {employees.map((emp) => (
                  <option key={emp.userId} value={emp.userId}>
                    {emp.name} ({emp.email})
                  </option>
                ))}
              </Select>
            </div>
            {!selectedUserId && (
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <IoPersonOutline /> Select an employee from the dropdown to load history.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Claims List */}
      {selectedUserId && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider px-1">
            Claims History for {employees.find((e) => e.userId === selectedUserId)?.name || 'Employee'}
          </h4>
          <ApprovalsList
            reimbursements={reimbursements}
            loading={loading}
            role={role}
            onAction={() => fetchClaims(selectedUserId)}
            subordinateMode={true}
          />
        </div>
      )}

    </div>
  );
}
