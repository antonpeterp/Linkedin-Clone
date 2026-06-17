# LinkedIn Clone

A full-stack LinkedIn-inspired social networking platform where users can create profiles, connect with others, share posts, and interact through likes and comments.

## Live Demo

Live Site: linkedin-clone-m6gx.onrender.com

##  Features

- User Authentication & Authorization
- Create and Manage Profiles
- Create, Edit, and Delete Posts
- Like and Comment on Posts
- Follow / Connect with Users
- Responsive Design for Mobile and Desktop
- Image Upload Support
- Real-time User Experience
- Protected Routes
- Modern UI inspired by LinkedIn

---

## Tech Stack

### Frontend
- React.js
- React Router
- Context API
- Axios
- CSS / Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication
- JWT (JSON Web Token)
- bcrypt.js

### Deployment
- Render 

---

## Project Structure

```
linkedin-clone/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
└── README.md
```

---

##  Installation

### Clone the Repository

```bash
git clone https://github.com/antonpeterp/linkedin-clone.git
cd linkedin-clone
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run the backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Required variables:

```env
MONGO_URI=
JWT_SECRET=
PORT=
```

Cloudinary:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Future Improvements

- Direct Messaging
- Job Posting System
- Profile Verification
- Dark Mode

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Author

**Anton Peter**

- GitHub: https://github.com/antonpeterp
- LinkedIn:(https://www.linkedin.com/in/antonpeterp/)

If you found this project helpful, please give it a star.
