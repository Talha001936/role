import { Box, Stack, Typography, Paper, Chip, Divider } from '@mui/material';
import { ChatBubbleOutline as CommentIcon } from '@mui/icons-material';

const statusColors = { pending: 'warning', 'in-progress': 'info', completed: 'success' };

const TaskComments = ({ comments = [] }) => {
  if (!comments || comments.length === 0) {
    return (
      <Box sx={{ py: 2, textAlign: 'center', color: 'text.secondary' }}>
        <CommentIcon sx={{ mb: 0.5 }} />
        <Typography variant="caption" display="block">No comments yet</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={1.5} sx={{ maxHeight: 320, overflowY: 'auto', pr: 0.5 }}>
      {comments.slice().reverse().map((c) => (
        <Paper
          key={c.id}
          sx={{
            p: 1.5, borderRadius: 2,
            backgroundColor: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" fontWeight={700}>{c.byName}</Typography>
              <Chip size="small" label={c.role} variant="outlined" />
              {c.statusAtTime && (
                <Chip
                  size="small"
                  variant="outlined"
                  label={c.statusAtTime}
                  color={statusColors[c.statusAtTime] || 'default'}
                />
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {new Date(c.createdAt).toLocaleString()}
            </Typography>
          </Stack>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {c.text}
          </Typography>
        </Paper>
      ))}
    </Stack>
  );
};

export default TaskComments;