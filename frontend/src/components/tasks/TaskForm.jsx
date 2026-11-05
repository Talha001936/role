import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Box, Chip, Stack, Typography, Alert
} from '@mui/material';
import ConfirmDialog from '../common/ConfirmDialog';

const emptyForm = { title: '', description: '', assignedTo: '', dueDate: '' };

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const TaskForm = ({ open, onClose, onSubmit, task, employees }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [needsReassign, setNeedsReassign] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (task) {
      
      const currentAssigneeEligible = employees.some(
        (e) => String(e.id) === String(task.assignedTo)
      );
      const forceReassign = task.requiresReassignment || !currentAssigneeEligible;

      setForm({
        title: task.title || '',
        description: task.description || '',

        assignedTo: forceReassign ? '' : task.assignedTo || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
      });
      setNeedsReassign(forceReassign);
      setErrors(
        forceReassign
          ? { assignedTo: 'Previous assignee is no longer eligible. Please pick a new one.' }
          : {}
      );
    } else {
      setForm(emptyForm);
      setNeedsReassign(false);
      setErrors({});
    }
    setConfirmOpen(false);
  }, [task, open, employees]);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    else if (form.title.length > 100) e.title = 'Max 100 characters';
    if (!form.assignedTo) e.assignedTo = 'Please select an assignee';
    if (!form.dueDate) e.dueDate = 'Due date is required';
    else if (form.dueDate < todayStr()) e.dueDate = 'Due date cannot be earlier than today';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFormSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setConfirmOpen(true);
  };

  const doSubmit = async () => {
    setSubmitting(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      assignedTo: form.assignedTo,
      dueDate: form.dueDate
    };
    const result = await onSubmit(payload);
    setSubmitting(false);
    setConfirmOpen(false);
    if (result?.success !== false) onClose();
  };

  const actionLabel = task ? 'Update' : 'Create';
  const selectedAssignee = employees.find((e) => String(e.id) === String(form.assignedTo));

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{task ? 'Edit Task' : 'New Task'}</DialogTitle>
        <form onSubmit={handleFormSubmit} noValidate>
          <DialogContent>
            {needsReassign && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                This task needs a new assignee. The previous one is inactive or was deleted.
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
              <TextField label="Title" name="title" value={form.title} onChange={change}
                error={!!errors.title} helperText={errors.title} fullWidth autoFocus />
              <TextField label="Description" name="description" value={form.description}
                onChange={change} multiline rows={3} fullWidth />

              <TextField
                select
                label="Assign To"
                name="assignedTo"
                value={form.assignedTo}
                onChange={change}
                error={!!errors.assignedTo}
                helperText={
                  errors.assignedTo ||
                  'Only active users with fewer than 3 active tasks are shown'
                }
                fullWidth
              >
                {employees.length === 0 && (
                  <MenuItem disabled value="">No eligible assignees</MenuItem>
                )}
                {employees.map((e) => (
                  <MenuItem key={e.id} value={e.id}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>{e.name}</Typography>
                      {e.role && (
                        <Chip size="small" label={e.role}
                          color={e.role === 'manager' ? 'primary' : 'default'} />
                      )}
                      {typeof e.activeTaskCount === 'number' && (
                        <Chip size="small" variant="outlined"
                          label={`${e.activeTaskCount}/3`} />
                      )}
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>

              <TextField label="Due Date" name="dueDate" type="date"
                value={form.dueDate} onChange={change}
                error={!!errors.dueDate} helperText={errors.dueDate}
                inputProps={{ min: todayStr() }}
                InputLabelProps={{ shrink: true }}
                fullWidth />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={submitting}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Saving...' : actionLabel}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        title={`${actionLabel} task?`}
        message={
          task
            ? `Are you sure you want to update "${form.title}"?`
            : `Create "${form.title}" and assign it to ${selectedAssignee?.name || 'selected user'}?`
        }
        confirmText={actionLabel}
        confirmColor="primary"
        loading={submitting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={doSubmit}
      />
    </>
  );
};

export default TaskForm;