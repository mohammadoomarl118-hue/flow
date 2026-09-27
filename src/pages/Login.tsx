import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { supabase } from "../lib/supabase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("أدخل البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    setLoading(false);

    if (error) {
      setError(
        "البريد الإلكتروني أو كلمة المرور غير صحيحة"
      );
      return;
    }

    navigate("/");
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
          <span>مرحبًا بعودتك</span>
          <h1>تسجيل الدخول</h1>
          <p>
            سجّل دخولك للوصول إلى مساحة العمل الخاصة بك
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleLogin}
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
                disabled={loading}
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
                autoComplete="current-password"
                disabled={loading}
              />
            </div>
          </label>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="button button-dark login-submit"
            disabled={loading}
          >
            {loading
              ? "جاري تسجيل الدخول..."
              : "تسجيل الدخول"}

            {!loading && <ArrowLeft size={16} />}
          </button>
        </form>

        <div className="login-footer">
          <span>ليس لديك حساب؟</span>

          <Link
            to="/register"
            className="login-register"
          >
            إنشاء حساب
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

export default Login;