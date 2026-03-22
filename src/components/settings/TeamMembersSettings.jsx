import { useState, useEffect } from 'react';
import { UserPlus, Loader, Trash2, Edit } from 'lucide-react';
import { inviteTeamMember, getTeamInvitations, getTeamMembers } from '../../services/settingsApi';

const TeamMembersSettings = () => {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteData, setInviteData] = useState({
    name: '',
    email: '',
    role: 'consultant',
  });
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'consultant', label: 'Consultant' },
    { value: 'viewer', label: 'Viewer' },
  ];

  // Fetch team data
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [membersResponse, invitationsResponse] = await Promise.all([
          getTeamMembers(),
          getTeamInvitations(),
        ]);

        // Combine members and pending invitations into one list
        const combinedList = [];

        if (membersResponse.status && membersResponse.data) {
          const membersList = membersResponse.data.members || membersResponse.data;
          const members = Array.isArray(membersList) ? membersList : [];
          members.forEach(member => {
            combinedList.push({
              ...member,
              status: 'active',
              type: 'member',
            });
          });
        }

        if (invitationsResponse.status && invitationsResponse.data) {
          const invitationsList = invitationsResponse.data.invitations || invitationsResponse.data;
          const invitations = Array.isArray(invitationsList) ? invitationsList : [];
          invitations.forEach(invitation => {
            combinedList.push({
              id: invitation.id,
              name: invitation.name || '',
              email: invitation.email,
              role: invitation.role,
              status: 'pending',
              type: 'invitation',
            });
          });
        }

        setTeamMembers(combinedList);
      } catch (err) {
        console.error('Team data fetch error:', err);
        setError(err.message || 'Failed to load team data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  const handleInviteChange = (e) => {
    const { name, value } = e.target;
    setInviteData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSuccessMessage('');
    setError(null);
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSending(true);
      setError(null);
      setSuccessMessage('');

      const response = await inviteTeamMember(inviteData);

      if (response.status) {
        setSuccessMessage(`Invitation sent to ${inviteData.email} successfully!`);
        // Reset form
        setInviteData({
          name: '',
          email: '',
          role: 'consultant',
        });
        setShowInviteForm(false);

        // Add new invitation to the list
        const newInvitation = {
          id: Date.now().toString(),
          name: inviteData.name,
          email: inviteData.email,
          role: inviteData.role,
          status: 'pending',
          type: 'invitation',
        };
        setTeamMembers(prev => [...prev, newInvitation]);

        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(response.message || 'Failed to send invitation');
      }
    } catch (err) {
      console.error('Invite error:', err);
      setError(err.message || 'Failed to send invitation');
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!confirm('Are you sure you want to remove this team member?')) {
      return;
    }

    try {
      // API call to delete member
      // await deleteTeamMember(memberId);
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
      setSuccessMessage('Team member removed successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to remove team member');
    }
  };

  const handleEditMember = (memberId) => {
    // Implementation for editing member
    console.log('Edit member:', memberId);
    // This would typically open a modal or navigate to an edit form
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Team Members</h2>
          <p className="text-sm text-gray-500">
            Manage team access and permissions
          </p>
        </div>
        <button
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Invite Form */}
      {showInviteForm && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Invite Team Member</h3>
          <form onSubmit={handleInviteSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={inviteData.name}
                  onChange={handleInviteChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={inviteData.email}
                  onChange={handleInviteChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={inviteData.role}
                onChange={handleInviteChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowInviteForm(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Send Invitation
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Team Members Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teamMembers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>No team members yet. Invite someone to get started.</p>
                </td>
              </tr>
            ) : (
              teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {member.name || 'Unnamed'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{member.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 capitalize">{member.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                        member.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {member.status === 'active' ? 'Active' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditMember(member.id)}
                        className="px-3 py-1 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamMembersSettings;
