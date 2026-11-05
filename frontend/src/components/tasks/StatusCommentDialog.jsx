import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography, Box, Alert, Chip, Stack
} from '@mui/material';

const statusColors = { pending: 'warning', 'in-progress': 'info', completed: 'success' };


const StatusCommentDialog = ({
  open,
  onClose,
  onConfirm,
  taskTitle = '',
  currentStatus = '',
  nextStatus = '',
  requireComment = false,
  loading = false
}) => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) { setComment(''); setError(''); }
  }, [open]);

  const handleConfirm = () => {
    const trimmed = comment.trim();
    if (requireComment && !trimmed) {
      setError('A comment is required for this change');
      return;
    }
    if (trimmed.length > 500) {
      setError('Comment must be 500 characters or less');
      return;
    }
    onConfirm(trimmed);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Change status</DialogTitle>
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Typography variant="body2">Task:</Typography>
            <Typography variant="body2" fontWeight={600}>{taskTitle}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <Chip size="small" label={currentStatus} color={statusColors[currentStatus] || 'default'} />
            <Typography variant="body2">→</Typography>
            <Chip size="small" label={nextStatus} color={statusColors[nextStatus] || 'default'} />
          </Stack>
        </Alert>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {requireComment
            ? 'Add a comment explaining this change (required):'
            : 'Add an optional comment for your manager / admin:'}
        </Typography>

        <TextField
          multiline
          rows={4}
          fullWidth
          placeholder="e.g. Blocked by API dependency, waiting for backend fix..."
          value={comment}
          onChange={(e) => { setComment(e.target.value); if (error) setError(''); }}
          error={!!error}
          helperText={error || `${comment.length}/500 characters`}
          inputProps={{ maxLength: 500 }}
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Confirm change'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusCommentDialog;