const express = require("express");
const app = express();
const port = 3040;
const indexRouter = require("./routes/index");
const adminRouter = require("./routes/admin");
const cors = require("cors");
app.use(
  cors({
    origin: "http://www.furui.work", // 或你的前端域名
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/", indexRouter);
app.use("/admin", adminRouter);

app.listen(port, () => {
  console.log(`服务器正在运行，访问地址：http://localhost:${port}`);
});
