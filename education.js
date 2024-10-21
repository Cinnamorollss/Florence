// education.js

// Define the courses
const educationCourses = [
  // ... (include the course definitions from the previous response)
];

// Education system functions
const EducationSystem = {
  // Get available courses for a player
  getAvailableCourses: function(player) {
    return educationCourses.filter(course => 
      course.availableTo.includes(player.socialClass) &&
      course.prerequisites.every(prereq => player.completedCourses.includes(prereq))
    );
  },

  // Enroll a player in a course
  enrollInCourse: function(player, courseTitle) {
    const course = educationCourses.find(c => c.title === courseTitle);
    
    if (!course) {
      return "Course not found.";
    }
    
    if (!course.availableTo.includes(player.socialClass)) {
      return "This course is not available to your social class.";
    }
    
    if (!course.prerequisites.every(prereq => player.completedCourses.includes(prereq))) {
      return "You do not meet the prerequisites for this course.";
    }
    
    if (player.money < course.cost) {
      return "You cannot afford this course.";
    }
    
    player.money -= course.cost;
    player.currentCourse = {
      title: course.title,
      startDate: getCurrentGameDate(),
      endDate: addMonthsToDate(getCurrentGameDate(), course.duration),
      progress: 0
    };
    
    return `You have enrolled in ${course.title}. Your studies will complete on ${player.currentCourse.endDate}.`;
  },

  // Update education progress
  updateEducationProgress: function(player) {
    if (player.currentCourse) {
      const totalDays = daysBetween(player.currentCourse.startDate, player.currentCourse.endDate);
      const daysPassed = daysBetween(player.currentCourse.startDate, getCurrentGameDate());
      player.currentCourse.progress = Math.min(100, Math.floor((daysPassed / totalDays) * 100));
      
      if (player.currentCourse.progress === 100) {
        this.completeCourse(player);
      }
    }
  },

  // Complete a course
  completeCourse: function(player) {
    const completedCourse = educationCourses.find(c => c.title === player.currentCourse.title);
    player.completedCourses.push(player.currentCourse.title);
    
    // Grant skills based on the completed course
    this.grantSkills(player, completedCourse);
    
    // Unlock new opportunities
    this.unlockOpportunities(player, completedCourse);
    
    player.currentCourse = null;
    return `Congratulations! You have completed the ${completedCourse.title} course.`;
  },

  // Grant skills based on completed course
  grantSkills: function(player, course) {
    // Implement skill granting logic here
    // For example:
    // if (course.title === "Trivium Studies") {
    //   player.skills.grammar += 10;
    //   player.skills.logic += 10;
    //   player.skills.rhetoric += 10;
    // }
  },

  // Unlock new opportunities based on completed course
  unlockOpportunities: function(player, course) {
    // Implement opportunity unlocking logic here
    // For example:
    // if (course.title === "Law") {
    //   player.availableCareers.push("Lawyer");
    // }
  },

  // Helper function to get course details
  getCourseDetails: function(courseTitle) {
    return educationCourses.find(c => c.title === courseTitle);
  }
};

// Helper functions (these should be defined elsewhere in your game logic)
function getCurrentGameDate() {
  // Return the current date in your game
}

function addMonthsToDate(date, months) {
  // Add months to a given date and return the new date
}

function daysBetween(startDate, endDate) {
  // Calculate the number of days between two dates
}

// Export the EducationSystem object
export default EducationSystem;
