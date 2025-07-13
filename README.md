# 🧠 Mental Health Tracker

A comprehensive mental health tracking application built with Node.js, React, and MongoDB. Track your mood, exercise, access resources, and find professional help all in one place.

## ✨ Features

### 🎯 Core Features
- **Mood Tracking**: Daily mood logging with detailed analytics and trends
- **Exercise Tracking**: Monitor physical activities and their impact on mental health
- **Mental Health Resources**: Educational content, articles, videos, and tools
- **Professional Directory**: Find verified mental health professionals
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 📊 Analytics & Insights
- Mood trend analysis and visualization
- Exercise impact on mental health
- Personalized recommendations
- Progress tracking and statistics
- Weekly and monthly reports

### 🛡️ Security & Privacy
- JWT-based authentication
- Password encryption with bcrypt
- Secure API endpoints
- User data protection

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mental-health-tracker
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mental-health-tracker
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CLIENT_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

5. **Run the application**
   ```bash
   # Start both server and client (development)
   npm run dev
   
   # Or start them separately:
   # Terminal 1 - Start server
   npm run server
   
   # Terminal 2 - Start client
   npm run client
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
mental-health-tracker/
├── server/                 # Backend Node.js/Express
│   ├── config/            # Database configuration
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   └── index.js           # Server entry point
├── client/                # Frontend React app
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Mood Tracking
- `POST /api/mood` - Create mood entry
- `GET /api/mood` - Get mood entries
- `PUT /api/mood/:id` - Update mood entry
- `DELETE /api/mood/:id` - Delete mood entry
- `GET /api/mood/stats/summary` - Get mood statistics
- `GET /api/mood/stats/trends` - Get mood trends

### Exercise Tracking
- `POST /api/exercise` - Create exercise entry
- `GET /api/exercise` - Get exercise entries
- `PUT /api/exercise/:id` - Update exercise entry
- `DELETE /api/exercise/:id` - Delete exercise entry
- `GET /api/exercise/stats/summary` - Get exercise statistics
- `GET /api/exercise/recommendations` - Get exercise recommendations

### Resources
- `GET /api/resources` - Get mental health resources
- `GET /api/resources/:id` - Get specific resource
- `GET /api/resources/category/:category` - Get resources by category
- `GET /api/resources/featured/list` - Get featured resources
- `POST /api/resources/:id/rate` - Rate a resource

### Professionals
- `GET /api/professionals` - Get mental health professionals
- `GET /api/professionals/:id` - Get specific professional
- `GET /api/professionals/emergency/list` - Get emergency professionals
- `GET /api/professionals/location/search` - Search by location
- `POST /api/professionals/:id/rate` - Rate a professional

## 🎨 Features in Detail

### Mood Tracking
- **Daily mood logging** with 1-10 scale
- **Mood types**: Happy, Sad, Angry, Anxious, Calm, Excited, Tired, Stressed, Peaceful
- **Additional metrics**: Stress level, energy level, sleep hours
- **Activity tracking**: Exercise, meditation, social, work, sleep, eating, hobby
- **Notes and tags** for detailed tracking
- **Analytics**: Trends, patterns, and insights

### Exercise Tracking
- **Exercise types**: Cardio, Strength, Yoga, Pilates, Walking, Running, Cycling, Swimming, Dancing, Meditation
- **Intensity levels**: Low, Moderate, High
- **Metrics**: Duration, calories burned, distance, steps, heart rate
- **Mood impact**: Track mood before and after exercise
- **Location tracking**: Home, Gym, Outdoor, Studio
- **Personalized recommendations** based on mood and energy levels

### Mental Health Resources
- **Categories**: Anxiety, Depression, Stress, Meditation, Exercise, Nutrition, Sleep, Relationships, Work
- **Content types**: Articles, Videos, Podcasts, Books, Worksheets, Meditation, Exercise, Tools
- **Difficulty levels**: Beginner, Intermediate, Advanced
- **Search and filter** functionality
- **Rating system** for quality assurance
- **Featured content** highlighting best resources

### Professional Directory
- **Professional types**: Psychiatrist, Psychologist, Therapist, Counselor, Social Worker, Life Coach, Nutritionist, Fitness Trainer
- **Specializations**: Anxiety, Depression, Trauma, Addiction, Relationships, Grief, Stress, Eating Disorders, Sleep, ADHD, Autism
- **Location-based search** with city and state filters
- **Availability**: In-person, Virtual, Both
- **Cost information**: Free, Low-cost, Moderate, High, Varies
- **Emergency contacts** for crisis situations
- **Sliding scale** options for affordability

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

## 🔒 Security Features

- **JWT Authentication** with token expiration
- **Password encryption** using bcrypt
- **Input validation** and sanitization
- **CORS protection** for API security
- **Helmet middleware** for security headers
- **Rate limiting** (can be added)
- **Data validation** with Mongoose schemas

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Different screen sizes and orientations

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
# Add to package.json
"engines": {
  "node": "16.x"
}

# Deploy to Heroku
heroku create your-app-name
git push heroku main
```

### Frontend Deployment (Netlify/Vercel)
```bash
# Build the application
cd client
npm run build

# Deploy to Netlify/Vercel
# Upload the build folder
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you need help or have questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🙏 Acknowledgments

- Mental health professionals for guidance
- Open source community for libraries and tools
- Users for feedback and suggestions

## 📊 Future Enhancements

- [ ] Push notifications for mood tracking reminders
- [ ] Integration with wearable devices
- [ ] AI-powered mood analysis and recommendations
- [ ] Group therapy and community features
- [ ] Telemedicine integration
- [ ] Mobile app development
- [ ] Advanced analytics and reporting
- [ ] Multi-language support

---

**Note**: This application is designed to support mental health tracking and should not replace professional medical advice. Always consult with qualified mental health professionals for serious concerns. 