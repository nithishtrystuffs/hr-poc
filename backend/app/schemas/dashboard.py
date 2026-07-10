from pydantic import BaseModel
from typing import Optional


class OnboardingDashboardRow(BaseModel):
    """One row of the Onboarding Tracker table shown to HR/Ops."""
    employee_pk: str          # internal UUID -- used for the View button / detail calls
    employee_name: str
    emp_id: str
    department: str
    joining_date: Optional[str] = None
    progress: int              # 0-100
    status: str                 # "Pending" | "Inprogress" | "Completed"

    class Config:
        from_attributes = True


class OnboardingDashboardCreate(BaseModel):
    """
    Payload to add a new employee row to the tracker table.
    Creates the employee record and immediately kicks off onboarding
    (step 1 "Registered" is marked complete), so it shows up in the
    GET table right away at ~12% progress / "Pending".
    """
    employee_name: str
    emp_id: str
    email: str
    department: str
    joining_date: Optional[str] = None
    title: Optional[str] = None
    office: Optional[str] = None
    manager: Optional[str] = None