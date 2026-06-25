import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Select } from '../ui/select';
import api from '../../api/axiosInstance';
import { API_ENDPOINTS } from '../../api/endpoints';
import { successToast, errorToast } from '../../utils/toast';
import { IoShieldCheckmark, IoGitCompareOutline, IoPersonOutline, IoBriefcaseOutline } from 'react-icons/io5';

export default function EmployeeList({ users, onRefresh }) {
  const [assignLoading, setAssignLoading] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState('');
  const [selectedRm, setSelectedRm] = useState('');

  // Group users by role for selections
  const employees = users.filter((u) => u.role === 'EMP');
  const managers = users.filter((u) => u.role === 'RM');

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.post(API_ENDPOINTS.ASSIGN_ROLE, { userId, role: newRole });
      successToast(`Role updated successfully to ${newRole}`);
      if (onRefresh) onRefresh();
    } catch (err) {
      errorToast(err);
    }
  };

  const handleAssignManager = async (e) => {
    e.preventDefault();
    if (!selectedEmp || !selectedRm) {
      return errorToast('Please select both Employee and Manager');
    }

    setAssignLoading(true);
    try {
      await api.post(API_ENDPOINTS.ASSIGN_MANAGER, {
        employeeId: selectedEmp,
        managerId: selectedRm,
      });
      successToast('Employee assigned to Manager successfully!');
      setSelectedEmp('');
      setSelectedRm('');
      if (onRefresh) onRefresh();
    } catch (err) {
      errorToast(err);
    } finally {
      setAssignLoading(false);
    }
  };

  const handleRemoveAssignment = async () => {
    if (!selectedEmp || !selectedRm) {
      return errorToast('Please select both Employee and Manager to remove association');
    }

    setAssignLoading(true);
    try {
      await api.delete(API_ENDPOINTS.REMOVE_ASSIGNMENT, {
        data: {
          employeeId: selectedEmp,
          managerId: selectedRm,
        },
      });
      successToast('Assignment removed successfully!');
      setSelectedEmp('');
      setSelectedRm('');
      if (onRefresh) onRefresh();
    } catch (err) {
      errorToast(err);
    } finally {
      setAssignLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'CFO':
        return <IoShieldCheckmark className="text-red-400 h-4 w-4" />;
      case 'RM':
        return <IoBriefcaseOutline className="text-yellow-400 h-4 w-4" />;
      case 'APE':
        return <IoShieldCheckmark className="text-purple-400 h-4 w-4" />;
      default:
        return <IoPersonOutline className="text-green-400 h-4 w-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
      
      {/* Users & Roles Table */}
      <Card className="lg:col-span-2 border-gray-800 bg-gray-900/40">
        <CardHeader>
          <CardTitle>System Directory</CardTitle>
          <CardDescription>Manage user roles and view system accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-gray-950/60 text-gray-400 border-b border-gray-850">
                <tr>
                  <th scope="col" className="px-6 py-3.5">Name</th>
                  <th scope="col" className="px-6 py-3.5">Email</th>
                  <th scope="col" className="px-6 py-3.5">Role</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-850">
                {users.map((u) => (
                  <tr key={u.userId} className="hover:bg-gray-850/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">{u.name}</td>
                    <td className="px-6 py-4 text-gray-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-medium">
                        {getRoleIcon(u.role)}
                        <span>{u.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-block w-32">
                        <Select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.userId, e.target.value)}
                          className="h-8 text-xs py-1"
                        >
                          <option value="EMP">EMP</option>
                          <option value="RM">RM</option>
                          <option value="APE">APE</option>
                          <option value="CFO">CFO</option>
                        </Select>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      No users registered in organization.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Reporting Manager Assignment */}
      <Card className="border-gray-800 bg-gray-900/40">
        <CardHeader>
          <CardTitle>Org Assignment</CardTitle>
          <CardDescription>Link Employees to their Reporting Managers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAssignManager} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Select Employee (EMP)</label>
              <Select
                value={selectedEmp}
                onChange={(e) => setSelectedEmp(e.target.value)}
                required
              >
                <option value="">-- Choose Employee --</option>
                {employees.map((emp) => (
                  <option key={emp.userId} value={emp.userId}>
                    {emp.name} ({emp.email})
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Select Manager (RM)</label>
              <Select
                value={selectedRm}
                onChange={(e) => setSelectedRm(e.target.value)}
                required
              >
                <option value="">-- Choose Manager --</option>
                {managers.map((rm) => (
                  <option key={rm.userId} value={rm.userId}>
                    {rm.name} ({rm.email})
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button type="submit" disabled={assignLoading} className="w-full flex items-center justify-center gap-2">
                <IoGitCompareOutline className="h-4 w-4" /> Link Subordinate
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={assignLoading}
                className="w-full"
                onClick={handleRemoveAssignment}
              >
                Remove Assignment
              </Button>
            </div>
          </form>

          <div className="p-4 rounded-lg bg-gray-950/40 border border-gray-850 text-xs text-gray-400 leading-relaxed mt-4">
            <h5 className="font-semibold text-gray-300 mb-1">Organization Rule</h5>
            A group of employees reports to exactly one RM. RMs can view and approve pending claims of their direct employees.
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
