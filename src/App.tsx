
import { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProjectDetails from "./pages/ProjectDetails";
import {
  ArrowLeft,
  ArrowUpLeft,
  CheckCircle2,
  LayoutDashboard,
  Menu,
  Target,
  Users,
  X,
} from "lucide-react";
import Settings from "./pages/Settings";
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <img src="/logo.png" alt="FLOW" className="logo-image" />

        <nav className={`nav-links ${isMenuOpen ? "is-open" : ""}`}>
                    <a href="#about" onClick={closeMenu}>
            من نحن
          </a>


          <a href="#features" onClick={closeMenu}>
            المميزات
          </a>

          <a href="#workspace" onClick={closeMenu}>
            المساحة
          </a>
          <a href="#hero" onClick={closeMenu}>
            الرئيسية
          </a>

        </nav>

        {isLoggedIn ? (
          <Link
            to="/dashboard"
            className="button button-dark"
            onClick={closeMenu}
          >
            Dashboard
            <LayoutDashboard size={16} />
          </Link>
        ) : (
          <Link
            to="/login"
            className="button button-dark"
            onClick={closeMenu}
          >
            login
          </Link>
        )}

        <button
          className="menu-button"
          aria-label={
            isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"
          }
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}

function HeroPreview() {
  return (
    <div className="hero-preview preview-card">
      <div className="preview-heading">
        <div>
          <span className="preview-label">نظرة عامة</span>
          <strong>سير عملك اليوم</strong>
        </div>

        <span className="preview-status">نشط</span>
      </div>

      <div className="progress-summary">
        <div className="summary-number">72%</div>

        <div className="progress-track">
          <span style={{ width: "72%" }} />
        </div>

        <span className="summary-caption">
          من المهام مكتملة
        </span>
      </div>

      <div className="preview-task">
        <span className="task-dot task-green" />
        <span>مراجعة المشروع</span>
        <CheckCircle2 size={13} />
      </div>

      <div className="preview-task">
        <span className="task-dot task-yellow" />
        <span>تحديث خطة العمل</span>
        <span className="task-time">اليوم</span>
      </div>

      <div className="preview-task">
        <span className="task-dot task-gray" />
        <span>إضافة ملاحظات</span>
        <span className="task-time">لاحقًا</span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero section-light" id="hero">
      <div className="container hero-grid">
        <div className="hero-content">



          <h1>
            حوّل الأفكار إلى
            <span> تقدم حقيقي</span>
          </h1>

          <p>
            FLOW يساعدك على تنظيم مشاريعك، متابعة تقدمك،
            وتحويل أفكارك إلى خطوات واضحة في مساحة واحدة
          </p>

          <div className="hero-actions">
            <Link
              to="/dashboard"
              className="button button-dark"
            >
              ابدأ
              <ArrowLeft size={16} />
            </Link>

            <a
              href="#features"
              className="button button-outline"
            >
              اكتشف FLOW
            </a>
          </div>

          <div className="hero-note">
            <CheckCircle2 size={15} />
            <span>
              مساحة بسيطة تساعدك على التركيز والإنجاز
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-glow" />
          <HeroPreview />
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: Users,
    number: "03",
    title: "تقدم بثبات",
    description:
      "تابع إنجازك وحافظ على تركيزك خلال رحلة العمل",
  },
  {
    icon: LayoutDashboard,
    number: "02",
    title: "نظّم عملك",
    description:
      "اجمع مشاريعك ومهامك في مساحة سهلة الاستخدام",
  },
    {
    icon: Target,
    number: "01",
    title: "حدد أهدافك",
    description:
      "حوّل أفكارك الكبيرة إلى أهداف وخطوات قابلة للتنفيذ",
  },

];

