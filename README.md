# Système d'Authentification PERN

## Présentation

Ce projet est un système d'authentification complet développé avec la **stack PERN (PostgreSQL, Express.js, React et Node.js)**. Il met en œuvre une architecture client-serveur moderne permettant la gestion sécurisée des utilisateurs au travers d'une API REST et d'une interface web React.

L'objectif principal de ce projet est de proposer une base solide pour le développement d'applications web nécessitant une authentification robuste, tout en appliquant les bonnes pratiques de développement backend, de sécurité et d'organisation du code.

---

# Fonctionnalités

Le système permet notamment :

* Création d'un compte utilisateur
* Authentification des utilisateurs
* Déconnexion sécurisée
* Protection des routes privées
* Gestion des profils utilisateurs
* Chiffrement des mots de passe avec **bcrypt**
* Authentification basée sur **JSON Web Token (JWT)**
* Validation des données reçues par l'API
* Gestion centralisée des erreurs
* Configuration par variables d'environnement

---

# Architecture du projet

```text
.
├── backend
│   ├── config
│   ├── controllers
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   └── server.js
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── context
│   │   ├── services
│   │   ├── hooks
│   │   └── App.jsx
│
└── README.md
```

L'application est organisée selon une architecture modulaire afin de faciliter la maintenance, les évolutions futures et la séparation des responsabilités entre les différentes couches de l'application.

---

# Technologies utilisées

## Backend

* Node.js
* Express.js
* PostgreSQL
* JWT (JSON Web Token)
* bcrypt
* dotenv
* CORS

## Frontend

* React
* React Router
* Axios
* Context API
* CSS

---

# Installation

## Cloner le dépôt

```bash
git clone https://github.com/votre-utilisateur/pern-authentication.git

cd pern-authentication
```

## Installer les dépendances

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

# Configuration

Créer un fichier `.env` dans le dossier **backend**.

```env
PORT=

DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=
JWT_EXPIRES_IN=
```

---

# Exécution du projet

Démarrer le serveur backend :

```bash
npm run dev
```

Démarrer le client React :

```bash
npm run dev
```

---

# API REST

| Méthode | Route              | Description                            |
| ------- | ------------------ | -------------------------------------- |
| POST    | /api/auth/register | Création d'un compte                   |
| POST    | /api/auth/login    | Authentification                       |
| POST    | /api/auth/logout   | Déconnexion                            |
| GET     | /api/auth/me       | Informations de l'utilisateur connecté |

---

# Flux d'authentification

Le processus d'authentification suit les étapes suivantes :

1. L'utilisateur soumet ses identifiants via le client React.
2. L'API Express vérifie les informations reçues.
3. Le mot de passe est comparé à sa version chiffrée enregistrée dans PostgreSQL.
4. Si l'authentification est valide, un jeton JWT est généré.
5. Ce jeton est utilisé pour accéder aux ressources protégées de l'application.

---

# Perspectives d'évolution

Ce projet pourra être enrichi par plusieurs fonctionnalités complémentaires, notamment :

* Authentification à deux facteurs (2FA)
* Vérification d'adresse électronique
* Réinitialisation du mot de passe
* Authentification via Google ou GitHub (OAuth)
* Gestion des rôles et des permissions (RBAC)
* Conteneurisation avec Docker
* Déploiement automatisé (CI/CD)

---

# Licence

Ce projet est distribué sous licence **MIT**.

---

# Auteur

**Mmor Mbow**

Étudiant en génie logiciel, passionné par le développement backend, les API REST, les bases de données et les architectures web modernes.
