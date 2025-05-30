# CMF Analytics

Aplicación web full-stack construida con **Django + React** para visualizar, comparar y analizar series de rentabilidad de fondos desde la API de la CMF (Comisión para el Mercado Financiero de Chile).

## 🎯 Funcionalidades principales

1. **Dashboard Comparativo**  
   Selección de fondos y fechas para comparar series de rentabilidad mediante gráficas de línea y de torta.

2. **Ranking Mensual**  
   Ranking de fondos ordenados por rentabilidad en un mes específico, con filtros por AGF y paginación.

3. **Alertas e Insights**  
   Visualización de alertas automáticas generadas a partir de condiciones específicas del comportamiento de los fondos.

4. **Sistema de Autenticación JWT**  
   Login seguro con expiración automática y refresh de token. El frontend protege rutas privadas y muestra mensajes si la sesión expira.

---

## 🛠️ Tecnologías usadas

- **Frontend**: React.js + Vite + MUI (Material UI)
- **Backend**: Django 5 + Django REST Framework + SimpleJWT
- **Base de datos**: PostgreSQL
- **Estilos**: CSS personalizado con MUI
- **Autenticación**: JWT con refresh automático
- **Estado de sesión**: LocalStorage

---

## 🚀 Instrucciones para levantar el proyecto localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/Tekorita/cmf-analytics.git
cd cmf-analytics
```

### 2. Configurar entorno backend

```bash
cd backend/
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Crear archivo `.env` (o usar variables de entorno):

```
POSTGRES_DB=cmfdb
POSTGRES_USER=cmfuser
POSTGRES_PASSWORD=cmfpassword
CMF_API_KEY=xxxxx
CMF_BASIC_AUTH=xxxxx
CMF_COOKIE=xxxxx
```

### 3. Levantar la base de datos (usando Docker)

```bash
docker-compose up -d
```

### 4. Crear superusuario

```bash
python manage.py migrate
python manage.py createsuperuser
```

### 5. Levantar el backend

```bash
python manage.py runserver
```

### 6. Configurar frontend

```bash
cd frontend/
npm install
npm run dev
```

Visita: [http://localhost:5173](http://localhost:5173)

---

## 🔒 Sistema de Autenticación

- El login se realiza vía `POST /api/token/` enviando `username` y `password`.
- Se guardan `access_token` y `refresh_token` en `localStorage`.
- Si el token expira, se intenta renovar automáticamente.
- Si falla el refresh, se muestra un Snackbar y se redirige al login.

---

## 📁 Estructura del proyecto

```
cmf-analytics/
├── backend/
│   ├── cmfAnalytics/     # Proyecto Django
│   ├── fondos/           # App con views, serializers, urls
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── index.html
└── README.md
```

---

## ✍️ Autor

David Jesús Palma Lugo  
[https://davidpalmalugo.com](https://davidpalmalugo.com)

---

## 📌 Notas adicionales

- Proyecto hecho con foco en visualización clara de datos financieros.
- Diseño responsivo y enfocado en experiencia de usuario.
- Desplegable en AWS, Vercel o Render si se desea.

---

## ✅ Estado actual

✅ Funcional en local  
✅ Autenticación con protección de rutas  
✅ Estilos aplicados con Material UI  
✅ Filtros e inputs bien organizados  
⏳ En desarrollo continuo para añadir más funcionalidades
