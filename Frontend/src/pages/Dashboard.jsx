import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import RaiseReimbursement from '../components/EMP/RaiseReimbursement';
import ReimbursementsList from '../components/EMP/ReimbursementsList';
import ApprovalsList from '../components/RM_APE_CFO/ApprovalsList';
import SubordinateReimbursements from '../components/RM_APE_CFO/SubordinateReimbursements';
import EmployeeList from '../components/CFO/EmployeeList';
import { ROUTES } from '../constants/routes';
import api from '../api/axiosInstance';
import { API_ENDPOINTS } from '../api/endpoints';
import { errorToast } from '../utils/toast';
import {
  IoReceiptOutline,
  IoGitNetworkOutline,
  IoPeopleOutline,
  IoShieldCheckmarkOutline,
  IoFileTrayFullOutline
} from 'react-icons/io5';

export default function Dashboard({ auth }) {
  const { user, logout } = auth;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('');
  const [reimbursements, setReimbursements] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN);
    }
  }, [user, navigate]);

  // Determine tabs based on role
  const getTabsForRole = useCallback((role) => {
    switch (role) {
      case 'EMP':
        return [
          { id: 'claims', label: 'My Claims', icon: <IoReceiptOutline className="h-5 w-5" /> }
        ];
      case 'RM':
        return [
          { id: 'approvals', label: 'Pending Approvals', icon: <IoShieldCheckmarkOutline className="h-5 w-5" /> },
          { id: 'subordinate_claims', label: 'Subordinate Claims', icon: <IoFileTrayFullOutline className="h-5 w-5" /> },
          { id: 'directory', label: 'My Team', icon: <IoPeopleOutline className="h-5 w-5" /> }
        ];
      case 'APE':
        return [
          { id: 'approvals', label: 'Pending Audits', icon: <IoShieldCheckmarkOutline className="h-5 w-5" /> },
          { id: 'subordinate_claims', label: 'Subordinate Viewer', icon: <IoFileTrayFullOutline className="h-5 w-5" /> },
          { id: 'directory', label: 'System Directory', icon: <IoPeopleOutline className="h-5 w-5" /> }
        ];
      case 'CFO':
        return [
          { id: 'directory', label: 'System Directory & Org', icon: <IoGitNetworkOutline className="h-5 w-5" /> },
          { id: 'subordinate_claims', label: 'Subordinate Viewer', icon: <IoFileTrayFullOutline className="h-5 w-5" /> },
          { id: 'approvals', label: 'Finalized Claims', icon: <IoReceiptOutline className="h-5 w-5" /> }
        ];
      default:
        return [];
    }
  }, []);

  const tabs = user ? getTabsForRole(user.role) : [];

  // Set default tab on load
  useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  // Fetch data depending on active tab
  const fetchData = useCallback(async () => {
    if (!user || !activeTab) return;
    setLoading(true);

    try {
      if (activeTab === 'claims') {
        const res = await api.get(API_ENDPOINTS.REIMBURSEMENTS);
        setReimbursements(res.data.data.reimbursements);
      } else if (activeTab === 'approvals') {
        const res = await api.get(API_ENDPOINTS.REIMBURSEMENTS);
        setReimbursements(res.data.data.reimbursements);
      } else if (activeTab === 'directory') {
        const res = await api.get(API_ENDPOINTS.EMPLOYEES);
        setEmployees(res.data.data.users);
      } else if (activeTab === 'subordinate_claims') {
        // We load directory first so select fields can be populated
        const res = await api.get(API_ENDPOINTS.EMPLOYEES);
        setEmployees(res.data.data.users);
      }
    } catch (err) {
      // Don't show toast if it's a 403 on tab load due to switching roles mid-session
      if (err?.response?.status !== 403) {
        errorToast(err);
      }
    } finally {
      setLoading(false);
    }
  }, [user, activeTab]);

  useEffect(() => {
    fetchData();
  }, [activeTab, fetchData]);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'claims':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">My Reimbursement Claims</h1>
                <p className="text-gray-400 text-sm">Submit and track your expenses</p>
              </div>
              <RaiseReimbursement onCreated={fetchData} />
            </div>
            <ReimbursementsList reimbursements={reimbursements} loading={loading} />
          </div>
        );

      case 'approvals':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user.role === 'CFO' ? 'Finalized Claims' : 'Pending Approvals'}
              </h1>
              <p className="text-gray-400 text-sm">
                {user.role === 'CFO' 
                  ? 'All claims approved by Accounts Payable' 
                  : user.role === 'APE' 
                    ? 'Auditing claims approved by managers' 
                    : 'Approve or reject claims from your subordinates'}
              </p>
            </div>
            <ApprovalsList
              reimbursements={reimbursements}
              loading={loading}
              role={user.role}
              onAction={fetchData}
            />
          </div>
        );

      case 'directory':
        if (user.role === 'CFO') {
          return (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Organization Control Center</h1>
                <p className="text-gray-400 text-sm">Manage user roles, report configurations, and directory accounts</p>
              </div>
              <EmployeeList users={employees} onRefresh={fetchData} />
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user.role === 'RM' ? 'My Direct Reports' : 'System Directory'}
              </h1>
              <p className="text-gray-400 text-sm">
                {user.role === 'RM' 
                  ? 'Employees registered as reporting directly to you' 
                  : 'Register of employees and managers in organization'}
              </p>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/40">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs uppercase bg-gray-950/60 text-gray-400 border-b border-gray-850">
                  <tr>
                    <th scope="col" className="px-6 py-3.5">Name</th>
                    <th scope="col" className="px-6 py-3.5">Email</th>
                    <th scope="col" className="px-6 py-3.5">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-850">
                  {employees.map((emp) => (
                    <tr key={emp.userId} className="hover:bg-gray-850/10">
                      <td className="px-6 py-4 font-semibold text-white">{emp.name}</td>
                      <td className="px-6 py-4 text-gray-400">{emp.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          emp.role === 'RM' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
                        }`}>
                          {emp.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {employees.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center py-6 text-gray-500">
                        No team members registered.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'subordinate_claims':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Employee Reimbursements</h1>
              <p className="text-gray-400 text-sm">Select subordinates to view historical claims and act on pending requests</p>
            </div>
            <SubordinateReimbursements role={user.role} users={employees} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout
      user={user}
      onLogout={handleLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tabs={tabs}
    >
      {renderContent()}
    </Layout>
  );
}
