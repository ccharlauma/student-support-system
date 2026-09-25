from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Literal
from sqlalchemy.orm import Session

from database import engine, Base, SessionLocal
from models import Ticket
from schemas import TicketCreate, TicketUpdate


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Student Support & Ticket Management System"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {
        "message": "Student Support API is running"
    }


@app.post("/tickets")
def create_ticket(
    ticket: TicketCreate,
    db: Session = Depends(get_db)
):
    new_ticket = Ticket(
        student_name=ticket.student_name,
        category=ticket.category,
        subject=ticket.subject,
        description=ticket.description,
        priority=ticket.priority
    )

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    return new_ticket



@app.get("/tickets")
def get_tickets(
    status: str | None = None,
    priority: str | None = None,
    student_name: str | None = None,
    category: str | None = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    sort_by: Literal["id", "priority", "status", "created_at"] = "id",
    sort_order: Literal["asc", "desc"] = "asc",
    db: Session = Depends(get_db)
):
    query = db.query(Ticket)

    if status:
        query = query.filter(Ticket.status == status)

    if priority:
        query = query.filter(Ticket.priority == priority)

    if student_name:
        query = query.filter(Ticket.student_name.ilike(f"%{student_name}%"))

    if category:
        query = query.filter(Ticket.category == category)

    if sort_by == "id":
        sort_column = Ticket.id
    elif sort_by == "priority":
        sort_column = Ticket.priority
    elif sort_by == "status":
        sort_column = Ticket.status
    elif sort_by == "created_at":
        sort_column = Ticket.created_at
    else:
        sort_column = Ticket.id

    if sort_order.lower() == "desc":
       query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())

    skip = (page - 1) * limit

    return query.offset(skip).limit(limit).all()


@app.get("/tickets/{ticket_id}")
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    return ticket



@app.put("/tickets/{ticket_id}")
def update_ticket(
    ticket_id: int,
    ticket_data: TicketUpdate,
    db: Session = Depends(get_db)
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if ticket_data.student_name is not None:
        ticket.student_name = ticket_data.student_name

    if ticket_data.category is not None:
        ticket.category = ticket_data.category

    if ticket_data.subject is not None:
        ticket.subject = ticket_data.subject

    if ticket_data.description is not None:
        ticket.description = ticket_data.description

    if ticket_data.priority is not None:
        ticket.priority = ticket_data.priority

    if ticket_data.status is not None:
        ticket.status = ticket_data.status

    if ticket_data.assigned_to is not None:
        ticket.assigned_to = ticket_data.assigned_to

    if ticket_data.resolution is not None:
        ticket.resolution = ticket_data.resolution

    db.commit()
    db.refresh(ticket)

    return ticket


@app.delete("/tickets/{ticket_id}")
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db)
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    db.delete(ticket)
    db.commit()

    return {"message": "Ticket deleted successfully"}