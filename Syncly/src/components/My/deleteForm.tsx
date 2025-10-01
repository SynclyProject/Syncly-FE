import { TDeleteSchema } from "../../shared/type/sign";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DeleteMember } from "../../shared/api/Member/get_delete";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const REASONS = [
  { label: "서비스 이용이 불편해요", value: "INCONVENIENT_SERVICE" },
  { label: "원하는 기능이 없어요", value: "MISSING_FEATURE" },
  { label: "사용 빈도가 줄었어요", value: "LOW_USAGE" },
  { label: "고객 지원이 만족스럽지 않았어요", value: "UNSATISFACTORY_SUPPORT" },
  { label: "기타", value: "ETC" },
] as const;

type FormValues = {
  leaveReasonType: (typeof REASONS)[number]["value"];
  leaveReason: string | null;
  password: string;
};

const schema = yup.object({
  leaveReasonType: yup
    .mixed<(typeof REASONS)[number]["value"]>()
    .oneOf(REASONS.map((r) => r.value))
    .required("탈퇴 사유를 선택해주세요."),
  leaveReason: yup.string().trim().max(200).nullable(),
  password: yup.string().required("비밀번호를 입력해주세요."),
}) as yup.ObjectSchema<FormValues>;

const DeleteForm = ({
  setShowDeleteForm,
}: {
  setShowDeleteForm: (show: boolean) => void;
}) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      leaveReasonType: undefined,
      leaveReason: null,
      password: "",
    },
  });

  const selectedReason = watch("leaveReasonType");

  const { mutate: DeleteMutation } = useMutation({
    mutationFn: DeleteMember,
    onSuccess: () => {
      alert("계정이 삭제되었습니다");
      setShowDeleteForm(false);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/");
    },
  });

  const onSubmit = async (data: FormValues) => {
    const deleteData: TDeleteSchema = {
      leaveReasonType: data.leaveReasonType,
      leaveReason: data.leaveReason,
      password: data.password,
    };

    await DeleteMutation(deleteData);
  };

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

        <form onSubmit={handleSubmit(onSubmit)}>
          <h3 className="text-sm font-medium text-neutral-700 pb-3 ">
            탈퇴 사유
          </h3>
          <div className="space-y-4.5 text-sm text-neutral-700 font-thin">
            {REASONS.map((reason) => (
              <label key={reason.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={reason.value}
                  className="border rounded"
                  {...register("leaveReasonType")}
                />
                {reason.label}
              </label>
            ))}

            {selectedReason === "ETC" && (
              <input
                type="text"
                placeholder="기타 사유 입력"
                className="w-full px-3 py-2 border rounded text-xs text-zinc-500 outline-none"
                {...register("leaveReason")}
              />
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-neutral-700 pt-4 ">
              계정 확인
            </h3>
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              className="w-full px-3 py-2 border rounded text-xs text-red-400 mt-2 outline-none"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="mt-4 w-full py-2 border border-rose-500 text-rose-500 text-sm font-medium rounded"
          >
            계정 삭제
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeleteForm;
