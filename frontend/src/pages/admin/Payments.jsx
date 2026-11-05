import { useEffect, useState, useMemo } from 'react';
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Stack, CircularProgress, TextField,
  InputAdornment, Button, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions, Divider, Grid, Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Sync as SyncIcon,
  CloudSync as CloudSyncIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { paymentService } from '../../services/paymentService';
import { useToast } from '../../context/toastcontext';

const formatMoney = (cents, currency = 'usd') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase()
  }).format((cents || 0) / 100);

const typeColor = { signup: 'primary', subscription: 'secondary' };
const statusColor = {
  succeeded: 'success',
  failed: 'error',
  pending: 'warning',
  refunded: 'default'
};

const Payments = () => {
  const toast = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [reconcilingAll, setReconcilingAll] = useState(false);
  const [reconcilingUserId, setReconcilingUserId] = useState(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await paymentService.listAllPayments();
      setPayments(res.data.payments || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return payments;
    return payments.filter((p) =>
      (p.userName || '').toLowerCase().includes(q) ||
      (p.userEmail || '').toLowerCase().includes(q) ||
      (p.id || '').toLowerCase().includes(q)
    );
  }, [payments, search]);

  const handleReconcileAll = async () => {
    setReconcilingAll(true);
    try {
      const res = await paymentService.reconcileAll();
      toast.success(res.data.message || 'Reconciled with Stripe');
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reconcile');
    } finally {
      setReconcilingAll(false);
    }
  };

  const handleReconcileUser = async (userId, userName) => {
    setReconcilingUserId(userId);
    try {
      const res = await paymentService.reconcileUser(userId);
      toast.success(res.data.message || `Synced ${userName}`);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to sync ${userName}`);
    } finally {
      setReconcilingUserId(null);
    }
  };

  const openDetails = async (id) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setDetail(null);
    try {
      const res = await paymentService.getPaymentById(id);
      setDetail(res.data.payment);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load payment');
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDownloadInvoice = async (id) => {
    setInvoiceLoading(true);
    try {
      const res = await paymentService.downloadInvoice(id);
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${String(id).slice(-8).toUpperCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 4000);
      toast.success('Invoice downloaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to download invoice');
    } finally {
      setInvoiceLoading(false);
    }
  };

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4">Payments</Typography>
          <Typography variant="body2" color="text.secondary">
            {payments.length} transaction{payments.length === 1 ? '' : 's'}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={reconcilingAll ? <CircularProgress size={16} /> : <CloudSyncIcon />}
          onClick={handleReconcileAll}
          disabled={reconcilingAll}
        >
          {reconcilingAll ? 'Syncing…' : 'Re-sync all from Stripe'}
        </Button>
      </Stack>

      <TextField
        fullWidth
        size="small"
        placeholder="Search by name, email, or payment ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2, maxWidth: 400 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          )
        }}
      />

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  {search ? 'No matching payments' : 'No payments yet'}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.userName}</TableCell>
                  <TableCell>{p.userEmail}</TableCell>
                  <TableCell>
                    <Chip size="small" label={p.userRole} variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={p.plan} color={typeColor[p.type] || 'default'} />
                  </TableCell>
                  <TableCell>{formatMoney(p.amount, p.currency)}</TableCell>
                  <TableCell>
                    <Chip size="small" label={p.status} color={statusColor[p.status] || 'default'} />
                  </TableCell>
                  <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="View details">
                      <IconButton size="small" onClick={() => openDetails(p.id)}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download invoice">
                      <IconButton size="small" onClick={() => handleDownloadInvoice(p.id)}>
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Re-sync this user from Stripe">
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => handleReconcileUser(p.userId, p.userName)}
                          disabled={reconcilingUserId === p.userId}
                        >
                          {reconcilingUserId === p.userId
                            ? <CircularProgress size={16} />
                            : <SyncIcon fontSize="small" />}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ── Detail dialog ──────────────────────────────────────── */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Payment Detail</DialogTitle>
        <DialogContent dividers>
          {detailLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : detail ? (
            <Box>
              <Alert
                severity={detail.status === 'succeeded' ? 'success' : 'warning'}
                sx={{ mb: 2 }}
              >
                {detail.status === 'succeeded'
                  ? 'Payment completed successfully.'
                  : `Payment status: ${detail.status}`}
              </Alert>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Payment ID</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {detail.id}
                  </Typography>
                </Grid>
                <Grid item xs={12}><Divider /></Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">User</Typography>
                  <Typography variant="body2" fontWeight={600}>{detail.userName}</Typography>
                  <Typography variant="caption" color="text.secondary">{detail.userEmail}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Role & Plan</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                    <Chip size="small" label={detail.userRole} variant="outlined" />
                    <Chip size="small" label={detail.userPlan} color="primary" variant="outlined" />
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Date</Typography>
                  <Typography variant="body2">
                    {new Date(detail.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Amount</Typography>
                  <Typography variant="body1" fontWeight={700}>
                    {formatMoney(detail.amount, detail.currency)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Type</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip size="small" label={detail.type} color={typeColor[detail.type] || 'default'} />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip size="small" label={detail.status} color={statusColor[detail.status] || 'default'} />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailOpen(false)} startIcon={<CloseIcon />}>
            Close
          </Button>
          {detail && (
            <Button
              variant="contained"
              startIcon={invoiceLoading ? <CircularProgress size={16} /> : <DownloadIcon />}
              onClick={() => handleDownloadInvoice(detail.id)}
              disabled={invoiceLoading}
            >
              {invoiceLoading ? 'Generating…' : 'Download Invoice'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payments;