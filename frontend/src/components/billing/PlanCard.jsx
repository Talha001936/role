// import { Paper, Typography, Button, Stack, Divider, Chip } from '@mui/material';

// const PlanCard = ({
//   title,
//   price,
//   interval,
//   subtitle,
//   features,
//   ctaLabel,
//   onCta,
//   highlight = false,
//   disabled = false
// }) => (
//   <Paper
//     sx={{
//       p: 3,
//       borderRadius: 3,
//       height: '100%',
//       display: 'flex',
//       flexDirection: 'column',
//       position: 'relative',
//       border: '1px solid',
//       borderColor: highlight ? 'primary.main' : 'rgba(255,255,255,0.06)',
//       transition: 'border-color .2s'
//     }}
//   >
//     {highlight && (
//       <Chip
//         label="Recommended"
//         color="primary"
//         variant="outlined"
//         size="small"
//         sx={{ position: 'absolute', top: -12, right: 16 }}
//       />
//     )}

//     <Typography variant="h6" fontWeight={700}>{title}</Typography>
//     {subtitle && (
//       <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
//         {subtitle}
//       </Typography>
//     )}

//     <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 1 }}>
//       <Typography variant="h4" fontWeight={800}>{price}</Typography>
//       {interval && (
//         <Typography variant="body2" color="text.secondary">/ {interval}</Typography>
//       )}
//     </Stack>

//     <Divider sx={{ my: 2 }} />

//     <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
//       {features}
//     </Stack>

//     {onCta && (
//       <Button
//         variant={highlight ? 'contained' : 'outlined'}
//         fullWidth
//         sx={{ mt: 3 }}
//         onClick={onCta}
//         disabled={disabled}
//       >
//         {ctaLabel}
//       </Button>
//     )}
//   </Paper>
// );

// export default PlanCard;