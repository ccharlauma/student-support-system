from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from database import Base


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)

    student_name = Column(String(100), nullable=False)

    category = Column(String(50), nullable=False)

    subject = Column(String(200), nullable=False)

    description = Column(Text, nullable=False)

    priority = Column(String(20), default="Medium")

    status = Column(String(30), default="Open")

    assigned_to = Column(String(100), nullable=True)

    resolution = Column(Text, nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )