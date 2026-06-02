# EduNova AI LMS Deployment Checklist

## Frontend

1. Set `VITE_API_URL` to your deployed backend API URL, ending with `/api`.
2. Build with `npm run build` from `frontend/`.
3. Deploy the generated `frontend/dist` folder to your static host.

## Backend

1. Create a production `.env` from `backend/.env.example`.
2. Set `DJANGO_DEBUG=False`.
3. Set `DJANGO_ALLOWED_HOSTS` to your API domain.
4. Set `CORS_ALLOWED_ORIGINS` to your frontend domain.
5. Install dependencies with `pip install -r requirements.txt`.
6. Run `python manage.py migrate`.
7. Serve media files from `backend/media` through your production host or object storage.
8. Run Django with a production WSGI/ASGI server instead of `runserver`.

## Built-in roles

The app supports Admin, Teacher, and Student role dashboards. In production, create real accounts through the registration page or Django admin, then assign roles through `UserProfile`.
