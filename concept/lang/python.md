# Python & FastAPI Interview Questions with Answers

## Python Conceptual Questions & Answers

### Core Language Concepts

#### Q: Explain the difference between `is` and `==` operators and when to use each

**Answer:**
- `==` compares **values** (calls `__eq__` method)
- `is` compares **object identity** (checks if both variables point to the same object in memory)

```python
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a == b)  # True (same values)
print(a is b)  # False (different objects)
print(a is c)  # True (same object)

# Special case with small integers and strings (interning)
x = 5
y = 5
print(x is y)  # True (Python interns small integers)
```

**When to use:**
- Use `==` for value comparison (most common)
- Use `is` for singleton objects like `None`, `True`, `False`

#### Q: What is the Global Interpreter Lock (GIL) and how does it affect multithreading?

**Answer:**
The GIL is a mutex that prevents multiple native threads from executing Python bytecode simultaneously. Only one thread can execute Python code at a time.

**Impact on multithreading:**
- **CPU-bound tasks**: Threading provides no benefit due to GIL
- **I/O-bound tasks**: Threading is beneficial because GIL is released during I/O operations
- **Solutions**: Use multiprocessing for CPU-bound tasks, or asyncio for I/O-bound tasks

```python
# Threading beneficial for I/O-bound
import threading
import requests

def fetch_url(url):
    response = requests.get(url)  # GIL released during network I/O
    return response.status_code
```

#### Q: Describe Python's memory management and garbage collection

**Answer:**
Python uses **reference counting** as the primary garbage collection mechanism, supplemented by a **cyclic garbage collector**.

**Reference Counting:**
- Each object maintains a count of references to it
- When count reaches zero, object is immediately deallocated
- Fast but can't handle circular references

**Cyclic Garbage Collector:**
- Detects and cleans up circular references
- Runs periodically based on allocation thresholds
- Uses generational collection (objects are grouped by age)

```python
import gc

# Manual garbage collection
gc.collect()

# Check reference count
import sys
a = [1, 2, 3]
print(sys.getrefcount(a))  # Shows reference count
```

#### Q: What are metaclasses and when would you use them?

**Answer:**
Metaclasses are "classes that create classes." They define how classes are constructed and behave. The default metaclass is `type`.

**Common use cases:**
- ORM frameworks (like Django models)
- API frameworks for automatic validation
- Singletons and design patterns
- Attribute validation and modification

```python
class SingletonMeta(type):
    _instances = {}
    
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class Database(metaclass=SingletonMeta):
    def __init__(self):
        self.connection = "Connected"

# Both instances are the same object
db1 = Database()
db2 = Database()
print(db1 is db2)  # True
```

#### Q: What is the difference between `@staticmethod`, `@classmethod`, and instance methods?

**Answer:**

| Method Type | First Parameter | Access to | Use Case |
|-------------|----------------|-----------|----------|
| Instance method | `self` | Instance and class attributes | Operating on instance data |
| Class method | `cls` | Class attributes only | Alternative constructors, class-level operations |
| Static method | None | Neither instance nor class | Utility functions related to class |

```python
class Person:
    species = "Homo sapiens"
    
    def __init__(self, name):
        self.name = name
    
    def greet(self):  # Instance method
        return f"Hello, I'm {self.name}"
    
    @classmethod
    def from_string(cls, person_str):  # Class method
        name = person_str.split('-')[0]
        return cls(name)  # Alternative constructor
    
    @staticmethod
    def is_adult(age):  # Static method
        return age >= 18

# Usage
person = Person("Alice")
person2 = Person.from_string("Bob-25")
print(Person.is_adult(20))  # True
```

### Data Structures & Algorithms

#### Q: How do Python dictionaries work internally? What makes them O(1) for lookups?

**Answer:**
Python dictionaries use **hash tables** with **open addressing** and **random probing**.

**Internal structure:**
1. **Hash function**: Converts keys to hash values
2. **Hash table**: Array of buckets storing key-value pairs
3. **Collision resolution**: Uses random probing to find empty slots

**Why O(1) average case:**
- Hash function distributes keys uniformly
- Direct index calculation from hash value
- Minimal collisions with good hash functions

