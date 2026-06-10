import { useState, useEffect } from "react";

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [memos, setMemos] = useState([]);
  const [showOnlyImportant, setShowOnlyImportant] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // 검색창 열림 상태 관리
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // ✨ [수정 1] 메모 추가 시 생성 시각(createdAt)을 함께 백엔드로 전송
  const addMemo = () => {
    if (!title || !content) return;

    fetch("http://localhost:5000/memos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        title, 
        content,
        createdAt: new Date().toISOString() // 올린 순간의 현재 시간을 포맷팅해서 저장
      }),
    })
      .then((res) => res.json())
      .then((newMemo) => {
        setMemos([newMemo, ...memos]);
      });

    setTitle("");
    setContent("");
  };

  // 중요 여부 토글
  const toggleImportant = (id) => {
    fetch(`http://localhost:5000/memos/${id}`, {
      method: "PATCH",
    }).then(() => {
      setMemos(
        memos.map((memo) =>
          memo.id === id ? { ...memo, important: !memo.important } : memo
        )
      );
    });
  };

  // 메모 삭제
  const deleteMemo = (id) => {
    fetch(`http://localhost:5000/memos/${id}`, {
      method: "DELETE",
    }).then(() => {
      setMemos(memos.filter((memo) => memo.id !== id));
    });
  };

  // 초기 데이터 로딩
  // ✨ [수정] 서버에서 가져온 과거 가짜 데이터들이 매번 현재 시간으로 바뀌는 현상 방지
    useEffect(() => {
    fetch("http://localhost:5000/memos")
      .then((res) => res.json())
      .then((data) => {
        setMemos(data);
      });
  }, []);

  return (
    // 1. 전체 뒷 배경: 차분하게 가라앉은 웜 그레이 톤으로 눈을 편안하게
    <div className="min-h-screen bg-stone-200 p-6 flex items-center justify-center font-sans tracking-tight antialiased">
      
      {/* 2. 메인 컨테이너: 부드럽게 탁한 '개나리/머스타드' 웜톤 베이스 */}
      <div className="w-full max-w-xl bg-amber-100/90 rounded-[32px] shadow-md border border-amber-200/60 overflow-hidden">
        
        {/* 상단 헤더 영역 */}
        <div className="relative flex justify-between items-center px-6 h-16 select-none">
          
          {/* [왼쪽] 깔끔한 메뉴 버튼 */}
          <div className="flex items-center justify-start w-12 h-full z-10">
            <button className="text-amber-900/60 hover:text-amber-950 text-base font-bold flex items-center justify-center leading-none transition-colors">
              ☰
            </button>
          </div>
          
          {/* [중앙] 대제목 - 상하좌우 완전 정중앙 고정 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h2 className="text-xs font-bold text-amber-900/80 tracking-widest pointer-events-auto">
              DAILY MEMO
            </h2>
          </div>

          {/* [오른쪽] 클릭 시 투명하게 열리며, 왼쪽 여백을 타이트하게 줄인 검색 바 */}
          <div className="flex items-center justify-end w-44 h-full z-10 select-none">
            <div 
              className={`flex items-center rounded-full h-8 transition-all duration-200 ease-out pr-2 cursor-pointer ${
                isSearchOpen 
                  ? "bg-white/40 backdrop-blur-sm border border-amber-200/50 w-full pl-2.5" 
                  : "bg-transparent border border-transparent w-8 justify-center pl-0" 
              }`}
            >
              <input
                type="text"
                placeholder="검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => {
                  if (!searchQuery) setIsSearchOpen(false);
                }}
                className={`bg-transparent text-xs focus:outline-none transition-all duration-200 text-amber-950 placeholder-amber-800/50 p-0 m-0 ${
                  isSearchOpen ? "w-30 opacity-100" : "w-0 opacity-0 pointer-events-none"
                }`}
              />
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-amber-800/60 text-xs select-none cursor-pointer shrink-0 w-5 h-5 flex items-center justify-center hover:text-amber-950 transition-colors ml-auto"
              >
                🔍
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          {/* 3. 입력 카드: 아주 살짝 톤다운된 미색(Ivory) 레이어 적용 */}
          <div className="bg-stone-50/90 rounded-2xl p-5 mb-6 border border-amber-200/30 flex flex-col gap-4 text-left shadow-sm">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[10px] font-bold text-amber-900/50 tracking-wider px-0.5">TITLE</label>
              <input
                type="text"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-0 border-b border-stone-200 p-2 text-sm focus:outline-none focus:border-amber-500 bg-transparent transition-colors text-stone-800"
              />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="text-[10px] font-bold text-amber-900/50 tracking-wider px-0.5">CONTENT</label>
              <textarea
                placeholder="내용을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border-0 p-2 text-sm h-24 resize-none focus:outline-none bg-transparent text-stone-600 leading-relaxed"
              ></textarea>
            </div>

            {/* 차분한 브릭 오렌지 버튼 */}
            <div className="flex justify-end">
              <button
                onClick={addMemo}
                className="bg-amber-700/90 hover:bg-amber-800 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-sm shadow-amber-900/10"
              >
                + 메모 추가
              </button>
            </div>
          </div>

          {/* 리스트 헤더 */}
          <div className="flex justify-between items-center mb-3 px-1 select-none">
            <h2 className="text-[10px] font-bold text-amber-900/40 tracking-widest">Memo List</h2>
            <label className="flex items-center gap-1.5 text-xs font-medium text-amber-800/70 cursor-pointer hover:text-amber-900">
              <input
                type="checkbox"
                checked={showOnlyImportant}
                onChange={(e) => setShowOnlyImportant(e.target.checked)}
                className="w-3.5 h-3.5 rounded-md border-amber-300 text-amber-700 focus:ring-0 focus:ring-offset-0 bg-white/50"
              />
              중요 메모만 보기
            </label>
          </div>

          {/* 4. 메모 카드 리스트: 이빨 어긋남 해결 및 레이어 팝업 효과 적용 */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
            {memos
              .filter((memo) => !showOnlyImportant || memo.important)
              .filter(
                (memo) =>
                  memo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  memo.content.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((memo) => (
                <div
                  key={memo.id}
                  className={`rounded-2xl p-4 border flex justify-between items-center gap-4 transition-all duration-200 ${
                    memo.important
                      ? "bg-orange-100/90 border-orange-300 border-l-4 border-l-orange-500 shadow-md transform -translate-x-0.5" 
                      : "bg-stone-50/80 border-stone-200/60 border-l-4 border-l-stone-300 shadow-sm" 
                  }`}
                >
                  {/* [왼쪽 영역] 별 아이콘 + 텍스트 전체 그룹 */}
                  <div className="flex items-start gap-3 flex-1 min-w-0 text-left pr-4">
                    {/* 예전 코드 스타일의 별(★/☆) 토글 버튼 */}
                    <button
                      onClick={() => toggleImportant(memo.id)}
                      className={`text-xl shrink-0 w-8 h-8 flex items-center justify-center select-none transition-transform active:scale-125 ${
                        memo.important ? "text-orange-500" : "text-stone-300 hover:text-stone-400"
                      }`}
                    >
                      {memo.important ? "★" : "☆"}
                    </button>

                    {/* 텍스트 컨테이너 */}
                    <div className="flex flex-col flex-1 min-w-0 pt-0.5">
                      <h3 className={`text-sm font-bold truncate ${memo.important ? 'text-amber-950' : 'text-stone-800'}`}>
                        {memo.title}
                      </h3>
                      <p className="text-xs text-stone-500/90 whitespace-pre-wrap pt-1 leading-relaxed break-words">
                        {memo.content}
                      </p>
                      
                      {/* ✨ [수정 2] 하드코딩 지우고 DB에서 가져온 진짜 메모 업로드 시간 매핑 */}
                      {/* ✨ 과거 메모는 과거대로 두고, 새 메모는 올린 시간으로 고정하는 방어 코드 */}
                      <span className="text-[10px] text-stone-400 mt-2 flex items-center gap-1 select-none whitespace-nowrap">
                      📅 {memo.createdAt 
                      ? new Date(memo.createdAt).toLocaleString("ko-KR")
                      : "시간 없음"}
                    </span>
                    </div>
                  </div>

                  {/* [오른쪽 영역] 예전 코드의 '중요 / 삭제' 텍스트 버튼 세트 */}
                  <div className="flex gap-2 items-center shrink-0 select-none">
                    <button
                      onClick={() => toggleImportant(memo.id)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all flex items-center gap-1 h-7 ${
                        memo.important
                          ? "bg-orange-50 border-orange-200 text-orange-700"
                          : "bg-white border-stone-200 text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      <span className="leading-none">{memo.important ? "★" : "☆"}</span> 중요
                    </button>

                    <button
                      onClick={() => deleteMemo(memo.id)}
                      className="bg-white border border-red-200 text-red-500 hover:bg-red-50 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors h-7 flex items-center gap-1"
                    >
                      <span>🗑️</span> 삭제
                    </button>
                  </div>

                </div>
              ))}
          </div>

          {/* 하단 개수 카운터 */}
          <div className="bg-amber-950/[0.03] border border-amber-900/[0.04] rounded-xl py-2.5 mt-4 text-center select-none">
            <p className="text-[10px] tracking-widest text-amber-900/40 font-bold">
              전체 메모 : <span className="text-amber-800 font-extrabold">{memos.length}</span>개
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;