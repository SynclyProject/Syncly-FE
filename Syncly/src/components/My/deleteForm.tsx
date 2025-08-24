const DeleteForm = ({
  setShowDeleteForm,
}: {
  setShowDeleteForm: (show: boolean) => void;
}) => {
  return (
    <div className="fixed inset-0 z-50  flex items-center justify-center ">
      <div className="absolute inset-0 bg-black opacity-40 pointer-events-none" />
      <div className="relative z-50 bg-white rounded-lg w-96 max-w-full py-12 px-10 shadow-lg">
        {/* 닫기 버튼 */}
        <button
          onClick={() => setShowDeleteForm(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-black text-xl font-bold"
        >
          &times;
        </button>

        {/* 삭제 폼 */}
        <h2 className="text-left text-rose-500 text-xl font-medium mb-4">
          정말로 계정을 삭제하시겠어요?
        </h2>

        <h3 className="text-sm font-medium text-neutral-700 pb-3 ">
          탈퇴 사유
        </h3>
        <div className="space-y-4.5 text-sm text-neutral-700 font-thin">
          {[
            "서비스 이용이 불편해요",
            "원하는 기능이 없어요",
            "사용 빈도가 줄었어요",
            "고객 지원이 만족스럽지 않았어요",
            "기타",
          ].map((reason) => (
            <label key={reason} className="flex items-center gap-2">
              <input type="checkbox" className="border rounded" />
              {reason}
            </label>
          ))}
          <input
            type="text"
            placeholder="기타 사유 입력"
            className="w-full px-3 py-2 border rounded text-xs text-zinc-500 outline-none"
          />
        </div>

        <div>
          <h3 className="text-sm font-medium text-neutral-700 pt-4 ">
            계정 확인
          </h3>
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            className="w-full px-3 py-2 border rounded text-xs text-red-400 mt-2 outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            alert("계정이 삭제되었습니다");
            setShowDeleteForm(false);
          }}
          className="mt-4 w-full py-2 border border-rose-500 text-rose-500 text-sm font-medium rounded"
        >
          계정 삭제
        </button>
      </div>
    </div>
  );
};

export default DeleteForm;
