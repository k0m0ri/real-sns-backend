const express = require("express");
const app = express();
const userRoute = require("./routes/users");
const PORT = 3000;

// ミドルウェア
app.use("/api/users", userRoute);

app.listen(PORT, () => console.log("サーバーが起動しました"));