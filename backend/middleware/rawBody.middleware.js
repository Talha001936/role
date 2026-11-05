const rawBody = (req, res, next) => {
  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', () => {
    req.rawBody = Buffer.concat(chunks);
    console.log(`[rawBody] Captured ${req.rawBody.length} bytes for ${req.method} ${req.originalUrl}`);
    next();
  });
  req.on('error', (err) => {
    console.error('[rawBody] Stream error:', err.message);
    next(err);
  });
};

module.exports = rawBody;