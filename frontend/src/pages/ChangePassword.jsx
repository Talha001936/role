import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../context/authcontext";
import ConfirmDialog from "../components/common/ConfirmDialog";

const ChangePassword = () => {
  const { changePassword } = useAuth();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [shownPw, setShownPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.currentPassword)
      e.currentPassword = "Current password is required";
    if (!form.newPassword) e.newPassword = "New password is required";
    else if (form.newPassword.length < 8) e.newPassword = "Min 8 characters";
    if (form.newPassword !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setConfirmOpen(true);
  };

  const doSubmit = async () => {
    setSubmitting(true);
    const result = await changePassword(
      form.currentPassword,
      form.newPassword,
      form.confirmPassword,
    );
    setSubmitting(false);
    setConfirmOpen(false);
    if (result.success)
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const pwType = showPw ? "text" : "password";

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Change Password
        </Typography>
        <form onSubmit={handleFormSubmit} noValidate>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 2 }}
          >
            <TextField
              label="Current Password"
              name="currentPassword"
              type={showPw ? "text" : "password"}
              value={form.currentPassword}
              onChange={change}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
              fullWidth
              autoFocus
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPw((v) => !v)}
                      edge="end"
                      size="small"
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="New Password"
              name="newPassword"
              type={shownPw ? "text" : "password"}
              value={form.newPassword}
              onChange={change}
              error={!!errors.newPassword}
              helperText={errors.newPassword || "Min 8 characters"}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShownPw((v) => !v)}
                      edge="end"
                      size="small"
                      aria-label={shownPw ? "Hide password" : "Show password"}
                    >
                      {shownPw ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm New Password"
              name="confirmPassword"
              type={showCPw ? "text" : "password"}
              value={form.confirmPassword}
              onChange={change}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCPw((v) => !v)}
                      edge="end"
                      size="small"
                      aria-label={showCPw ? "Hide password" : "Show password"}
                    >
                      {showCPw ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting}
              fullWidth
              sx={{ py: 1.3 }}
            >
              {submitting ? "Updating..." : "Change Password"}
            </Button>
          </Box>
        </form>
      </Paper>

      <ConfirmDialog
        open={confirmOpen}
        title="Change password?"
        message="You will need to use the new password the next time you log in."
        confirmText="Change"
        confirmColor="primary"
        loading={submitting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={doSubmit}
      />
    </Container>
  );
};

export default ChangePassword;
