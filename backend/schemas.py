from pydantic import BaseModel


class TicketCreate(BaseModel):

    student_name: str

    category: str

    subject: str

    description: str

    priority: str = "Medium"


class TicketUpdate(BaseModel):

    student_name: str | None = None

    category: str | None = None

    subject: str | None = None

    description: str | None = None

    priority: str | None = None

    status: str | None = None

    assigned_to: str | None = None

    resolution: str | None = None