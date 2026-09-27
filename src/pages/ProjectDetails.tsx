import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  ListTodo,
  Plus,
  Trash2,
  Pencil,
  X,
} from "lucide-react";
import { useFlow } from "../context/useFlow";

function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const {
    projects,
    tasks,
    addTask,
    toggleTask,
    updateTask,
    updateProject,
    deleteTask,
    deleteProject,
  } = useFlow();

  const [isAddingTask, setIsAddingTask] =
    useState(false);

  const [isEditingProject, setIsEditingProject] =
    useState(false);

  const [editingTaskId, setEditingTaskId] =
    useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [projectTitle, setProjectTitle] =
    useState("");

  const [projectGoal, setProjectGoal] =
    useState("");

  const project = projects.find(
    (item) => item.id === Number(projectId)
  );

  if (!project) {
    return (
      <div className="dashboard-page" dir="rtl">
        <main className="dashboard-main">
          <div className="project-not-found">
            <h1>المشروع غير موجود</h1>

            <Link
              to="/dashboard"
              className="dashboard-small-button"
            >
              العودة إلى لوحة التحكم
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const projectTasks = tasks.filter(
    (task) => task.projectId === project.id
  );

  const completedTasks = projectTasks.filter(
    (task) => task.completed
  ).length;

  const remainingTasks =
    projectTasks.length - completedTasks;

  const completionPercentage =
    projectTasks.length === 0
      ? 0
      : Math.round(
          (completedTasks / projectTasks.length) * 100
        );

  const handleAddTask = () => {
    if (!title.trim()) {
      return;
    }

    addTask(title, description, project.id);

    setTitle("");
    setDescription("");
    setIsAddingTask(false);
  };

  const startEditingProject = () => {
    setProjectTitle(project.title);
    setProjectGoal(project.goal);
    setIsEditingProject(true);
  };

  const handleUpdateProject = async () => {
    if (!projectTitle.trim()) {
      return;
    }

    await updateProject(
      project.id,
      projectTitle,
      projectGoal
    );

    setIsEditingProject(false);
  };

  const handleDeleteProject = async () => {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذا المشروع؟ سيتم حذف المشروع فقط وستبقى المهام موجودة بدون مشروع."
    );

    if (!confirmed) {
      return;
    }

    await deleteProject(project.id);

    navigate("/dashboard");
  };

  const startEditingTask = (
    taskId: number
  ) => {
    const task = projectTasks.find(
      (item) => item.id === taskId
    );

    if (!task) return;

    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description);
  };

  const cancelEditingTask = () => {
    setEditingTaskId(null);
    setTitle("");
    setDescription("");
  };

  const handleUpdateTask = async () => {
    if (
      editingTaskId === null ||
      !title.trim()
    ) {
      return;
    }

    await updateTask(
      editingTaskId,
      title,
      description
    );

    cancelEditingTask();
  };

  const handleDeleteTask = async (
    taskId: number
  ) => {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذه المهمة؟"
    );

    if (!confirmed) {
      return;
    }

    await deleteTask(taskId);
  };

  return (
    <div className="dashboard-page" dir="rtl">
      <main className="dashboard-main project-details-page">
        <header className="project-details-header">
          <Link
            to="/dashboard"
            className="project-back-link"
          >
            <ArrowRight size={18} />
            العودة إلى لوحة التحكم
          </Link>

          <div className="project-details-title">
            <span>المشروع</span>

            <div className="project-title-actions">
              <button
                className="dashboard-small-button"
                onClick={startEditingProject}
              >
                <Pencil size={15} />
                تعديل
              </button>

              <button
                className="dashboard-small-button"
                onClick={handleDeleteProject}
              >
                <Trash2 size={15} />
                حذف
              </button>
            </div>

            <h1>{project.title}</h1>

            <p>
              {project.goal ||
                "لا يوجد هدف محدد لهذا المشروع"}
            </p>
          </div>
        </header>

        {isEditingProject && (
          <section className="dashboard-panel project-edit-panel">
            <div className="dashboard-panel-header">
              <div>
                <span>تعديل المشروع</span>
                <h2>بيانات المشروع</h2>
              </div>

              <button
                className="project-cancel-button"
                onClick={() =>
                  setIsEditingProject(false)
                }
              >
                <X size={16} />
                إلغاء
              </button>
            </div>

            <div className="project-add-task">
              <label>
                اسم المشروع

                <input
                  type="text"
                  value={projectTitle}
                  onChange={(event) =>
                    setProjectTitle(
                      event.target.value
                    )
                  }
                />
              </label>

              <label>
                الهدف

                <textarea
                  value={projectGoal}
                  onChange={(event) =>
                    setProjectGoal(
                      event.target.value
                    )
                  }
                  rows={3}
                />
              </label>

              <div className="project-add-actions">
                <button
                  className="task-submit"
                  onClick={
                    handleUpdateProject
                  }
                  disabled={!projectTitle.trim()}
                >
                  <Pencil size={17} />
                  حفظ التعديلات
                </button>
              </div>
            </div>
          </section>
        )}

<section className="dashboard-stats">
  <div className="dashboard-stat-card">
    <div className="stat-card-top">
      <span>إجمالي المهام</span>

      <div className="stat-card-icon">
        <ListTodo size={17} />
      </div>
    </div>

    <div className="stat-card-value">
      <strong>{projectTasks.length}</strong>

      <span className="stat-card-badge neutral">
        مهام
      </span>
    </div>

    <div className="stat-card-bottom">
      <span>إجمالي مهام المشروع</span>

      <div className="stat-card-line" />
    </div>
  </div>

  <div className="dashboard-stat-card">
    <div className="stat-card-top">
      <span>المهام المكتملة</span>

      <div className="stat-card-icon">
        <CheckCircle2 size={17} />
      </div>
    </div>

    <div className="stat-card-value">
      <strong>{completedTasks}</strong>

      <span className="stat-card-badge">
        مكتملة
      </span>
    </div>

    <div className="stat-card-bottom">
      <span>المهام التي تم إنجازها</span>

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
      <span>المهام المتبقية</span>

      <div className="stat-card-icon">
        <Circle size={17} />
      </div>
    </div>

    <div className="stat-card-value">
      <strong>{remainingTasks}</strong>

      <span className="stat-card-badge neutral">
        متبقية
      </span>
    </div>

    <div className="stat-card-bottom">
      <span>مهام تحتاج إلى إنجاز</span>

      <div className="stat-card-progress">
        <div
          style={{
            width:
              projectTasks.length === 0
                ? "0%"
                : `${Math.round(
                    (remainingTasks /
                      projectTasks.length) *
                      100
                  )}%`,
          }}
        />
      </div>
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
      <strong>{completionPercentage}%</strong>

      <span className="stat-card-badge">
        إنجاز
      </span>
    </div>

    <div className="stat-card-bottom">
      <span>نسبة المهام المكتملة</span>

      <div className="stat-card-progress">
        <div
          style={{
            width: `${completionPercentage}%`,
          }}
        />
      </div>
    </div>
  </div>
</section>

<section className="dashboard-panel project-progress-panel">
  <div className="dashboard-panel-header">
    <div>
      <span>تقدم المشروع</span>
      <h2>حالة الإنجاز</h2>
    </div>

    <strong className="project-progress-value">
      {completionPercentage}%
    </strong>
  </div>

  <div className="project-progress-track">
    <div
      className="project-progress-fill"
      style={{
        width: `${completionPercentage}%`,
      }}
    />
  </div>

  <div className="project-progress-meta">
    <span>
      {completedTasks} من {projectTasks.length} مهام مكتملة
    </span>

    <span>
      {remainingTasks === 0
        ? "المشروع مكتمل 🎉"
        : `${remainingTasks} مهام متبقية`}
    </span>
  </div>
</section>

        <section className="dashboard-panel project-tasks-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>مهام المشروع</span>
              <h2>قائمة العمل</h2>
            </div>

            <button
              className="dashboard-small-button"
              onClick={() =>
                setIsAddingTask(true)
              }
            >
              <Plus size={16} />
              إضافة مهمة
            </button>
          </div>

          {isAddingTask && (
            <div className="project-add-task">
              <label>
                اسم المهمة

                <input
                  type="text"
                  placeholder="اكتب الاسم هنا"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  autoFocus
                />
              </label>

              <label>
                وصف اختياري

                <textarea
                  placeholder="أضف وصفًا مختصرًا إذا أردت"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  rows={3}
                />
              </label>

              <div className="project-add-actions">
                <button
                  className="task-submit"
                  onClick={handleAddTask}
                  disabled={!title.trim()}
                >
                  <Plus size={17} />
                  إضافة المهمة
                </button>

                <button
                  className="project-cancel-button"
                  onClick={() => {
                    setIsAddingTask(false);
                    setTitle("");
                    setDescription("");
                  }}
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}

          <div className="task-list">
            {projectTasks.length === 0 ? (
              <div className="empty-tasks">
                <ListTodo size={28} />

                <p>
                  لا توجد مهام في هذا المشروع
                </p>

                <span>
                  أضف أول مهمة للبدء
                </span>
              </div>
            ) : (
              projectTasks.map((task) => (
                <div key={task.id}>
                  {editingTaskId ===
                  task.id ? (
                    <div className="project-add-task">
                      <label>
                        اسم المهمة

                        <input
                          type="text"
                          value={title}
                          onChange={(event) =>
                            setTitle(
                              event.target.value
                            )
                          }
                          autoFocus
                        />
                      </label>

                      <label>
                        الوصف

                        <textarea
                          value={description}
                          onChange={(event) =>
                            setDescription(
                              event.target.value
                            )
                          }
                          rows={3}
                        />
                      </label>

                      <div className="project-add-actions">
                        <button
                          className="task-submit"
                          onClick={
                            handleUpdateTask
                          }
                          disabled={
                            !title.trim()
                          }
                        >
                          <Pencil size={17} />
                          حفظ التعديل
                        </button>

                        <button
                          className="project-cancel-button"
                          onClick={
                            cancelEditingTask
                          }
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`dashboard-task ${
                        task.completed
                          ? "completed"
                          : ""
                      }`}
                    >
                      <button
                        className="task-check"
                        onClick={() =>
                          toggleTask(task.id)
                        }
                      >
                        {task.completed ? (
                          <CheckCircle2 size={21} />
                        ) : (
                          <Circle size={21} />
                        )}
                      </button>

                      <div className="task-info">
                        <strong>
                          {task.title}
                        </strong>

                        {task.description && (
                          <span>
                            {task.description}
                          </span>
                        )}
                      </div>

                      <button
                        className="task-delete"
                        onClick={() =>
                          startEditingTask(
                            task.id
                          )
                        }
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="task-delete"
                        onClick={() =>
                          handleDeleteTask(
                            task.id
                          )
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProjectDetails;