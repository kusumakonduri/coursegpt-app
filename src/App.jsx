import React, { useState, useEffect, useCallback, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { Camera, Book, Pen, User, Users, BookOpen, Edit3, Check, X, Download, Upload, Plus, Trash, Save, Settings, LogOut, Key, Mail, FileText, Home, Search, ChevronDown, ChevronRight } from "lucide-react";

const altchaConfig = {
  hostname: "localhost:5173",
  apiKey: "ckey_01d6e102bdaf4b1689fa9e712422",
  secret: "csec_ec80fd56dde51626d9c02d12a47d0ffd9aa8c65338a37661"
};

const mockDB = {
  users: {},
  modules: {}
};

const generateAILesson = (topic, concept, difficulty = "intermediate") => {
  const difficultyLevels = {
    beginner: {
      depth: "fundamental concepts",
      activities: "introductory exercises",
      assessments: "basic comprehension questions"
    },
    intermediate: {
      depth: "practical applications",
      activities: "case studies and problem-solving",
      assessments: "analytical assignments"
    },
    advanced: {
      depth: "complex theories and innovations",
      activities: "research projects and critical analysis",
      assessments: "synthesis and evaluation tasks"
    }
  };

  const level = difficultyLevels[difficulty] || difficultyLevels.intermediate;
  
  const title = `${concept}: A ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Introduction`;
  
  const description = `This comprehensive lesson explores ${concept} within the broader field of ${topic}. 
    Students will engage with ${level.depth} through interactive learning experiences designed to build 
    both theoretical understanding and practical skills.`;
  
  const learningOutcomes = [
    `Demonstrate a thorough understanding of ${concept} principles and frameworks`,
    `Apply ${concept} methodologies to solve real-world problems in ${topic}`,
    `Analyze the relationships between ${concept} and other key elements of ${topic}`,
    `Evaluate the effectiveness of different approaches to ${concept} implementation`,
    `Create original solutions using ${concept} techniques`
  ];
  
  const keyConcepts = [
    `Core principles of ${concept}`,
    `Historical evolution of ${concept} in ${topic}`,
    `Contemporary applications of ${concept}`,
    `Theoretical frameworks supporting ${concept}`,
    `${concept} in practice: case studies and examples`
  ];
  
  const activities = [
    `Collaborative discussion: Implications of ${concept} in modern ${topic}`,
    `${level.activities}: Applying ${concept} to authentic scenarios`,
    `Peer teaching: Students present aspects of ${concept} to classmates`,
    `Reflective journaling: Personal insights on learning about ${concept}`,
    `Media creation: Develop visual representations of ${concept} principles`
  ];
  
  const assessments = [
    `${level.assessments} covering key aspects of ${concept}`,
    `Project-based assessment demonstrating mastery of ${concept}`,
    `Peer evaluation of ${concept} application exercises`,
    `Self-assessment reflection on ${concept} understanding`,
    `Cumulative portfolio demonstrating growth in ${concept} competency`
  ];
  
  const resources = [
    `Core readings on ${concept} foundations`,
    `Video demonstrations of ${concept} applications`,
    `Interactive simulations exploring ${concept} dynamics`,
    `Expert interviews discussing ${concept} in the field`,
    `Community forums for ongoing discussion of ${concept}`
  ];

  return {
    title,
    description,
    learningOutcomes,
    keyConcepts,
    activities,
    assessments,
    resources,
    difficulty,
    topic,
    concept,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    id: Date.now().toString() // Simple ID generation
  };
};

const suggestRelatedConcepts = (topic, concept) => {
  const conceptMap = {
    "mathematics": ["algebra", "calculus", "geometry", "statistics", "number theory", "probability"],
    "programming": ["algorithms", "data structures", "object-oriented programming", "functional programming", "web development", "databases"],
    "biology": ["cells", "genetics", "evolution", "ecology", "physiology", "microbiology"],
    "chemistry": ["organic chemistry", "inorganic chemistry", "biochemistry", "thermodynamics", "analytical chemistry"],
    "physics": ["mechanics", "electromagnetism", "thermodynamics", "quantum mechanics", "relativity"],
    "history": ["ancient civilizations", "middle ages", "renaissance", "industrial revolution", "world wars", "modern history"],
    "literature": ["poetry", "fiction", "drama", "literary criticism", "comparative literature"],
    "psychology": ["cognitive psychology", "developmental psychology", "social psychology", "abnormal psychology", "neuropsychology"]
  };

  const defaultSuggestions = [
    "fundamental principles", 
    "historical development", 
    "practical applications", 
    "theoretical frameworks", 
    "case studies"
  ];

  const topicConcepts = conceptMap[topic.toLowerCase()] || defaultSuggestions;
    return topicConcepts
    .filter(c => c.toLowerCase() !== concept.toLowerCase())
    .slice(0, 5);
};

const AuthService = {
  currentUser: null,
  
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password && password.length >= 6) {
          const user = {
            uid: `user_${Date.now()}`,
            email,
            displayName: email.split('@')[0]
          };
          
          AuthService.currentUser = user;
          if (!mockDB.users[user.uid]) {
            mockDB.users[user.uid] = {
              displayName: user.displayName,
              email: user.email,
              createdAt: new Date().toISOString(),
              role: "teacher"
            };
            mockDB.modules[user.uid] = [];
          }
          
          resolve(user);
        } else {
          reject(new Error("Invalid email or password"));
        }
      }, 800); // Simulate network delay
    });
  },
  
  register: async (email, password, name) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password && password.length >= 6 && name) {
          const user = {
            uid: `user_${Date.now()}`,
            email,
            displayName: name
          };
          
          AuthService.currentUser = user;
          
          // Create user in mock DB
          mockDB.users[user.uid] = {
            displayName: name,
            email: user.email,
            createdAt: new Date().toISOString(),
            role: "teacher"
          };
          mockDB.modules[user.uid] = [];
          
          resolve(user);
        } else {
          reject(new Error("Please fill all required fields. Password must be at least 6 characters."));
        }
      }, 800);
    });
  },
  
  logout: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        AuthService.currentUser = null;
        resolve();
      }, 500);
    });
  },
  
  resetPassword: async (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email) {
          resolve({ success: true });
        } else {
          reject(new Error("Email is required"));
        }
      }, 800);
    });
  }
};

const DatabaseService = {
  saveModule: async (userId, moduleData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const moduleId = `module_${Date.now()}`;
        const newModule = { ...moduleData, id: moduleId };
        
        if (!mockDB.modules[userId]) {
          mockDB.modules[userId] = [];
        }
        
        mockDB.modules[userId].push(newModule);
        resolve({ id: moduleId, ...newModule });
      }, 600);
    });
  },
  
  getModules: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockDB.modules[userId] || []);
      }, 600);
    });
  },
  
  updateModule: async (userId, moduleId, updatedData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!mockDB.modules[userId]) {
          reject(new Error("User has no modules"));
          return;
        }
        
        const moduleIndex = mockDB.modules[userId].findIndex(m => m.id === moduleId);
        if (moduleIndex === -1) {
          reject(new Error("Module not found"));
          return;
        }
        
        mockDB.modules[userId][moduleIndex] = {
          ...mockDB.modules[userId][moduleIndex],
          ...updatedData,
          lastModified: new Date().toISOString()
        };
        
        resolve(mockDB.modules[userId][moduleIndex]);
      }, 600);
    });
  },
  
  deleteModule: async (userId, moduleId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!mockDB.modules[userId]) {
          reject(new Error("User has no modules"));
          return;
        }
        
        const initialLength = mockDB.modules[userId].length;
        mockDB.modules[userId] = mockDB.modules[userId].filter(m => m.id !== moduleId);
        
        if (mockDB.modules[userId].length === initialLength) {
          reject(new Error("Module not found"));
          return;
        }
        
        resolve({ success: true });
      }, 600);
    });
  }
};

const AuthUI = ({ onLogin, onRegister, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [altchaVerified, setAltchaVerified] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    
    if (!altchaVerified) {
      setMessage("Please complete the ALTCHA verification");
      return;
    }
    
    try {
      if (forgotPassword) {
        await AuthService.resetPassword(email);
        setMessage("Password reset email sent! Check your inbox.");
        setForgotPassword(false);
      } else if (isRegister) {
        await onRegister(email, password, name);
      } else {
        await onLogin(email, password);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleAltchaChange = () => {
    setAltchaVerified(true);
  };

  const renderAltchaWidget = () => {
    return (
      <div className="border border-gray-300 rounded p-4 mb-4 bg-gray-50">
        <div className="flex items-center mb-2">
          <Key className="w-5 h-5 mr-2 text-blue-500" />
          <span className="font-medium">ALTCHA Verification</span>
        </div>
        <p className="text-sm text-gray-600 mb-3">Please verify you're human by clicking the button below</p>
        <button 
          type="button"
          onClick={handleAltchaChange}
          className={`w-full py-2 rounded text-white ${altchaVerified ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'}`}
          disabled={altchaVerified}
        >
          {altchaVerified ? (
            <span className="flex items-center justify-center">
              <Check className="w-4 h-4 mr-2" /> Verified
            </span>
          ) : 'Verify'}
        </button>
      </div>
    );
  };

  if (forgotPassword) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Reset Password</h2>
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          {renderAltchaWidget()}
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Send Reset Email
          </button>
          <div className="text-center">
            <button 
              type="button" 
              onClick={() => setForgotPassword(false)} 
              className="text-blue-600 hover:underline"
            >
              Back to login
            </button>
          </div>
        </form>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {isRegister ? "Create an Account" : "Login to CourseGPT"}
      </h2>
      <form onSubmit={handleAuth} className="space-y-4">
        {isRegister && (
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        )}
        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        
        {renderAltchaWidget()}
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isRegister ? "Register" : "Login"}
        </button>
        <div className="flex justify-between text-sm">
          <button 
            type="button" 
            onClick={() => setIsRegister(!isRegister)} 
            className="text-blue-600 hover:underline"
          >
            {isRegister ? "Already have an account? Login" : "Need an account? Register"}
          </button>
          {!isRegister && (
            <button 
              type="button" 
              onClick={() => setForgotPassword(true)} 
              className="text-blue-600 hover:underline"
            >
              Forgot password?
            </button>
          )}
        </div>
      </form>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      {error && <p className="mt-4 text-center text-red-500">{error}</p>}
    </div>
  );
};

// LessonEditor component
const LessonEditor = ({ lesson, onSave, onCancel }) => {
  const [editedLesson, setEditedLesson] = useState({ ...lesson });
  
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  }), []);

  const handleChange = (field, value) => {
    setEditedLesson(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...editedLesson[field]];
    newArray[index] = value;
    handleChange(field, newArray);
  };

  const handleAddArrayItem = (field) => {
    const newArray = [...(editedLesson[field] || []), ""];
    handleChange(field, newArray);
  };

  const handleRemoveArrayItem = (field, index) => {
    const newArray = [...editedLesson[field]];
    newArray.splice(index, 1);
    handleChange(field, newArray);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Edit3 className="w-5 h-5 mr-2" /> 
        Edit Lesson
      </h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Title</label>
          <input
            type="text"
            value={editedLesson.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Difficulty</label>
          <select
            value={editedLesson.difficulty || "intermediate"}
            onChange={(e) => handleChange("difficulty", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Description</label>
          <ReactQuill
            value={editedLesson.description || ""}
            onChange={(value) => handleChange("description", value)}
            modules={modules}
            className="bg-white border border-gray-300 rounded"
          />
        </div>
        
        {["learningOutcomes", "keyConcepts", "activities", "assessments", "resources"].map((field) => (
          <div key={field}>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-700 font-medium">
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <button
                type="button"
                onClick={() => handleAddArrayItem(field)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </button>
            </div>
            
            {editedLesson[field]?.map((item, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange(field, index, e.target.value)}
                  className="flex-grow p-2 border border-gray-300 rounded-l"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem(field, index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 rounded-r"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end mt-6 space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(editedLesson)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Save className="w-4 h-4 mr-2" /> Save Changes
        </button>
      </div>
    </div>
  );
};

// Module component
const Module = ({ module, onEdit, onDelete, onView }) => {
  const [expanded, setExpanded] = useState(false);
  
  const formatDate = (timestamp) => {
    if (!timestamp) return "Date unknown";
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-4 overflow-hidden">
      <div 
        className="p-4 cursor-pointer flex justify-between items-center bg-gray-50 hover:bg-gray-100"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          {expanded ? 
            <ChevronDown className="w-5 h-5 mr-2 text-gray-500" /> : 
            <ChevronRight className="w-5 h-5 mr-2 text-gray-500" />
          }
          <h3 className="font-medium text-lg">{module.title}</h3>
        </div>
        <div className="text-sm text-gray-500">
          {formatDate(module.createdAt)}
        </div>
      </div>

      {expanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="mb-3">
            <div className="text-sm text-gray-500 mb-1">Difficulty:</div>
            <div className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
              {module.difficulty || "Intermediate"}
            </div>
          </div>
          
          <div className="mb-3">
            <div className="text-sm text-gray-500 mb-1">Description:</div>
            <div className="text-sm" dangerouslySetInnerHTML={{ __html: module.description || "" }} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Learning Outcomes:</div>
              <ul className="list-disc pl-5 text-sm">
                {module.learningOutcomes?.map((outcome, i) => (
                  <li key={i}>{outcome}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Key Concepts:</div>
              <ul className="list-disc pl-5 text-sm">
                {module.keyConcepts?.map((concept, i) => (
                  <li key={i}>{concept}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-3 flex justify-end space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(module);
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center text-sm"
            >
              <BookOpen className="w-4 h-4 mr-1" /> View
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(module);
              }}
              className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center text-sm"
            >
              <Edit3 className="w-4 h-4 mr-1" /> Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(module.id);
              }}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center text-sm"
            >
              <Trash className="w-4 h-4 mr-1" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main CourseGPT component
export default function CourseGPT() {
  // User state
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Course content states
  const [modules, setModules] = useState([]);
  const [topic, setTopic] = useState("");
  const [concept, setConcept] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [currentLesson, setCurrentLesson] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [relatedConcepts, setRelatedConcepts] = useState([]);
  
  // UI states
  const [activeTab, setActiveTab] = useState("modules");
  const [notification, setNotification] = useState(null);
  
  // Fetch modules when user changes
  useEffect(() => {
    if (user) {
      fetchModules(user.uid);
    }
  }, [user]);

  // Fetch modules from mock database
  const fetchModules = async (userId) => {
    try {
      setLoading(true);
      const moduleList = await DatabaseService.getModules(userId);
      setModules(moduleList);
    } catch (error) {
      console.error("Error fetching modules:", error);
      showNotification("Failed to load your modules", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle login
  const handleLogin = async (email, password) => {
    try {
      setAuthError("");
      setLoading(true);
      const loggedInUser = await AuthService.login(email, password);
      setUser(loggedInUser);
      setUserProfile({
        displayName: loggedInUser.displayName,
        email: loggedInUser.email,
        role: "teacher"
      });
      showNotification("Successfully logged in!", "success");
    } catch (error) {
      console.error("Login error:", error);
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle registration
  const handleRegister = async (email, password, name) => {
    try {
      setAuthError("");
      setLoading(true);
      const registeredUser = await AuthService.register(email, password, name);
      setUser(registeredUser);
      setUserProfile({
        displayName: name,
        email: email,
        role: "teacher"
      });
      showNotification("Account created successfully!", "success");
    } catch (error) {
      console.error("Registration error:", error);
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      setLoading(true);
      await AuthService.logout();
      setUser(null);
      setUserProfile(null);
      setModules([]);
      showNotification("Successfully logged out", "success");
    } catch (error) {
      console.error("Logout error:", error);
      showNotification("Error during logout", "error");
    } finally {
      setLoading(false);
    }
  };

  // Generate a new lesson
  const handleGenerateLesson = () => {
    if (!topic || !concept) {
      showNotification("Please enter both topic and concept", "warning");
      return;
    }
    
    const generatedLesson = generateAILesson(topic, concept, difficulty);
    setCurrentLesson(generatedLesson);
    setRelatedConcepts(suggestRelatedConcepts(topic, concept));
    showNotification("Lesson generated successfully!", "success");
  };

  // Save lesson to mock database
  const handleSaveLesson = async () => {
    if (!currentLesson || !user) return;
    
    try {
      setLoading(true);
      const lessonData = {
        ...currentLesson,
        topic,
        concept,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };
      
      const savedLesson = await DatabaseService.saveModule(user.uid, lessonData);
      setModules(prev => [...prev, savedLesson]);
      setCurrentLesson(null);
      setTopic("");
      setConcept("");
      setActiveTab("modules");
      showNotification("Lesson saved successfully!", "success");
    } catch (error) {
      console.error("Error saving lesson:", error);
      showNotification("Failed to save lesson", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle editing a lesson
  const handleEditLesson = (lesson) => {
    setCurrentLesson(lesson);
    setIsEditing(true);
    setActiveTab("create");
  };

  // Handle saving edited lesson
  const handleSaveEdited = async (editedLesson) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const updatedLesson = await DatabaseService.updateModule(
        user.uid, 
        editedLesson.id, 
        {
          ...editedLesson,
          lastModified: new Date().toISOString()
        }
      );
      
      setModules(prev => 
        prev.map(module => module.id === updatedLesson.id ? updatedLesson : module)
      );
      
      setCurrentLesson(null);
      setIsEditing(false);
      setActiveTab("modules");
      showNotification("Lesson updated successfully!", "success");
    } catch (error) {
      console.error("Error updating lesson:", error);
      showNotification("Failed to update lesson", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a lesson
  const handleDeleteLesson = async (lessonId) => {
    if (!user) return;
    
    if (!window.confirm("Are you sure you want to delete this lesson?")) {
      return;
    }
    
    try {
      setLoading(true);
      await DatabaseService.deleteModule(user.uid, lessonId);
      setModules(prev => prev.filter(module => module.id !== lessonId));
      showNotification("Lesson deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting lesson:", error);
      showNotification("Failed to delete lesson", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle viewing a lesson
  const handleViewLesson = (lesson) => {
    setCurrentLesson(lesson);
    setIsEditing(false);
    setActiveTab("view");
  };

  // Show notification
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Filter modules by search query
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return modules;
    
    const query = searchQuery.toLowerCase();
    return modules.filter(module => 
      module.title?.toLowerCase().includes(query) ||
      module.description?.toLowerCase().includes(query) ||
      module.topic?.toLowerCase().includes(query) ||
      module.concept?.toLowerCase().includes(query)
    );
  }, [modules, searchQuery]);

  // Handle using a related concept
  const handleUseRelatedConcept = (relatedConcept) => {
    setConcept(relatedConcept);
    handleGenerateLesson();
  };

  // Render notification component
  const renderNotification = () => {
    if (!notification) return null;
    
    const bgColors = {
      success: "bg-green-100 border-green-500 text-green-700",
      error: "bg-red-100 border-red-500 text-red-700",
      warning: "bg-yellow-100 border-yellow-500 text-yellow-700",
      info: "bg-blue-100 border-blue-500 text-blue-700"
    };
    
    const bgColor = bgColors[notification.type] || bgColors.info;
    
    return (
      <div className={`fixed top-4 right-4 px-4 py-3 rounded border-l-4 ${bgColor} max-w-sm animate-fade-in`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {notification.type === "success" && <Check className="w-5 h-5 mr-2" />}
            {notification.type === "error" && <X className="w-5 h-5 mr-2" />}
            {notification.type === "warning" && <AlertTriangle className="w-5 h-5 mr-2" />}
            {notification.type === "info" && <Info className="w-5 h-5 mr-2" />}
            <p>{notification.message}</p>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Render lesson view
  const renderLessonView = () => {
    if (!currentLesson) return null;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
          <div className="flex items-center mt-2 text-sm">
            <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800 mr-3">
              {currentLesson.difficulty || "Intermediate"}
            </span>
            <span className="text-gray-600">
              Created: {new Date(currentLesson.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: currentLesson.description }} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Learning Outcomes</h2>
            <ul className="list-disc pl-5 space-y-2">
              {currentLesson.learningOutcomes?.map((outcome, i) => (
                <li key={i} className="text-gray-700">{outcome}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">Key Concepts</h2>
            <ul className="list-disc pl-5 space-y-2">
              {currentLesson.keyConcepts?.map((concept, i) => (
                <li key={i} className="text-gray-700">{concept}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Activities</h2>
            <ul className="list-disc pl-5 space-y-2">
              {currentLesson.activities?.map((activity, i) => (
                <li key={i} className="text-gray-700">{activity}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3">Assessments</h2>
            <ul className="list-disc pl-5 space-y-2">
              {currentLesson.assessments?.map((assessment, i) => (
                <li key={i} className="text-gray-700">{assessment}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Resources</h2>
          <ul className="list-disc pl-5 space-y-2">
            {currentLesson.resources?.map((resource, i) => (
              <li key={i} className="text-gray-700">{resource}</li>
            ))}
          </ul>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => {
              setActiveTab("modules");
              setCurrentLesson(null);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Modules
          </button>
          <button
            onClick={() => handleEditLesson(currentLesson)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Edit3 className="w-4 h-4 mr-2" /> Edit Lesson
          </button>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-gray-100">
      {renderNotification()}
      
      {!user ? (
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">CourseGPT</h1>
              <p className="text-xl text-gray-600">Create AI-powered educational content in seconds</p>
            </div>
            <AuthUI 
              onLogin={handleLogin} 
              onRegister={handleRegister} 
              error={authError} 
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen">
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <div className="flex items-center">
                <Book className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">CourseGPT</h1>
              </div>
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="text-sm text-gray-500">Signed in as</div>
                  <div className="text-sm font-medium">{userProfile?.displayName || user.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center text-sm"
                >
                  <LogOut className="w-4 h-4 mr-1" /> Logout
                </button>
              </div>
            </div>
          </header>
          
          <main className="flex-grow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="mb-6 border-b pb-4">
                <nav className="flex">
                  <button
                    onClick={() => {
                      setActiveTab("modules");
                      setCurrentLesson(null);
                      setIsEditing(false);
                    }}
                    className={`mr-4 py-2 px-1 ${
                      activeTab === "modules" 
                        ? "border-b-2 border-blue-500 text-blue-600 font-medium" 
                        : "text-gray-500 hover:text-gray-700"
                    } flex items-center`}
                  >
                    <Home className="w-4 h-4 mr-2" /> My Modules
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("create");
                      if (isEditing) {
                        setIsEditing(false);
                        setCurrentLesson(null);
                      }
                    }}
                    className={`mr-4 py-2 px-1 ${
                      activeTab === "create" 
                        ? "border-b-2 border-blue-500 text-blue-600 font-medium" 
                        : "text-gray-500 hover:text-gray-700"
                    } flex items-center`}
                  >
                    <Pen className="w-4 h-4 mr-2" /> Create New
                  </button>
                  {activeTab === "view" && (
                    <div className="py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" /> View Lesson
                    </div>
                  )}
                </nav>
              </div>
              
              {loading && (
                <div className="flex justify-center my-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
              
              {!loading && activeTab === "modules" && (
                <div>
                  <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Your Modules</h2>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search modules..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
                      />
                      <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                  </div>
                  
                  {filteredModules.length > 0 ? (
                    <div>
                      {filteredModules.map((module) => (
                        <Module
                          key={module.id}
                          module={module}
                          onEdit={handleEditLesson}
                          onDelete={handleDeleteLesson}
                          onView={handleViewLesson}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                      {searchQuery ? (
                        <div>
                          <p className="text-gray-500 mb-4">No modules found matching "{searchQuery}"</p>
                          <button
                            onClick={() => setSearchQuery("")}
                            className="text-blue-600 hover:underline"
                          >
                            Clear search
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h3>
                          <p className="text-gray-500 mb-4">Create your first module to get started</p>
                          <button
                            onClick={() => setActiveTab("create")}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            <Plus className="w-4 h-4 mr-2" /> Create New Module
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {!loading && activeTab === "create" && isEditing && currentLesson && (
                <LessonEditor
                  lesson={currentLesson}
                  onSave={handleSaveEdited}
                  onCancel={() => {
                    setIsEditing(false);
                    setCurrentLesson(null);
                  }}
                />
              )}
              
              {!loading && activeTab === "create" && !isEditing && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-6 flex items-center">
                    <Camera className="w-5 h-5 mr-2 text-blue-500" />
                    Generate New Lesson
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-700 mb-2">Subject/Topic Area</label>
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Mathematics, Biology, Programming"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Specific Concept</label>
                      <input
                        type="text"
                        value={concept}
                        onChange={(e) => setConcept(e.target.value)}
                        placeholder="e.g., Quadratic Equations, Cell Division, Arrays"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Difficulty Level</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={handleGenerateLesson}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                      disabled={!topic || !concept}
                    >
                      <Camera className="w-4 h-4 mr-2" /> Generate Lesson
                    </button>
                  </div>
                  
                  {currentLesson && (
                    <div className="mt-8 border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4">Generated Lesson Preview</h3>
                      <div className="mb-4">
                        <h4 className="text-xl font-bold">{currentLesson.title}</h4>
                        <div className="text-sm text-gray-500 mt-1">
                          {currentLesson.difficulty.charAt(0).toUpperCase() + currentLesson.difficulty.slice(1)} difficulty
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: currentLesson.description }} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <h5 className="font-medium mb-2">Learning Outcomes</h5>
                          <ul className="list-disc pl-5 text-sm text-gray-700">
                            {currentLesson.learningOutcomes.map((outcome, i) => (
                              <li key={i}>{outcome}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Key Concepts</h5>
                          <ul className="list-disc pl-5 text-sm text-gray-700">
                            {currentLesson.keyConcepts.map((concept, i) => (
                              <li key={i}>{concept}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      {relatedConcepts.length > 0 && (
                        <div className="mb-6">
                          <h5 className="font-medium mb-2">Related Concepts</h5>
                          <div className="flex flex-wrap gap-2">
                            {relatedConcepts.map((relatedConcept, i) => (
                              <button
                                key={i}
                                onClick={() => handleUseRelatedConcept(relatedConcept)}
                                className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-full text-sm hover:bg-gray-200"
                              >
                                {relatedConcept}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-end space-x-3 mt-6">
                        <button
                          onClick={() => setCurrentLesson(null)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                        >
                          Discard
                        </button>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 flex items-center"
                        >
                          <Edit3 className="w-4 h-4 mr-2" /> Edit
                        </button>
                        <button
                          onClick={handleSaveLesson}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                        >
                          <Save className="w-4 h-4 mr-2" /> Save Lesson
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {!loading && activeTab === "view" && currentLesson && renderLessonView()}
            </div>
          </main>
          
          <footer className="bg-white border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <p className="text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} CourseGPT - Create AI-powered lessons in seconds
              </p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

import { AlertTriangle, ArrowLeft, Info } from "lucide-react";