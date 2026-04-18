import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  UserCheck,
  UserX,
  Search,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import {
  getAllUsers,
  toggleUserStatus,
  type AdminUserResponse,
} from '@/services/admin.service'

export function UserManagementPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<AdminUserResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllUsers()
      setUsers(data)
    } catch (err) {
      setError('Failed to load users')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleToggle = async (target: AdminUserResponse) => {
    setTogglingId(target.id)
    try {
      await toggleUserStatus(target.id)
      setUsers((prev) =>
        prev.map((u) => (u.id === target.id ? { ...u, isActive: !u.isActive } : u))
      )
      toast.success(
        `${target.firstName} ${target.lastName} is now ${target.isActive ? 'inactive' : 'active'}`
      )
    } catch {
      toast.error('Failed to update user status')
    } finally {
      setTogglingId(null)
    }
  }

  const filtered = users.filter((u) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      u.email.toLowerCase().includes(q) ||
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    )
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col justify-center items-center min-h-[400px] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-destructive">{error}</p>
        <Button onClick={fetchUsers} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 -ml-3">
            <Link to="/admin/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold mb-1">User Management</h1>
          <p className="text-muted-foreground">
            Activate or deactivate existing user accounts
          </p>
        </div>
        <Button onClick={fetchUsers} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Users ({users.length})</CardTitle>
              <CardDescription>
                {users.filter((u) => u.isActive).length} active,{' '}
                {users.filter((u) => !u.isActive).length} inactive
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, role"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {users.length === 0 ? 'No users found.' : 'No users match your search.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-3 pr-4 font-medium">User</th>
                    <th className="py-3 pr-4 font-medium">Email</th>
                    <th className="py-3 pr-4 font-medium">Role</th>
                    <th className="py-3 pr-4 font-medium">Status</th>
                    <th className="py-3 pr-4 font-medium">Joined</th>
                    <th className="py-3 pr-0 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => {
                    const isSelf = currentUser?.id === u.id
                    const isBusy = togglingId === u.id
                    return (
                      <tr key={u.id} className="border-b last:border-0 hover:bg-slate-50">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-sm font-medium text-primary">
                                {u.firstName?.[0]}
                                {u.lastName?.[0]}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">
                                {u.firstName} {u.lastName}
                                {isSelf && (
                                  <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                                )}
                              </p>
                              {u.companyName && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {u.companyName}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">{u.email}</td>
                        <td className="py-3 pr-4">
                          <Badge variant={u.role === 'Admin' ? 'default' : 'secondary'}>
                            {u.role}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge
                            variant="outline"
                            className={
                              u.isActive
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                : 'border-slate-300 bg-slate-50 text-slate-600'
                            }
                          >
                            {u.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 pr-0 text-right">
                          <Button
                            size="sm"
                            variant={u.isActive ? 'outline' : 'default'}
                            disabled={isSelf || isBusy}
                            onClick={() => handleToggle(u)}
                            title={isSelf ? 'You cannot deactivate your own account' : undefined}
                          >
                            {isBusy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : u.isActive ? (
                              <>
                                <UserX className="h-4 w-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
