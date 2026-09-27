import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  LogOut,
  Mail,
  Moon,
  ShieldCheck,
  Sun,
  User,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useTheme } from "../context/useTheme";

function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setEmail(user?.email ?? "");
      setLoading(false);
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="dashboard-page" dir="rtl">
      <main className="dashboard-main settings-page">
        <header className="project-details-header">
          <Link
            to="/dashboard"
            className="project-back-link"
          >
            <ArrowRight size={18} />
            العودة إلى لوحة التحكم
          </Link>

          <div className="project-details-title">
            <span>الإعدادات</span>
            <h1>إعدادات الحساب</h1>
            <p>
              إدارة معلومات حسابك وإعدادات مساحة العمل
            </p>
          </div>
        </header>

        <section className="dashboard-panel settings-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>الحساب</span>
              <h2>معلومات الحساب</h2>
            </div>

            <div className="settings-panel-icon">
              <User size={18} />
            </div>
          </div>

          <div className="settings-info-list">
            <div className="settings-info-item">
              <div className="settings-info-icon">
                <Mail size={17} />
              </div>

              <div>
                <span>البريد الإلكتروني</span>

                <strong>
                  {loading
                    ? "جارٍ التحميل..."
                    : email || "لا يوجد بريد إلكتروني"}
                </strong>
              </div>
            </div>

            <div className="settings-info-item">
              <div className="settings-info-icon">
                <ShieldCheck size={17} />
              </div>

              <div>
                <span>حالة الحساب</span>
                <strong>الحساب مفعل</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-panel settings-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>المظهر</span>
              <h2>مظهر التطبيق</h2>
            </div>

            <div className="settings-panel-icon">
              {theme === "dark" ? (
                <Moon size={18} />
              ) : (
                <Sun size={18} />
              )}
            </div>
          </div>

          <div className="settings-theme-content">
            <div className="settings-theme-info">
              <strong>
                {theme === "dark"
                  ? "الوضع الداكن"
                  : "الوضع الفاتح"}
              </strong>

              <p>
                اختر المظهر المناسب لك وسيتم حفظ اختيارك
              </p>
            </div>

            <button
              type="button"
              className="settings-theme-button"
              onClick={toggleTheme}
              aria-label="تغيير مظهر التطبيق"
            >
              {theme === "dark" ? (
                <>
                  <Sun size={17} />
                  الوضع الفاتح
                </>
              ) : (
                <>
                  <Moon size={17} />
                  الوضع الداكن
                </>
              )}
            </button>
          </div>
        </section>

        <section className="dashboard-panel settings-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>مساحة العمل</span>
              <h2>حول FLOW</h2>
            </div>
          </div>

          <div className="settings-about">
            <div>
              <strong>FLOW</strong>

              <p>
                مساحة عمل بسيطة تساعدك على تنظيم
                المهام والمشاريع ومتابعة تقدمك
              </p>
            </div>

            <span className="settings-version">
              الإصدار 1.0
            </span>
          </div>
        </section>

        <section className="dashboard-panel settings-panel settings-danger-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>الحساب</span>
              <h2>تسجيل الخروج</h2>
            </div>
          </div>

          <div className="settings-danger-content">
            <p>
              تسجيل الخروج سيُنهي جلسة حسابك على هذا
              الجهاز
            </p>

            <button
              className="settings-logout-button"
              onClick={handleLogout}
            >
              <LogOut size={17} />
              تسجيل الخروج
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Settings;