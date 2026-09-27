import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  CheckCircle2,
  Circle,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { useFlow } from "../context/useFlow";

type ItemType = "task" | "project";

function Dashboard() {
  const {
    tasks,
    projects,
    addTask,
    addProject,
    updateTask,
    toggleTask,
    deleteTask,
    deleteProject,
  } = useFlow();

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [selectedType, setSelectedType] =
    useState<ItemType | null>(null);

  const [editingTaskId, setEditingTaskId] =
    useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [goal, setGoal] = useState("");

  const [selectedProjectId, setSelectedProjectId] =
    useState<number | null>(null);

  const [taskSearch, setTaskSearch] =
    useState("");

  const [taskFilter, setTaskFilter] =
    useState<
      "all" | "active" | "completed"
    >("all");

  const [taskProjectFilter, setTaskProjectFilter] =
    useState<number | null>(null);

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const remainingTasks =
    tasks.length - completedTasks;

  const completionPercentage =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedTasks / tasks.length) * 100
        );

  const filteredTasks = useMemo(() => {
    const search = taskSearch
      .trim()
      .toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !search ||
        task.title
          .toLowerCase()
          .includes(search) ||
        task.description
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        taskFilter === "all" ||
        (taskFilter === "completed" &&
          task.completed) ||
        (taskFilter === "active" &&
          !task.completed);

      const matchesProject =
        taskProjectFilter === null ||
        task.projectId === taskProjectFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesProject
      );
    });
  }, [
    tasks,
    taskSearch,
    taskFilter,
    taskProjectFilter,
  ]);

  const getProjectStats = (
    projectId: number
  ) => {
    const projectTasks = tasks.filter(
      (task) => task.projectId === projectId
    );

    const completed = projectTasks.filter(
      (task) => task.completed
    ).length;

    const percentage =
      projectTasks.length === 0
        ? 0
        : Math.round(
            (completed /
              projectTasks.length) *
              100
          );

    return {
      total: projectTasks.length,
      completed,
      percentage,
    };
  };

  const openAddModal = () => {
    setEditingTaskId(null);
    setSelectedType(null);
    setTitle("");
    setDescription("");
    setGoal("");
    setSelectedProjectId(null);
    setIsModalOpen(true);
  };

  const openEditTask = (
    task: (typeof tasks)[number]
  ) => {
    setEditingTaskId(task.id);
    setSelectedType("task");
    setTitle(task.title);
    setDescription(task.description || "");
    setGoal("");
    setSelectedProjectId(
      task.projectId ?? null
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedType(null);
    setEditingTaskId(null);
    setTitle("");
    setDescription("");
    setGoal("");
    setSelectedProjectId(null);
  };

  const addItem = () => {
    if (!title.trim() || !selectedType)
      return;

    if (selectedType === "task") {
      if (editingTaskId !== null) {
        updateTask(
          editingTaskId,
          title,
          description,
          selectedProjectId
        );
      } else {
        addTask(
          title,
          description,
          selectedProjectId
        );
      }
    }

    if (selectedType === "project") {
      addProject(title, goal);
    }

    closeModal();
  };

  const clearTaskFilters = () => {
    setTaskSearch("");
    setTaskFilter("all");
    setTaskProjectFilter(null);
  };

  return (
    <div
      className="dashboard-page"
      dir="rtl"
    >
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <img
            src="/logo.png"
            alt="FLOW"
          />
        </div>

        <nav className="dashboard-nav">
          <Link
            to="/dashboard"
            className="dashboard-nav-item active"
          >
            <LayoutDashboard size={18} />
            <span>لوحة التحكم</span>
          </Link>

          <a
            href="#tasks"
            className="dashboard-nav-item"
          >
            <ListTodo size={18} />
            <span>المهام</span>
          </a>

          <a
            href="#projects"
            className="dashboard-nav-item"
          >
            <FolderKanban size={18} />
            <span>المشاريع</span>
          </a>

          <Link
            to="/settings"
            className="dashboard-nav-item"
          >
            <Settings size={18} />
            <span>الإعدادات</span>
          </Link>
        </nav>

        <div className="dashboard-sidebar-bottom">
          <Link
            to="/"
            className="back-home"
          >
            العودة للموقع
          </Link>
        </div>
      </aside>
      <nav className="mobile-dashboard-nav">
  <Link
    to="/dashboard"
    className="mobile-dashboard-nav-item active"
  >
    <LayoutDashboard size={19} />
    <span>الرئيسية</span>
  </Link>

  <a
    href="#tasks"
    className="mobile-dashboard-nav-item"
  >
    <ListTodo size={19} />
    <span>المهام</span>
  </a>

  <a
    href="#projects"
    className="mobile-dashboard-nav-item"
  >
    <FolderKanban size={19} />
    <span>المشاريع</span>
  </a>

  <Link
    to="/settings"
    className="mobile-dashboard-nav-item"
  >
    <Settings size={19} />
    <span>الإعدادات</span>
  </Link>
</nav>

      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div>
            <span className="dashboard-eyebrow">
              مساحة العمل
            </span>

            <h1>مرحبًا بك في FLOW</h1>

            <p>
              تابع مهامك ومشاريعك وأنجز ما هو مهم
            </p>
          </div>

          <button
            className="dashboard-add-button"
            onClick={openAddModal}
          >
            <Plus size={18} />
            إضافة جديد
          </button>
        </header>

        {/* Overview */}
        <section className="dashboard-overview">
          <div className="dashboard-stats">
            <div className="dashboard-stat-card">
              <div className="stat-card-top">
                <span>
                  المهام المكتملة
                </span>

                <div className="stat-card-icon">
                  <CheckCircle2 size={17} />
                </div>
              </div>

              <div className="stat-card-value">
                <strong>
                  {completedTasks}
                </strong>

                <span className="stat-card-badge">
                  {completionPercentage}%
                </span>
              </div>

              <div className="stat-card-bottom">
                <span>
                  من أصل {tasks.length} مهام
                </span>

                <div className="stat-card-progress">
                  <div
                    style={{
                      width: `${completionPercentage}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="stat-card-top">
                <span>
                  المهام المتبقية
                </span>

                <div className="stat-card-icon">
                  <ListTodo size={17} />
                </div>
              </div>

              <div className="stat-card-value">
                <strong>
                  {remainingTasks}
                </strong>

                <span className="stat-card-badge neutral">
                  {tasks.length}
                </span>
              </div>

              <div className="stat-card-bottom">
                <span>
                  تحتاج إلى إنجاز
                </span>

                <div className="stat-card-progress">
                  <div
                    style={{
                      width:
                        tasks.length === 0
                          ? "0%"
                          : `${Math.round(
                              (remainingTasks /
                                tasks.length) *
                                100
                            )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="stat-card-top">
                <span>المشاريع</span>

                <div className="stat-card-icon">
                  <FolderKanban size={17} />
                </div>
              </div>

              <div className="stat-card-value">
                <strong>
                  {projects.length}
                </strong>

                <span className="stat-card-badge neutral">
                  نشطة
                </span>
              </div>

              <div className="stat-card-bottom">
                <span>
                  مساحات العمل الحالية
                </span>

                <div className="stat-card-line" />
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="stat-card-top">
                <span>معدل الإنجاز</span>

                <div className="stat-card-icon">
                  <Check size={17} />
                </div>
              </div>

              <div className="stat-card-value">
                <strong>
                  {completionPercentage}%
                </strong>
                  <span> </span>
                <span className="stat-card-badge">
                  إنجاز
                </span>
              </div>

              <div className="stat-card-bottom">
                <span>
                  نسبة المهام المكتملة
                </span>

                <div className="stat-card-progress">
                  <div
                    style={{
                      width: `${completionPercentage}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="dashboard-content-grid">
          {/* Tasks */}
          <div
            className="dashboard-panel tasks-panel"
            id="tasks"
          >
            <div className="dashboard-panel-header">
              <div>
                <span>قائمة العمل</span>
                <h2>مهامك الحالية</h2>
              </div>

              <button
                className="dashboard-small-button"
                onClick={openAddModal}
              >
                إضافة مهمة
              </button>
            </div>

            {/* Task Filters */}
            <div className="task-filters">
              <div className="task-search">
                <Search size={16} />

                <input
                  type="text"
                  placeholder="ابحث عن مهمة..."
                  value={taskSearch}
                  onChange={(event) =>
                    setTaskSearch(
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="task-filter-row">
                <div className="task-filter-buttons">
                  <button
                    className={
                      taskFilter === "all"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setTaskFilter("all")
                    }
                  >
                    الكل
                  </button>

                  <button
                    className={
                      taskFilter === "active"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setTaskFilter("active")
                    }
                  >
                    غير مكتملة
                  </button>

                  <button
                    className={
                      taskFilter === "completed"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setTaskFilter("completed")
                    }
                  >
                    مكتملة
                  </button>
                </div>

                <select
                  value={
                    taskProjectFilter ?? ""
                  }
                  onChange={(event) =>
                    setTaskProjectFilter(
                      event.target.value
                        ? Number(
                            event.target.value
                          )
                        : null
                    )
                  }
                >
                  <option value="">
                    كل المشاريع
                  </option>

                  {projects.map(
                    (project) => (
                      <option
                        key={project.id}
                        value={project.id}
                      >
                        {project.title}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div className="task-list">
              {tasks.length === 0 ? (
                <div className="empty-tasks">
                  <ListTodo size={28} />

                  <p>
                    لا توجد مهام بعد
                  </p>

                  <span>
                    أضف أول مهمة وابدأ العمل
                  </span>

                  <button
                    className="empty-action"
                    onClick={openAddModal}
                  >
                    إضافة مهمة
                  </button>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="empty-tasks">
                  <Search size={28} />

                  <p>
                    لم نجد أي مهام
                  </p>

                  <span>
                    جرّب تغيير البحث أو الفلاتر
                  </span>

                  <button
                    className="empty-action"
                    onClick={clearTaskFilters}
                  >
                    عرض كل المهام
                  </button>
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const taskProject =
                    projects.find(
                      (project) =>
                        project.id ===
                        task.projectId
                    );

                  return (
                    <div
                      className={`dashboard-task ${
                        task.completed
                          ? "completed"
                          : ""
                      }`}
                      key={task.id}
                    >
                      <button
                        className="task-check"
                        onClick={() =>
                          toggleTask(
                            task.id
                          )
                        }
                        aria-label={
                          task.completed
                            ? "إلغاء إكمال المهمة"
                            : "إكمال المهمة"
                        }
                      >
                        {task.completed ? (
                          <CheckCircle2
                            size={21}
                          />
                        ) : (
                          <Circle
                            size={21}
                          />
                        )}
                      </button>

                      <div className="task-info">
                        <strong
                          className={
                            task.completed
                              ? "completed"
                              : ""
                          }
                        >
                          {task.title}
                        </strong>

                        {task.description && (
                          <span>
                            {task.description}
                          </span>
                        )}

                        {taskProject && (
                          <span className="task-project-name">
                            <FolderKanban
                              size={12}
                            />
                            {
                              taskProject.title
                            }
                          </span>
                        )}
                      </div>

                      <button
                        className="task-edit"
                        onClick={() =>
                          openEditTask(task)
                        }
                        aria-label="تعديل المهمة"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        className="task-delete"
                        onClick={() =>
                          deleteTask(
                            task.id
                          )
                        }
                        aria-label="حذف المهمة"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="dashboard-panel progress-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>نظرة عامة</span>
                <h2>تقدمك</h2>
              </div>
            </div>

            <div className="dashboard-progress-ring">
              <div
            style={{
              background: `conic-gradient(
                var(--dark) ${completionPercentage}%,
                var(--border) ${completionPercentage}% 100%
              )`,
            }}
              >
                <div className="dashboard-progress-ring-inner">
                  <strong>
                    {completionPercentage}%
                  </strong>
                  <span>   </span>
                      
                  
                  <span>
                    إنجاز
                  </span>
                </div>
              </div>
            </div>

            <div className="progress-details">
              <div>
                <span>مكتملة</span>
                <strong>
                  {completedTasks}
                </strong>
              </div>

              <div>
                <span>متبقية</span>
                <strong>
                  {remainingTasks}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section
          className="dashboard-panel projects-panel"
          id="projects"
        >
          <div className="dashboard-panel-header">
            <div>
              <span>مساحات العمل</span>
              <h2>مشاريعك</h2>
            </div>

            <button
              className="dashboard-small-button"
              onClick={openAddModal}
            >
              مشروع جديد
            </button>
          </div>

          <div className="project-list">
            {projects.length === 0 ? (
              <div className="empty-tasks">
                <FolderKanban size={28} />

                <p>
                  لا توجد مشاريع
                </p>

                <span>
                  أنشئ مشروعك الأول لتنظيم عملك
                </span>

                <button
                  className="empty-action"
                  onClick={openAddModal}
                >
                  إنشاء مشروع
                </button>
              </div>
            ) : (
              projects.map((project) => {
                const stats =
                  getProjectStats(
                    project.id
                  );

                return (
                  <div
                    className="dashboard-project"
                    key={project.id}
                  >
                    <Link
                      to={`/projects/${project.id}`}
                      className="project-open-link"
                    >
                      <div className="project-icon">
                        <FolderKanban
                          size={18}
                        />
                      </div>

                      <div className="project-info">
                        <strong>
                          {project.title}
                        </strong>

                        <span>
                          {project.goal ||
                            "لا يوجد هدف محدد"}
                        </span>

                        <div className="project-card-progress">
                          <div className="project-card-progress-top">
                            <span>
                              {
                                stats.completed
                              }{" "}
                              من{" "}
                              {stats.total}{" "}
                              مكتملة
                            </span>

                            <strong>
                              {
                                stats.percentage
                              }%
                            </strong>
                          </div>

                          <div className="project-card-progress-track">
                            <div
                              className="project-card-progress-fill"
                              style={{
                                width: `${stats.percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>

                    <button
                      className="task-delete"
                      onClick={() =>
                        deleteProject(
                          project.id
                        )
                      }
                      aria-label="حذف المشروع"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <div
          id="settings"
          className="dashboard-settings-anchor"
        />
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="task-modal-overlay"
          onClick={closeModal}
        >
          <div
            className="task-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="task-modal-header">
              <div>
                <span>
                  {editingTaskId !== null
                    ? "تعديل"
                    : "إضافة جديد"}
                </span>

                <h2>
                  {!selectedType
                    ? "ماذا تريد أن تضيف؟"
                    : editingTaskId !== null
                    ? "تعديل المهمة"
                    : selectedType ===
                      "task"
                    ? "إضافة مهمة"
                    : "إضافة مشروع"}
                </h2>
              </div>

              <button
                className="task-modal-close"
                onClick={closeModal}
              >
                <X size={19} />
              </button>
            </div>

            {!selectedType ? (
              <div className="add-type-options">
                <button
                  className="add-type-card"
                  onClick={() =>
                    setSelectedType(
                      "task"
                    )
                  }
                >
                  <div className="add-type-icon">
                    <ListTodo size={24} />
                  </div>

                  <strong>مهمة</strong>

                  <span>
                    شيء تريد إنجازه
                  </span>
                </button>

                <button
                  className="add-type-card"
                  onClick={() =>
                    setSelectedType(
                      "project"
                    )
                  }
                >
                  <div className="add-type-icon">
                    <FolderKanban
                      size={24}
                    />
                  </div>

                  <strong>مشروع</strong>

                  <span>
                    مساحة لها هدف ومجموعة أعمال
                  </span>
                </button>
              </div>
            ) : (
              <div className="task-form">
                <label>
                  {selectedType ===
                  "task"
                    ? "اسم المهمة"
                    : "اسم المشروع"}

                  <input
                    type="text"
                    placeholder="اكتب الاسم هنا"
                    value={title}
                    onChange={(event) =>
                      setTitle(
                        event.target.value
                      )
                    }
                    autoFocus
                  />
                </label>

                {selectedType ===
                "task" ? (
                  <>
                    <label>
                      وصف اختياري

                      <textarea
                        placeholder="أضف وصفًا مختصرًا إذا أردت"
                        value={description}
                        onChange={(
                          event
                        ) =>
                          setDescription(
                            event.target
                              .value
                          )
                        }
                        rows={3}
                      />
                    </label>

                    <label>
                      المشروع

                      <select
                        value={
                          selectedProjectId ??
                          ""
                        }
                        onChange={(
                          event
                        ) =>
                          setSelectedProjectId(
                            event.target
                              .value
                              ? Number(
                                  event
                                    .target
                                    .value
                                )
                              : null
                          )
                        }
                      >
                        <option value="">
                          بدون مشروع
                        </option>

                        {projects.map(
                          (project) => (
                            <option
                              key={
                                project.id
                              }
                              value={
                                project.id
                              }
                            >
                              {
                                project.title
                              }
                            </option>
                          )
                        )}
                      </select>
                    </label>
                  </>
                ) : (
                  <label>
                    الهدف

                    <textarea
                      placeholder="ما الذي تريد تحقيقه؟"
                      value={goal}
                      onChange={(event) =>
                        setGoal(
                          event.target.value
                        )
                      }
                      rows={3}
                    />
                  </label>
                )}

                <button
                  className="task-submit"
                  onClick={addItem}
                  disabled={!title.trim()}
                >
                  <Check size={18} />

                  {editingTaskId !== null
                    ? "حفظ التعديلات"
                    : "إضافة"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;   


  