"""
Onboarding Tracker dashboard endpoints.

Exposes the exact columns the frontend table needs:
Employee Name | Emp ID | Department | Joining Date | Progress | Status | Action (View)

Progress is derived from OnboardingTracker rows (completed steps / total steps).
Status is derived from progress using the agreed thresholds:
  < 50%        -> "Pending"
  50% - 79%    -> "Inprogress"
  >= 80%       -> "Completed"

Read-only: this dashboard summarizes existing employee/tracker data.
New employees are created via POST /employees or POST /hrms/sync/new-hires,
not here.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Employee, OnboardingTracker
from app.orchestrators.onboarding_orchestrator import STEPS
from app.schemas.dashboard import OnboardingDashboardRow

router = APIRouter(prefix="/dashboard/onboarding", tags=["dashboard"])

TOTAL_STEPS = len(STEPS)


def _progress_and_status(db: Session, employee_id: str) -> tuple[int, str]:
    distinct_steps = {
        r.step
        for r in db.query(OnboardingTracker.step)
        .filter(
            OnboardingTracker.employee_id == employee_id,
            OnboardingTracker.status == "completed",
        )
        .all()
    }
    completed = len(distinct_steps)

    progress = round((completed / TOTAL_STEPS) * 100) if TOTAL_STEPS else 0
    progress = min(progress, 100)

    if progress < 50:
        status = "Pending"
    elif progress < 80:
        status = "Inprogress"
    else:
        status = "Completed"

    return progress, status


def _to_row(db: Session, employee: Employee) -> OnboardingDashboardRow:
    progress, status = _progress_and_status(db, employee.id)
    return OnboardingDashboardRow(
        employee_pk=employee.id,
        employee_name=employee.name,
        emp_id=employee.employee_id,
        department=employee.department,
        joining_date=employee.joining_date,
        progress=progress,
        status=status,
    )


@router.get("", response_model=list[OnboardingDashboardRow])
def list_onboarding_dashboard(db: Session = Depends(get_db)):
    """Table data source: every employee, with computed progress/status."""
    employees = db.query(Employee).all()
    return [_to_row(db, e) for e in employees]


@router.get("/{employee_pk}", response_model=OnboardingDashboardRow)
def get_onboarding_dashboard_row(employee_pk: str, db: Session = Depends(get_db)):
    """Single employee row -- what the View button calls."""
    employee = db.query(Employee).filter(Employee.id == employee_pk).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return _to_row(db, employee)