```python
# Hash table concept
def simple_hash(key, table_size):
    return hash(key) % table_size

# Python optimizations
d = {"a": 1, "b": 2}
print(d.__sizeof__())  # Memory usage
print(hash("a"))       # Hash value
```

**Worst case O(n)**: When many keys hash to same bucket (rare with good hash functions)

#### Q: What are generators and how do they differ from regular functions?

**Answer:**
Generators are functions that return iterators, yielding values lazily instead of computing all at once.

**Key differences:**

| Regular Function | Generator |
|------------------|-----------|
| Returns single value | Yields multiple values |
| Executes completely | Executes on-demand |
| Uses `return` | Uses `yield` |
| Memory: stores all data | Memory: stores only current state |

```python
# Regular function - memory intensive
def get_squares_list(n):
    return [i**2 for i in range(n)]  # All values in memory

# Generator - memory efficient
def get_squares_gen(n):
    for i in range(n):
        yield i**2  # One value at a time

# Usage
squares_list = get_squares_list(1000000)  # High memory usage
squares_gen = get_squares_gen(1000000)    # Low memory usage

# Generator maintains state
gen = get_squares_gen(5)
print(next(gen))  # 0
print(next(gen))  # 1
```

**Benefits:**
- Memory efficient for large datasets
- Lazy evaluation
- Can represent infinite sequences

### Advanced Python

#### Q: Explain closures and decorators with practical examples

**Answer:**

**Closures:**
A closure occurs when a nested function captures and retains access to variables from its enclosing scope.

```python
def make_multiplier(n):
    def multiplier(x):
        return x * n  # 'n' is captured from outer scope
    return multiplier

# 'n' is captured and retained
times_2 = make_multiplier(2)
times_3 = make_multiplier(3)

print(times_2(5))  # 10
print(times_3(5))  # 15
```

**Decorators:**
Functions that modify or extend behavior of other functions.

```python
import time
import functools

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.2f} seconds")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
    return "Done"

# Equivalent to: slow_function = timer(slow_function)
```

**Advanced decorator with parameters:**
```python
def retry(max_attempts=3, delay=1):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    time.sleep(delay)
        return wrapper
    return decorator

@retry(max_attempts=5, delay=2)
def unreliable_api_call():
    # May fail randomly
    pass
```

#### Q: What are context managers and how do you implement them?

**Answer:**
Context managers ensure proper resource management using the `with` statement. They implement `__enter__` and `__exit__` methods.

**Built-in example:**
```python
# Automatic file closing
with open('file.txt', 'r') as f:
    content = f.read()
# File is automatically closed
```

**Custom context manager - Class-based:**
```python
class DatabaseConnection:
    def __init__(self, db_name):
        self.db_name = db_name
        self.connection = None
    
    def __enter__(self):
        print(f"Connecting to {self.db_name}")
        self.connection = f"Connected to {self.db_name}"
        return self.connection
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"Closing connection to {self.db_name}")
        self.connection = None
        # Return False to propagate exceptions
        return False

# Usage
with DatabaseConnection("mydb") as conn:
    print(f"Using {conn}")
```

**Custom context manager - Function-based:**
```python
from contextlib import contextmanager

@contextmanager
def temporary_setting(setting, value):
    old_value = get_setting(setting)
    set_setting(setting, value)
    try:
        yield old_value
    finally:
        set_setting(setting, old_value)

# Usage
with temporary_setting('DEBUG', True):
    # DEBUG is True here
    pass
# DEBUG restored to original value
```

## FastAPI Conceptual Questions & Answers

### Framework Fundamentals

#### Q: What makes FastAPI different from Flask or Django? What are its key advantages?

**Answer:**

| Feature | FastAPI | Flask | Django |
|---------|---------|--------|--------|
| **Performance** | Very High (ASGI) | Medium (WSGI) | Medium (WSGI) |
| **Type Hints** | Native support | Manual | Manual |
| **Auto Documentation** | Built-in (OpenAPI) | Manual | Manual |
| **Async Support** | Native | Limited | Limited |
| **Data Validation** | Built-in (Pydantic) | Manual | Forms/Serializers |

**Key advantages:**
1. **Automatic API documentation** (Swagger UI, ReDoc)
2. **Type safety** with Python type hints
3. **High performance** comparable to NodeJS and Go
4. **Modern Python features** (async/await, type hints)
5. **Built-in data validation** and serialization

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class User(BaseModel):
    name: str
    age: int
    email: str

