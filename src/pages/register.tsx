import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import RegisterStepOne from "@/components/auth/register_step_one";
import RegisterStepTwo from "@/components/auth/register_step_two";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRegister } from "@/hooks/use-auth";
import type { RegisterPayload } from "@/types";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const [regForm, setRegForm] = useState<RegisterPayload>({
    username: "",
    email: "",
    password: "",
  });
  const [step, setStep] = useState<1 | 2>(1);
  const [confirmPwd, setConfirmPwd] = useState("");
  const [regError, setRegError] = useState<string | null>(null);
  const [showRegPwd, setShowRegPwd] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  const passwordsMatch = useMemo(
    () => regForm.password !== "" && regForm.password === confirmPwd,
    [regForm.password, confirmPwd]
  );

  const handleNextStep = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = regForm.username.trim();
    const email = regForm.email.trim();
    if (!username || !email) {
      setRegError("请填写用户名和邮箱");
      return;
    }
    setRegError(null);
    setRegForm((prev) => ({ ...prev, username, email }));
    setStep(2);
  };

  const handleRegisterSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (step !== 2) {
      setStep(2);
      return;
    }
    if (!passwordsMatch) {
      setRegError("两次密码不一致");
      return;
    }
    setRegError(null);
    const payload = {
      ...regForm,
      username: regForm.username.trim(),
      email: regForm.email.trim(),
    };
    try {
      await registerMutation.mutateAsync(payload);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-muted/40 flex min-h-screen flex-col items-center justify-center px-4 py-6">
      <Card className="w-full max-w-sm py-4">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-xl font-semibold">注册账号</CardTitle>
          <CardDescription>
            {step === 1 ? "填写用户名和邮箱" : "设置密码"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-2">
          {step === 1 ? (
            <RegisterStepOne
              form={regForm}
              errorMessage={regError}
              onChange={(partial) => setRegForm((f) => ({ ...f, ...partial }))}
              onNext={handleNextStep}
            />
          ) : (
            <RegisterStepTwo
              password={regForm.password}
              confirmPassword={confirmPwd}
              showPassword={showRegPwd}
              showConfirm={showRegConfirm}
              passwordsMatch={passwordsMatch}
              errorMessage={regError || registerMutation.error?.message || null}
              isSubmitting={registerMutation.isPending}
              onPasswordChange={(value) =>
                setRegForm((f) => ({ ...f, password: value }))
              }
              onConfirmChange={setConfirmPwd}
              onTogglePassword={() => setShowRegPwd((prev) => !prev)}
              onToggleConfirm={() => setShowRegConfirm((prev) => !prev)}
              onSubmit={handleRegisterSubmit}
              onBack={() => setStep(1)}
            />
          )}
          <div className="text-muted-foreground text-center text-sm">
            已有账号？
            <button
              type="button"
              className="text-primary ml-1 underline-offset-4 hover:underline"
              onClick={() => navigate("/login")}
            >
              去登录
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
