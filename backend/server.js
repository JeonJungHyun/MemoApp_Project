const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

let memos = [
  {
    id: 1,
    title: "React 공부",
    content: "useEffect 정리",
    important: false,
    createdAt: "2026-05-20T09:00:00.000Z",
  },
];

app.get("/memos", (req, res) => {
  res.json(memos);
});

app.post("/memos", (req, res) => {

  const newMemo = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content,
    createdAt: req.body.createdAt, // 추가!!
    important: false,
  };

  memos.unshift(newMemo);

  res.json(newMemo);
});

app.delete("/memos/:id", (req, res) => {

  const memoId = Number(req.params.id);

  memos = memos.filter(
    (memo) => memo.id !== memoId
  );

  res.json({
    message: "삭제 완료",
  });
});

app.patch("/memos/:id", (req, res) => {
  const id = Number(req.params.id);

  memos = memos.map((memo) =>
    memo.id === id
      ? { ...memo, important: !memo.important }
      : memo
  );

  res.json({ message: "수정 완료" });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});