@app.post("/users/")
async def create_user(user: User):
    # Automatic validation, serialization, and documentation
    return {"message": f"User {user.name} created"}
```

#### Q: How does FastAPI achieve automatic API documentation generation?

**Answer:**
FastAPI generates documentation using the **OpenAPI specification** (formerly Swagger) by inspecting:

1. **Type hints** for request/response models
2. **Function signatures** for parameters
3. **Pydantic models** for data validation
4. **Docstrings** for descriptions
5. **HTTP methods and paths** from decorators

```python
from fastapi import FastAPI, Query, Path
from pydantic import BaseModel
from typing import Optional

app = FastAPI(
    title="My API",
    description="A sample API",
    version="1.0.0"
)

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int = Path(..., description="The ID of the user"),
    include_email: bool = Query(False, description="Include email in response")
):
    """
    Get a user by ID.
    
    This endpoint returns user information based on the provided ID.
    """
    return UserResponse(id=user_id, name="John", email="john@example.com")
```

**Generated documentation includes:**
- Interactive API explorer (Swagger UI at `/docs`)
- Alternative documentation (ReDoc at `/redoc`)
- OpenAPI schema (JSON at `/openapi.json`)

#### Q: Explain FastAPI's dependency injection system and its benefits

**Answer:**
FastAPI's dependency injection system allows you to declare dependencies that are automatically resolved and injected into your path operations.

**Basic dependency:**
```python
from fastapi import FastAPI, Depends

app = FastAPI()

def get_db():
    db = DatabaseSession()
    try:
        yield db
    finally:
        db.close()

@app.get("/users/")
async def get_users(db = Depends(get_db)):
    return db.query_users()
```

**Nested dependencies:**
```python
def get_current_user(token: str = Depends(oauth2_scheme)):
    # Validate token and return user
    return decode_token(token)

def get_admin_user(user = Depends(get_current_user)):
    if not user.is_admin:
        raise HTTPException(status_code=403)
    return user

@app.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    admin_user = Depends(get_admin_user)  # Depends on get_current_user
):
    # Only admin users can delete
    pass
```

**Benefits:**
1. **Code reuse**: Share common logic across endpoints
2. **Testing**: Easy to mock dependencies
3. **Separation of concerns**: Clean architecture
4. **Type safety**: Full type checking support
5. **Automatic resolution**: Dependencies resolved in correct order

**Dependency scopes:**
```python
# Function dependency (called for each request)
def get_db():
    return DatabaseSession()

# Class dependency (can maintain state)
class CommonQueryParams:
    def __init__(self, q: str = None, skip: int = 0, limit: int = 100):
        self.q = q
        self.skip = skip
        self.limit = limit
```

### Performance & Architecture

#### Q: Why is FastAPI considered high-performance? What technologies enable this?

**Answer:**
FastAPI achieves high performance through several key technologies:

**1. ASGI (Asynchronous Server Gateway Interface):**
```python
# Async support for concurrent requests
@app.get("/")
async def read_root():
    # Can handle thousands of concurrent connections
    await some_async_operation()
    return {"message": "Hello"}
```

**2. Starlette framework:**
- High-performance ASGI framework as foundation
- Optimized routing and middleware system
- WebSocket support

**3. Pydantic:**
- Fast serialization/deserialization using Cython
- Type validation without performance penalty

**4. Uvicorn server:**
- Lightning-fast ASGI server implementation
- Uses uvloop (faster than asyncio event loop)

**Performance comparison:**
```
Requests per second (higher is better):
- FastAPI: ~20,000 RPS
- Flask: ~3,000 RPS  
- Django: ~2,000 RPS
- Express.js: ~15,000 RPS
```

**Optimization techniques:**
```python
# Connection pooling
from databases import Database

database = Database("postgresql://...")

# Background tasks for non-blocking operations
from fastapi import BackgroundTasks

