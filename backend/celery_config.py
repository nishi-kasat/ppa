from celery import Celery

celery_app = Celery(
    "placement_portal",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0"
)

celery_app.conf.timezone = "Asia/Kolkata"

celery_app.conf.beat_schedule = {
    "daily_reminder_job": {
        "task": "tasks.daily_reminder_task.send_daily_reminders",
        "schedule": 86400.0
    },
    "monthly_report_job": {
        "task": "tasks.monthly_report_task.generate_monthly_report",
        "schedule": 2592000.0
    }
}