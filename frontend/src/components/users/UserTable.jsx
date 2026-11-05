import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Chip, IconButton, Tooltip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CheckCircle as ActivateIcon,
  Block as DeactivateIcon
} from '@mui/icons-material';

const roleColor = (role) =>
  role === 'admin' ? 'secondary' : role === 'manager' ? 'primary' : 'default';

const UserTable = ({
  users,
  currentUserId,
  canStatus,
  canDelete,
  showActionsColumn,   
  onStatusChange,
  onDelete
}) => {
  const colCount = showActionsColumn ? 5 : 4;

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            {showActionsColumn && <TableCell align="right">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={colCount} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                No users
              </TableCell>
            </TableRow>
          ) : (
            users.map((u) => {
              const isSelf = u.id === currentUserId;
              const isActive = u.status === 'active';
              return (
                <TableRow key={u.id} hover>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Chip size="small" label={u.role} color={roleColor(u.role)} />
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={u.status} color={isActive ? 'success' : 'error'} />
                  </TableCell>
                  {showActionsColumn && (
                    <TableCell align="right">
                      {canStatus && (
                        <Tooltip title={isActive ? 'Deactivate' : 'Activate'}>
                          <span>
                            <IconButton
                              size="small"
                              color={isActive ? 'warning' : 'success'}
                              onClick={() => onStatusChange(u.id, isActive ? 'deactivated' : 'active')}
                              disabled={isSelf}
                            >
                              {isActive ? <DeactivateIcon fontSize="small" /> : <ActivateIcon fontSize="small" />}
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                      {canDelete && (
                        <Tooltip title="Delete">
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => onDelete(u.id)}
                              disabled={isSelf}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;