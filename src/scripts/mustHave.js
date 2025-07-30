// define subjects that must be taken in each year

export function getMustHaveSubjects(year) {
    if (year === "9") {
      return ["English", "Mathematics", "Science", "Social Studies", "Te Ao Māori", "Health and Physical Education"];
    } else if (year === "10") {
      return ["English", "Mathematics", "Science", "Social Studies", "Health and Physical Education"];
    } else if (year === "11") {
      return ["English", "Mathematics"];
    } else if (year === "12") {
      return ["English"];
    } else if (year === "13") {
      return [];
    }
    return [];
  }
  