@app.post("/send-email/")
async def send_email(email: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(send_email_task, email)
    return {"message": "Email sent"}

# Caching
from functools import lru_cache

@lru_cache()
def get_settings():
    return Settings()
```

#### Q: How does FastAPI handle async/await compared to traditional frameworks?

**Answer:**

**Traditional frameworks (Flask, Django):**
- **Synchronous**: One request per thread
- **Blocking I/O**: Thread waits for I/O operations
- **Resource intensive**: More threads = more memory

**FastAPI with async/await:**
- **Asynchronous**: Single thread handles multiple requests
- **Non-blocking I/O**: Thread continues processing other requests
- **Resource efficient**: Handles thousands of concurrent connections

```python
# Synchronous (blocking)
@app.get("/sync")
def sync_endpoint():
    time.sleep(1)  # Blocks entire thread
    return {"message": "Done"}

# Asynchronous (non-blocking)
@app.get("/async")
async def async_endpoint():
    await asyncio.sleep(1)  # Releases control to event loop
    return {"message": "Done"}

# Database operations
@app.get("/users")
async def get_users():
    # Non-blocking database query
    users = await database.fetch_all("SELECT * FROM users")
    return users

# HTTP requests
import httpx

@app.get("/external-api")
async def call_external():
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.example.com")
        return response.json()
```

**When to use sync vs async:**
- **Use async**: I/O operations (database, HTTP requests, file operations)
- **Use sync**: CPU-bound operations, simple computations

### Advanced FastAPI

#### Q: Explain FastAPI's background tasks and when you would use them

**Answer:**
Background tasks allow you to run functions after returning a response, without making the client wait.

**Basic usage:**
```python
from fastapi import BackgroundTasks
import smtplib

def send_email(to_email: str, subject: str, body: str):
    # Simulate email sending
    time.sleep(2)  # This won't block the response
    print(f"Email sent to {to_email}")

@app.post("/send-notification/")
async def send_notification(
    email: str,
    background_tasks: BackgroundTasks
):
    # Add task to background queue
    background_tasks.add_task(send_email, email, "Welcome", "Thank you!")
    
    # Response sent immediately
    return {"message": "Notification scheduled"}
```

**Multiple background tasks:**
```python
@app.post("/process-order/")
async def process_order(
    order: Order,
    background_tasks: BackgroundTasks
):
    # Multiple tasks run in sequence
    background_tasks.add_task(update_inventory, order.items)
    background_tasks.add_task(send_confirmation_email, order.customer_email)
    background_tasks.add_task(log_order, order.id)
    
    return {"order_id": order.id, "status": "processing"}
```

**Use cases:**
1. **Email notifications**: Don't block user registration
2. **File processing**: Image resizing, PDF generation
3. **Logging**: Analytics, audit trails
4. **Cache warming**: Update caches after data changes
5. **Third-party integrations**: Webhook notifications

**Limitations:**
- Tasks run in same process (not distributed)
- No retry mechanism (use Celery for complex workflows)
- Tasks lost if server restarts

**For production:**
```python
# Use Celery for production background tasks
from celery import Celery

celery_app = Celery("tasks", broker="redis://localhost:6379")

@celery_app.task
def process_video(video_path: str):
    # Heavy processing task
    pass

@app.post("/upload-video/")
async def upload_video(video_file: UploadFile):
    # Queue task to Celery
    process_video.delay(video_file.filename)
    return {"message": "Video uploaded, processing started"}
```

#### Q: How do you implement authentication and authorization in FastAPI?

**Answer:**

**1. OAuth2 with JWT tokens:**
```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta

# Configuration
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# User model
class User(BaseModel):
    username: str
    email: str
    is_active: bool

# Utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Dependency to get current user
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = get_user_from_db(username)  # Your database function
    if user is None:
        raise credentials_exception
    return user

# Login endpoint
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# Protected endpoint
@app.get("/protected")
async def protected_route(current_user: User = Depends(get_current_user)):
    return {"message": f"Hello {current_user.username}"}
```

**2. Role-based authorization:**
```python
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"
    MODERATOR = "moderator"

class User(BaseModel):
    username: str
    role: UserRole

def require_role(required_role: UserRole):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user
    return role_checker

# Admin-only endpoint
@app.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    admin_user: User = Depends(require_role(UserRole.ADMIN))
):
    # Only admins can delete users
    pass
```

**3. API Key authentication:**
```python
from fastapi.security import APIKeyHeader

api_key_header = APIKeyHeader(name="X-API-Key")

