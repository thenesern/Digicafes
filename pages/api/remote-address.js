import nc from "next-connect";

const handler = nc();

handler.get(async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"];
  res.json({
    ip,
    userAgent,
  });
});

export default handler;