function Features() {
  return (
    <section className="features section-light" id="features">
      <div className="container">
        <div className="section-heading centered-heading">
          <h2>
            كل ما تحتاجه للحفاظ على تركيزك
          </h2>

          <p>
            أدوات تساعدك على تنظيم أفكارك وتحويلها
            إلى نتائج ملموسة
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                className="feature-card"
                key={feature.number}
              >
                <div className="feature-top">
                  <span className="feature-number">
                    {feature.number}
                  </span>

                  <Icon
                    size={22}
                    strokeWidth={1.6}
                  />
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>

                <span className="feature-arrow">
                  <ArrowUpLeft size={17} />
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AppPreview() {
  return (
    <section
      className="app-preview section-dark"
      id="workspace"
    >
      <div className="container">
        <div className="section-heading dark-heading">
          <span className="eyebrow">
            تجربة FLOW
          </span>

          <h2>من الفكرة إلى التطبيق</h2>

          <p>
            مساحة مرنة تساعدك على رؤية العمل بطريقة أوضح،
            من التخطيط حتى الإنجاز
          </p>
        </div>

        <div className="app-preview-grid">
          <div className="mini-app-card">
            <div className="mini-app-top">
              <span>03</span>
              <CheckCircle2 size={18} />
            </div>

            <div className="mini-lines">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="mini-app-card">
            <div className="mini-app-top">
              <span>02</span>
              <Target size={18} />
            </div>

            <div className="mini-lines">
              <span />
              <span />
              <span />
            </div>
          </div>


                    <div className="mini-app-card">
            <div className="mini-app-top">
              <span>01</span>
              <LayoutDashboard size={18} />
            </div>

            <div className="mini-lines">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section className="dashboard-section section-light">
      <div className="container dashboard-grid">
        <div className="dashboard-copy">
          <span className="eyebrow">
            لوحة تحكم واضحة
          </span>

          <h2>مساحة عملك في لمحة</h2>

          <p>
            راقب تقدمك، رتّب مهامك، واعرف الخطوة التالية
            دون الحاجة إلى التنقل بين أدوات كثيرة
          </p>

          <Link
            to="/dashboard"
            className="text-link"
          >
            اكتشف المساحة
            <ArrowLeft size={17} />
          </Link>
        </div>

        <div className="dashboard-mockup">
          <aside className="mockup-sidebar">
            <div className="mockup-logo">
              FLOW
            </div>

            <span className="sidebar-active">
              Overview
            </span>

            <span>My tasks</span>
            <span>Projects</span>
            <span>Reports</span>
            <span>Settings</span>
          </aside>

          <div className="mockup-content">
            <div className="mockup-header">
              <div>
                <span>مساء الخير</span>
                <strong>Overview</strong>
              </div>

              <div className="mockup-avatar">
                M
              </div>
            </div>

            <div className="mockup-focus">
              <span>Focus session</span>
              <strong>3h 42m focused</strong>

              <div className="mockup-progress">
                <span />
              </div>
            </div>

            <div className="mockup-stat">
              <span>المهام المكتملة</span>
              <strong>12 مهمة</strong>
            </div>

            <div className="mockup-stat">
              <span>المشاريع النشطة</span>
              <strong>04 مشاريع</strong>
            </div>

            <div className="mockup-stat">
              <span>معدل الإنجاز</span>
              <strong>86%</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="cta section-dark" id="about">
      <div className="container cta-content">
        <span className="eyebrow">
          ابدأ رحلتك
        </span>

        <h2 className="oop">
          هل أنت مستعد للبدء في منصة FLOW؟
        </h2>

        <p>
          رتّب أفكارك، ابدأ خطواتك، وشاهد تقدمك في مكان واحد
        </p>

        <Link
          to="/dashboard"
          className="button button-light"
        >
          ابدأ الآن
          <ArrowLeft size={16} />
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a
            href="#hero"
            className="brand footer-logo"
          >
            <img
              src="/logo.png"
              alt="FLOW"
              className="logo-image"
            />
          </a>

          <p>
            مساحة بسيطة تساعدك على تحويل الأفكار إلى تقدم حقيقي
          </p>

          <span className="copyright">
            © 2026 FLOW. All rights reserved
          </span>
        </div>

        <div className="footer-column">
          <h3>الشركة</h3>
          <a href="#about">من نحن</a>
          <a href="#about">تواصل معنا</a>
        </div>
      </div>
    </footer>
  );
}

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Features />
        <AppPreview />
        <DashboardPreview />
        <CTA />
      </main>

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />



            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
       
        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />
        <Route
  path="/settings"
  element={
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;