def get_api_key(api_key: str = Depends(api_key_header)):
    if api_key not in valid_api_keys:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key"
        )
    return api_key

@app.get("/api/data")
async def get_data(api_key: str = Depends(get_api_key)):
    return {"data": "secret information"}
```

## Integration & Best Practices

### System Design

#### Q: How would you structure a large FastAPI application for maintainability?

**Answer:**

**Recommended project structure:**
```
my_fastapi_app/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app instance
│   ├── config.py            # Configuration settings
│   ├── database.py          # Database connection
│   ├── dependencies.py      # Global dependencies
│   │
│   ├── api/                 # API routes
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── endpoints/
│   │   │   │   ├── users.py
│   │   │   │   ├── items.py
│   │   │   │   └── auth.py
│   │   │   └── api.py       # API router
│   │   └── deps.py          # API dependencies
│   │
│   ├── core/                # Core functionality
│   │   ├── __init__.py
│   │   ├── security.py      # Security utilities
│   │   └── config.py        # Core configuration
│   │
│   ├── crud/                # Database operations
│   │   ├── __init__.py
│   │   ├── base.py          # Base CRUD class
│   │   ├── user.py          # User CRUD operations
│   │   └── item.py          # Item CRUD operations
│   │
│   ├── models/              # Database models
│   │   ├── __init__.py
│   │   ├── user.py          # User model
│   │   └── item.py          # Item model
│   │
│   ├── schemas/             # Pydantic models
│   │   ├── __init__.py
│   │   ├── user.py          # User schemas
│   │   └── item.py          # Item schemas
│   │
│   └── services/            # Business logic
│       ├── __init__.py
│       ├── user_service.py
│       └── email_service.py
│
├── tests/                   # Test files
├── alembic/                 # Database migrations
├── docker-compose.yml
├── Dockerfile
└── requirements.txt
```

**Main application file (app/main.py):**
```python
from fastapi import FastAPI
from app.api.v1.api import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Include routers
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Welcome to My FastAPI App"}
```

**Configuration management (app/core/config.py):**
```python
from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "My FastAPI App"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str
    DATABASE_URL: str
    
    # Email settings
    SMTP_HOST: str = "localhost"
    SMTP_PORT: int = 587
    
    class Config:
        env_file = ".env"

settings = Settings()
```

**Benefits of this structure:**
1. **Separation of concerns**: Clear boundaries between layers
2. **Scalability**: Easy to add new features and endpoints
3. **Testability**: Each component can be tested independently
4. **Maintainability**: Easy to locate and modify specific functionality
5. **Team collaboration**: Multiple developers can work on different modules

#### Q: How do you handle database connections and ORMs with FastAPI?

**Answer:**

**1. SQLAlchemy with async support:**
```python
# app/database.py
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Create async engine
engine = create_async_engine(settings.DATABASE_URL, echo=True)

# Create async session factory
AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

# Dependency to get database session
async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
```

**2. Database models (app/models/user.py):**
```python
from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
```

**3. CRUD operations (app/crud/user.py):**
```python
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.schemas.user import UserCreate

class UserCRUD:
    async def get_user(self, db: AsyncSession, user_id: int):
        result = await db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()
    
    async def get_user_by_email(self, db: AsyncSession, email: str):
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()
    
    async def create_user(self, db: AsyncSession, user: UserCreate):
        db_user = User(**user.dict())
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user

user_crud = UserCRUD()
```

**4. API endpoints (app/api/v1/endpoints/users.py):**
```python
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.crud.user import user_crud
from app.schemas.user import User, UserCreate

router = APIRouter()

