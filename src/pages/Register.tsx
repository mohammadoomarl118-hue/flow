import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { supabase } from "../lib/supabase";

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("أكمل جميع الحقول");
      return;
    }

    if (password.length < 6) {
      setError(
        "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    setLoading(true);

    const { data, error } =
      await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      navigate("/");
      return;
    }

    setSuccess(
      "تم إنشاء الحساب، تحقق من بريدك الإلكتروني لتأكيد الحساب"
    );
  };

  return (
    <main className="login-page" dir="rtl">
      <div className="login-card">
        <Link to="/" className="login-logo">
          <img
            src="/logo.png"
            alt="FLOW"
            className="logo-image"
          />
        </Link>

        <div className="login-heading">
          <span>ابدأ رحلتك مع FLOW</span>

          <h1>إنشاء حساب</h1>

          <p>
            أنشئ حسابك للوصول إلى مساحة العمل الخاصة بك
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleRegister}
        >
          <label>
            البريد الإلكتروني

            <div className="login-input">
              <Mail size={18} />

              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
              />
            </div>
          </label>

          <label>
            كلمة المرور

            <div className="login-input">
              <Lock size={18} />

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="new-password"
              />
            </div>
          </label>

          <label>
            تأكيد كلمة المرور

            <div className="login-input">
              <Lock size={18} />

              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                autoComplete="new-password"
              />
            </div>
          </label>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {success && (
            <div className="login-success">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="button button-dark login-submit"
            disabled={loading}
          >
            {loading
              ? "جاري إنشاء الحساب..."
              : "إنشاء الحساب"}

            {!loading && <ArrowLeft size={16} />}
          </button>
        </form>

        <div className="login-footer">
          <span>لديك حساب بالفعل؟</span>

          <Link
            to="/login"
            className="login-register"
          >
            تسجيل الدخول
          </Link>
        </div>

        <Link
          to="/"
          className="login-back"
        >
          العودة إلى الموقع
        </Link>
      </div>
    </main>
  );
}

export default Register;