@router.post("/", response_model=User)
async def create_user(
    user: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    return await user_crud.create_user(db=db, user=user)

@router.get("/{user_id}", response_model=User)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    return await user_crud.get_user(db=db, user_id=user_id)
```

**5. Database migrations with Alembic:**
```bash
# Initialize Alembic
alembic init alembic

# Generate migration
alembic revision --autogenerate -m "Create users table"

# Apply migrations
alembic upgrade head
```

**Alternative: Databases library (lightweight):**
```python
from databases import Database
from app.core.config import settings

database = Database(settings.DATABASE_URL)

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

# Usage in endpoints
@app.get("/users/")
async def get_users():
    query = "SELECT * FROM users"
    return await database.fetch_all(query)
```

### Error Handling & Security

#### Q: How do you implement custom exception handlers in FastAPI?

**Answer:**

**1. Custom exception classes:**
```python
# app/exceptions.py
from fastapi import HTTPException

class CustomException(Exception):
    def __init__(self, message: str):
        self.message = message

class UserNotFoundException(CustomException):
    pass

class InvalidCredentialsException(CustomException):
    pass

class InsufficientPermissionsException(CustomException):
    pass
```

**2. Exception handlers:**
```python
# app/main.py
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.exceptions import UserNotFoundException, InvalidCredentialsException

app = FastAPI()

@app.exception_handler(UserNotFoundException)
async def user_not_found_handler(request: Request, exc: UserNotFoundException):
    return JSONResponse(
        status_code=404,
        content={
            "error": "User Not Found",
            "message": exc.message,
            "path": str(request.url)
        }
    )

@app.exception_handler(InvalidCredentialsException)
async def invalid_credentials_handler(request: Request, exc: InvalidCredentialsException):
    return JSONResponse(
        status_code=401,
        content={
            "error": "Authentication Failed",
            "message": exc.message
        }
    )

# Handle validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Error",
            "details": exc.errors(),
            "body": exc.body
        }
    )

# Handle all HTTP exceptions
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )

# Handle unexpected errors
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    # Log the error
    logger.error(f"Unexpected error: {exc}")
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred"
        }
    )
```

**3. Using custom exceptions in endpoints:**
```python
from app.exceptions import UserNotFoundException

@app.get("/users/{user_id}")
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = await user_crud.get_user(db, user_id)
    if not user:
        raise UserNotFoundException(f"User with ID {user_id} not found")
    return user
```

**4. Middleware for error handling:**
```python
from fastapi import Request
from fastapi.responses import JSONResponse
import logging

@app.middleware("http")
async def error_handling_middleware(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as exc:
        logging.error(f"Unhandled error: {exc}")
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error"}
        )
```

#### Q: What are the security considerations when building APIs with FastAPI?

**Answer:**

**1. Input validation and sanitization:**
```python
from pydantic import BaseModel, validator, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr  # Built-in email validation
    username: str
    password: str
    
    @validator('username')
    def validate_username(cls, v):
        if len(v) < 3:
            raise ValueError('Username must be at least 3 characters')
        if not v.isalnum():
            raise ValueError('Username must be alphanumeric')
        return v
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v
```

**2. Authentication and authorization:**
```python
# Strong password hashing
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# JWT with proper claims
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),  # Issued at
        "type": "access"          # Token type
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
```

**3. CORS configuration:**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specific origins
    allow_credentials=True,
    allow_methods=["GET", "POST"],  # Specific methods
    allow_headers=["Authorization", "Content-Type"],
)
```

**4. Rate limiting:**
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/")
@limiter.limit("10/minute")
async def homepage(request: Request):
    return {"message": "Hello World"}
```

**5. Security headers:**
```python
from fastapi.middleware.trustedhost import TrustedHostMiddleware

# Trusted hosts
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["example.com"])

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response
```

**6. SQL injection prevention:**
```python
# Use parameterized queries
@app.get("/users/")
async def get_users(name: Optional[str] = None):
    if name:
        # Safe - uses parameters
        query = "SELECT * FROM users WHERE name = :name"
        return await database.fetch_all(query, {"name": name})
    else:
        return await database.fetch_all("SELECT * FROM users")
```

**7. Environment-based configuration:**
```python
# app/core/config.py
from pydantic import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str
    DATABASE_URL: str
    DEBUG: bool = False
    ALLOWED_HOSTS: list = ["localhost"]
    
    class Config:
        env_file = ".env"
        
# Never commit secrets to version control
# Use environment variables or secret management systems
```

**Key security principles:**
1. **Validate all inputs** - Use Pydantic models
2. **Authenticate and authorize** - Implement proper auth flow
3. **Use HTTPS** - Never transmit sensitive data over HTTP
4. **Rate limiting** - Prevent abuse and DoS attacks
5. **Security headers** - Protect against common web vulnerabilities
6. **Log security events** - Monitor for suspicious activity
7. **Keep dependencies updated** - Regular security updates
8. **Principle of least privilege** - Grant minimal necessary permissions